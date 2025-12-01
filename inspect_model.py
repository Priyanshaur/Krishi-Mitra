import torch
import os
import json

MODEL_PATH = "ml/models/best_model.pth"
CLASSES_PATH = "ml/models/classes.json"

def inspect():
    if not os.path.exists(MODEL_PATH):
        print(f"Model not found at {MODEL_PATH}")
        return

    try:
        state = torch.load(MODEL_PATH, map_location="cpu")
        print("Model loaded.")
        
        if isinstance(state, dict):
            if "state_dict" in state:
                state = state["state_dict"]
            elif "model_state_dict" in state:
                state = state["model_state_dict"]
        
        # Try to find classifier weights
        keys = list(state.keys())
        classifier_keys = [k for k in keys if "classifier" in k and "weight" in k]
        print(f"Classifier keys found: {classifier_keys}")
        
        for k in classifier_keys:
            print(f"{k}: {state[k].shape}")
            
        # Check classes.json
        if os.path.exists(CLASSES_PATH):
            with open(CLASSES_PATH, 'r') as f:
                classes = json.load(f)
            print(f"classes.json has {len(classes)} classes")
        else:
            print("classes.json not found")

    except Exception as e:
        print(f"Error inspecting model: {e}")

if __name__ == "__main__":
    inspect()
