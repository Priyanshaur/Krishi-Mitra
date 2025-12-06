"""FastAPI inference service for Krishi Mitra plant disease models.

This service loads a trained PyTorch/TorchScript model from the `ml/models`
directory (or a custom path supplied via environment variables) and exposes a
`/predict` endpoint that mirrors the contract expected by the Node backend.

Environment variables:
  - MODEL_PATH: Absolute/relative path to the model file (.pt or .pth).
  - MODEL_DIR: Directory to search for default model artefacts.
  - CLASS_MAP_PATH: Optional JSON that maps class indices to rich metadata.
  - MODEL_ARCH: Architecture to instantiate when loading state_dict models
				(default: mobilenet_v2).
"""

from __future__ import annotations

import io
import json
import os
from pathlib import Path
from typing import Any, Dict, List

import torch
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from torchvision import models, transforms
from dotenv import load_dotenv


load_dotenv()

BASE_DIR = Path(__file__).resolve().parent
DEFAULT_MODEL_DIR = BASE_DIR / "models"
MODEL_DIR = Path(os.getenv("MODEL_DIR", DEFAULT_MODEL_DIR))


def _resolve_model_path() -> Path:
	explicit_path = os.getenv("MODEL_PATH")
	if explicit_path:
		return Path(explicit_path)

	scripted_default = MODEL_DIR / "plant_disease_model.pt"
	if scripted_default.exists():
		return scripted_default

	best_default = MODEL_DIR / "best_model.pth"
	if best_default.exists():
		return best_default

	final_default = MODEL_DIR / "final_model.pth"
	if final_default.exists():
		return final_default

	raise FileNotFoundError(
		"No model artefact found. Set MODEL_PATH or place a .pt/.pth file in ml/models/."
	)


MODEL_PATH = _resolve_model_path()
CLASS_MAP_PATH = Path(os.getenv("CLASS_MAP_PATH", MODEL_DIR / "classes.json"))
MODEL_ARCH = os.getenv("MODEL_ARCH", "mobilenet_v2").lower()
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")


inference_transforms = transforms.Compose(
	[
		transforms.Resize((224, 224)),
		transforms.ToTensor(),
		transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
	]
)


class_metadata: List[Dict[str, Any]] = []
class_names: List[str] = []
model: torch.nn.Module | torch.jit.ScriptModule | None = None


def _shape_metadata(entry: Any, index: int) -> Dict[str, Any]:
	if isinstance(entry, dict):
		label = entry.get("label") or entry.get("disease") or entry.get("name")
		common_name = entry.get("common_name") or entry.get("commonName")
		scientific_name = entry.get("scientific_name") or entry.get("scientificName")
		return {
			"label": label or f"class_{index}",
			"common_name": common_name,
			"scientific_name": scientific_name,
			**{k: v for k, v in entry.items() if k not in {"label", "disease", "name", "common_name", "commonName", "scientific_name", "scientificName"}},
		}

	if isinstance(entry, str):
		return {"label": entry, "common_name": None, "scientific_name": None}

	return {"label": f"class_{index}", "common_name": None, "scientific_name": None}


def _load_class_metadata(num_classes_hint: int | None = None) -> List[Dict[str, Any]]:
	if CLASS_MAP_PATH.exists():
		with CLASS_MAP_PATH.open("r", encoding="utf-8") as fp:
			data = json.load(fp)

		if isinstance(data, dict):
			# Sort by numeric key if possible to retain ordering
			try:
				items = [data[str(i)] for i in range(len(data))]
			except KeyError:
				items = list(data.values())
		elif isinstance(data, list):
			items = data
		else:
			items = []
	else:
		items = []

	if not items and num_classes_hint:
		return [_shape_metadata(None, idx) for idx in range(num_classes_hint)]

	return [_shape_metadata(item, idx) for idx, item in enumerate(items)]


def _build_model(num_classes: int) -> torch.nn.Module:
	if MODEL_ARCH == "mobilenet_v2":
		net = models.mobilenet_v2(weights=None)
		net.classifier[1] = torch.nn.Linear(net.classifier[1].in_features, num_classes)
		return net

	if MODEL_ARCH == "improved_cnn":
		# Lazy import to avoid pulling training dependencies unnecessarily
		from routes.predict import ImprovedCNN  # type: ignore

		return ImprovedCNN(num_classes=num_classes)

	raise ValueError(f"Unsupported MODEL_ARCH '{MODEL_ARCH}'. Supported options: mobilenet_v2, improved_cnn")


