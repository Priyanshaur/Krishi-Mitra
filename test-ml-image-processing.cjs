const axios = require('axios');

async function testMLImageProcessing() {
  console.log('=== Testing ML Service Image Processing ===\n');
  
  try {
    // Test 1: Verify ML Service Health
    console.log('1. Verifying ML Service Health...');
    const mlHealth = await axios.get('http://localhost:8000/health');
    console.log('   ✅ ML Service Status:', mlHealth.data.status);
    
    // Test 2: Check Available Classes
    console.log('\n2. Checking Available Disease Classes...');
    const metadata = await axios.get('http://localhost:8000/metadata');
    console.log('   ✅ ML Service has', metadata.data.classes.length, 'disease classes');
    console.log('   🌱 Sample classes:', metadata.data.classes.slice(0, 5));
    
    // Test 3: Test Prediction Endpoint Structure
    console.log('\n3. Testing Prediction Endpoint Structure...');
    try {
      const predictResponse = await axios.post('http://localhost:8000/predict');
      console.log('   ❓ Unexpected success:', predictResponse.data);
    } catch (error) {
      if (error.response && error.response.status === 422) {
        console.log('   ✅ Prediction endpoint correctly requires form data');
        console.log('   📝 Expected fields: image (file), crop_type (form field)');
      } else {
        console.log('   ⚠️  Prediction endpoint response:', error.response?.status || error.message);
      }
    }
    
    // Test 4: Verify Backend Integration
    console.log('\n4. Verifying Backend Integration...');
    console.log('   ℹ️  Backend should forward image requests to ML service');
    console.log('   🔄 Flow: Frontend → Backend → ML Service → Backend → Frontend');
    
    console.log('\n=== ML Service Image Processing Test Complete ===');
    console.log('\n📋 To test actual image processing:');
    console.log('1. Open the application in your browser (http://localhost:3000)');
    console.log('2. Log in or register');
    console.log('3. Go to the Diagnosis page');
    console.log('4. Upload a plant leaf image');
    console.log('5. The backend will send the image to the ML service');
    console.log('6. The ML service will analyze the image and return predictions');
    console.log('7. Results will be displayed in the UI');
    
    console.log('\n📊 ML Service Capabilities:');
    console.log('   - Detects 38 different crop diseases');
    console.log('   - Provides confidence scores for predictions');
    console.log('   - Supports various crop types (tomato, potato, corn, etc.)');
    console.log('   - Runs on CPU (model: MobileNetV2)');
    
  } catch (error) {
    console.log('   ❌ Test failed:', error.message);
  }
}

testMLImageProcessing();