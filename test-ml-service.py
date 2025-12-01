import requests
import json

# Test the ML service endpoints
def test_ml_service():
    print("=== Testing ML Service ===")
    
    # Test 1: Health endpoint
    print("\n1. Testing health endpoint...")
    try:
        response = requests.get("http://localhost:8000/health")
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Health check passed: {data['status']}")
            print(f"   📊 Model info: {data['num_classes']} classes, {data['model_arch']} architecture")
        else:
            print(f"   ❌ Health check failed with status {response.status_code}")
    except Exception as e:
        print(f"   ❌ Health check error: {e}")
    
    # Test 2: Metadata endpoint
    print("\n2. Testing metadata endpoint...")
    try:
        response = requests.get("http://localhost:8000/metadata")
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Metadata retrieved: {len(data['classes'])} classes available")
            print(f"   🌱 Sample classes: {data['classes'][:3]}")
        else:
            print(f"   ❌ Metadata request failed with status {response.status_code}")
    except Exception as e:
        print(f"   ❌ Metadata request error: {e}")
    
    # Test 3: Predict endpoint (without file)
    print("\n3. Testing predict endpoint structure...")
    try:
        response = requests.post("http://localhost:8000/predict")
        if response.status_code == 422:
            print("   ✅ Predict endpoint accessible (correctly requires form data)")
        else:
            print(f"   ⚠️  Predict endpoint response: {response.status_code}")
    except Exception as e:
        print(f"   ❌ Predict endpoint error: {e}")
    
    print("\n=== ML Service Test Complete ===")

if __name__ == "__main__":
    test_ml_service()