def _load_model() -> None:
    global model, class_metadata, class_names

    scripted = MODEL_PATH.suffix == ".pt" and os.getenv("FORCE_STATE_DICT", "false").lower() != "true"

    if scripted:
        loaded_model = torch.jit.load(str(MODEL_PATH), map_location=DEVICE)
        loaded_model.eval()
        loaded_model.to(DEVICE)
        class_metadata = _load_class_metadata()
        class_names = [meta.get("label", f"class_{idx}") for idx, meta in enumerate(class_metadata)]
        model = loaded_model
        return

    state = torch.load(str(MODEL_PATH), map_location=DEVICE)
    # Handle case where state dict is nested within a checkpoint
    if isinstance(state, dict):
        if "state_dict" in state:
            state = state["state_dict"]
        elif "model_state_dict" in state:
            state = state["model_state_dict"]
        # If we still have checkpoint metadata, try to extract just the model weights
        elif any(key.startswith("features.") or key.startswith("classifier.") for key in state.keys()):
            # This looks like the actual model state dict
            pass
        else:
            # Try to find the model state in the checkpoint
            for key in state:
                if isinstance(state[key], dict) and (any(k.startswith("features.") for k in state[key].keys()) or any(k.startswith("classifier.") for k in state[key].keys())):
                    state = state[key]
                    break

    if not isinstance(state, dict):
        raise RuntimeError("Unsupported model checkpoint format. Provide a state_dict or TorchScript module.")

    if "classifier.1.weight" in state:
        num_classes = state["classifier.1.weight"].shape[0]
    else:
        num_classes = int(os.getenv("MODEL_NUM_CLASSES", 0))
        if num_classes <= 0:
            raise RuntimeError(
                "Unable to infer number of classes from checkpoint. Set MODEL_NUM_CLASSES or provide a TorchScript model."
            )

    class_metadata = _load_class_metadata(num_classes)
    if not class_metadata:
        class_metadata = [_shape_metadata(None, idx) for idx in range(num_classes)]
    class_names = [meta.get("label", f"class_{idx}") for idx, meta in enumerate(class_metadata)]

    net = _build_model(num_classes)
    net.load_state_dict(state, strict=False)  # Use strict=False to ignore missing keys
    net.to(DEVICE)
    net.eval()
    model = net


def _prepare_image(image_bytes: bytes) -> torch.Tensor:
	try:
		pil_image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
	except Exception as exc:
		raise HTTPException(status_code=400, detail=f"Unable to read image: {exc}") from exc

	tensor = inference_transforms(pil_image).unsqueeze(0)
	return tensor.to(DEVICE)


def _format_prediction(probabilities: torch.Tensor) -> Dict[str, Any]:
	probs = torch.softmax(probabilities, dim=1)
	top_scores, top_indices = torch.topk(probs, k=min(3, probs.shape[1]))

	def _pack(idx: int, score: float) -> Dict[str, Any]:
		meta = class_metadata[idx] if idx < len(class_metadata) else {"label": f"class_{idx}"}
		return {
			"label": meta.get("label", f"class_{idx}"),
			"score": float(score),
			"common_name": meta.get("common_name"),
			"scientific_name": meta.get("scientific_name"),
			"metadata": meta,
		}

	top_k = [_pack(int(idx), float(score)) for score, idx in zip(top_scores[0], top_indices[0])]
	primary = top_k[0]

	return {
		"disease": primary["label"],
		"confidence": primary["score"],
		"common_name": primary.get("common_name"),
		"scientific_name": primary.get("scientific_name"),
		"top_k": top_k,
	}


def _ensure_model_loaded() -> None:
	if model is None:
		raise HTTPException(status_code=503, detail="Model is not loaded. Check server logs for details.")


app = FastAPI(title="Krishi Mitra ML Service", version="1.0.0")
app.add_middleware(
	CORSMiddleware,
	allow_origins=[origin.strip() for origin in os.getenv("CORS_ALLOW_ORIGINS", "*").split(",")],
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)


