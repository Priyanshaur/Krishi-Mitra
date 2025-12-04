import torch
import torch.nn as nn
from torchvision import models, transforms
from fastapi import FastAPI, File, UploadFile, HTTPException
from PIL import Image
import io
import json
import uvicorn
import os
from contextlib import asynccontextmanager

# Configuration
MODEL_PATH = "models/best_model.pth"  # Path to your saved model
CLASSES_PATH = "models/classes.json"  # Path to your classes file
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Global variables to hold model and classes
model = None
class_names = []

# 1. Define Transforms (Must match validation transforms in predict.py)
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

# 2. Load Resources on Startup
@asynccontextmanager
async def lifespan(app: FastAPI):
    global model, class_names
    
    # Load Class Names
    if os.path.exists(CLASSES_PATH):
        with open(CLASSES_PATH, 'r') as f:
            class_names = json.load(f)
    else:
        print(f"Warning: {CLASSES_PATH} not found. Using dummy classes.")
        class_names = ["Disease_1", "Disease_2", "Healthy"] # Fallback

    num_classes = len(class_names)
    print(f"Loading model with {num_classes} classes...")

    # Initialize Model Architecture (MobileNetV2 as used in predict.py)
    model = models.mobilenet_v2(weights=None)
    # Recreate the classifier head
    model.classifier[1] = nn.Linear(model.classifier[1].in_features, num_classes)
    
    # Load Weights
    if os.path.exists(MODEL_PATH):
        try:
            checkpoint = torch.load(MODEL_PATH, map_location=DEVICE)
            # Handle if checkpoint is full dictionary or just state_dict
            if 'model_state_dict' in checkpoint:
                model.load_state_dict(checkpoint['model_state_dict'])
            else:
                model.load_state_dict(checkpoint)
            
            model.to(DEVICE)
            model.eval()
            print("✅ Model loaded successfully!")
        except Exception as e:
            print(f"❌ Error loading model: {e}")
    else:
        print(f"❌ Model file not found at {MODEL_PATH}")
    
    yield
    
    # Clean up resources if needed
    print("Shutting down ML server...")

# Initialize FastAPI with lifespan
app = FastAPI(lifespan=lifespan)

# 3. Prediction Endpoint
@app.post("/predict")
async def predict(image: UploadFile = File(...), crop_type: str = "tomato"):
    if not model:
        raise HTTPException(status_code=503, detail="Model not loaded")

    try:
        # Read and Preprocess Image
        image_data = await image.read()
        img = Image.open(io.BytesIO(image_data)).convert("RGB")
        img_tensor = transform(img).unsqueeze(0).to(DEVICE)

        # Inference
        with torch.no_grad():
            outputs = model(img_tensor)
            probabilities = torch.nn.functional.softmax(outputs, dim=1)
            confidence, predicted_idx = torch.max(probabilities, 1)

        predicted_label = class_names[predicted_idx.item()]
        confidence_score = confidence.item()

        return {
            "disease": predicted_label,
            "confidence": confidence_score,
            "crop_type": crop_type
        }

    except Exception as e:
        print(f"Prediction Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# 4. Recommendations Endpoint (Mock/Simple)
@app.get("/recommendations")
async def get_recommendations(disease: str, crop_type: str):
    # You can expand this with a real database or dictionary lookup
    return {
        "disease": disease,
        "crop_type": crop_type,
        "recommendations": {
            "general": ["Isolate the plant", "Check humidity levels"],
            "chemical": ["Apply fungicide if severe"],
            "organic": ["Use neem oil"]
        }
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)