@app.on_event("startup")
def load_model() -> None:
	try:
		MODEL_DIR.mkdir(parents=True, exist_ok=True)
		_load_model()
		if isinstance(model, torch.nn.Module):
			model.to(DEVICE)
		print(f"Model loaded from {MODEL_PATH} on device {DEVICE}")
	except Exception as exc:  # pylint: disable=broad-except
		print(f"Failed to load model: {exc}")
		raise


@app.get("/health")
def health() -> Dict[str, Any]:
	return {
		"status": "ok" if model is not None else "error",
		"device": str(DEVICE),
		"model_path": str(MODEL_PATH),
		"num_classes": len(class_metadata),
		"model_arch": MODEL_ARCH,
	}


@app.get("/metadata")
def metadata() -> Dict[str, Any]:
	_ensure_model_loaded()
	return {
		"classes": class_names,
		"metadata": class_metadata,
		"model_arch": MODEL_ARCH,
	}



# Map frontend crop types to class prefixes
CROP_PREFIX_MAP = {
    "apple": "Apple___",
    "blueberry": "Blueberry___",
    "cherry": "Cherry_(including_sour)___",
    "corn": "Corn_(maize)___",
    "grape": "Grape___",
    "orange": "Orange___",
    "peach": "Peach___",
    "pepper": "Pepper,_bell___",
    "potato": "Potato___",
    "raspberry": "Raspberry___",
    "soybean": "Soybean___",
    "squash": "Squash___",
    "strawberry": "Strawberry___",
    "tomato": "Tomato___",
}

@app.post("/predict")
async def predict(
	image: UploadFile = File(...),
	crop_type: str = Form("general"),
) -> Dict[str, Any]:
	_ensure_model_loaded()

	print(f"DEBUG: Received prediction request for crop_type='{crop_type}'")

	# List of crops NOT supported by the trained model
	UNSUPPORTED_CROPS = {"wheat", "rice", "sugarcane", "cotton"}
	if crop_type.lower() in UNSUPPORTED_CROPS:
		raise HTTPException(status_code=400, detail=f"Analysis not supported for crop: {crop_type}")


	if image.content_type not in {"image/jpeg", "image/png", "image/jpg", "application/octet-stream"}:
		raise HTTPException(status_code=415, detail="Unsupported file type. Please upload a JPG or PNG image.")

	image_bytes = await image.read()
	if not image_bytes:
		raise HTTPException(status_code=400, detail="Uploaded file is empty.")

	input_tensor = _prepare_image(image_bytes)

	with torch.no_grad():
		logits = model(input_tensor)  # type: ignore[arg-type]
        
		# Apply crop filtering
		crop_key = crop_type.lower().strip()
		if crop_key in CROP_PREFIX_MAP:
			prefix = CROP_PREFIX_MAP[crop_key]
			# Create a mask: -inf for invalid classes, 0 for valid classes
			mask = torch.full_like(logits, float('-inf'))
			
			valid_indices = [i for i, name in enumerate(class_names) if name.startswith(prefix)]
			
			if valid_indices:
				mask[:, valid_indices] = 0
				# Add mask to logits (broadcasting works)
				logits = logits + mask
			else:
				print(f"Warning: No classes found for crop '{crop_key}' with prefix '{prefix}'. Skipping filter.")

	# Debug: Print top 5 probabilities
	probs = torch.softmax(logits, dim=1)
	top5_probs, top5_indices = torch.topk(probs, k=5)
	print(f"\n--- Prediction for {crop_type} ---")
	for i in range(5):
		idx = top5_indices[0][i].item()
		score = top5_probs[0][i].item()
		name = class_names[idx]
		print(f"{i+1}. {name}: {score*100:.2f}%")
	print("----------------------------------\n")

	prediction = _format_prediction(logits)
	prediction.update(
		{
			"crop_type": crop_type,
			"model_path": str(MODEL_PATH),
			"device": str(DEVICE),
			"source": "ml-service",
		}
	)

	return prediction


if __name__ == "__main__":
	import uvicorn

	uvicorn.run(
		"app:app",
		host="0.0.0.0",
		port=int(os.getenv("PORT", "8000")),
		reload=os.getenv("UVICORN_RELOAD", "false").lower() == "true",
	)

