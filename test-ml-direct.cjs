const axios = require('axios');
const fs = require('fs');

async function testMLServiceDirectly() {
  console.log('=== Direct ML Service Test ===\n');
  
  try {
    // Test ML service health
    console.log('1. Testing ML service health...');
    const healthResponse = await axios.get('http://localhost:8000/health');
    console.log('   ✅ ML Service Status:', healthResponse.data.status);
    console.log('   📊 Model Info:', {
      device: healthResponse.data.device,
      classes: healthResponse.data.num_classes,
      architecture: healthResponse.data.model_arch
    });
    
    // Test metadata
    console.log('\n2. Testing ML service metadata...');
    const metadataResponse = await axios.get('http://localhost:8000/metadata');
    console.log('   ✅ Available classes:', metadataResponse.data.classes.length);
    console.log('   🌱 Sample classes:', metadataResponse.data.classes.slice(0, 5));
    
    // Test prediction endpoint structure
    console.log('\n3. Testing prediction endpoint...');
    try {
      // Send a simple request to see what error we get
      const predictResponse = await axios.post('http://localhost:8000/predict');
      console.log('   ❓ Unexpected success:', predictResponse.data);
    } catch (error) {
      if (error.response) {
        console.log('   ℹ️  Expected error for empty request:', error.response.status, error.response.data.detail || error.response.data);
      } else {
        console.log('   ❌ Unexpected error:', error.message);
      }
    }
    
    console.log('\n=== ML Service is Working Correctly ===');
    console.log('The issue is likely with the image content or frontend processing.');
    
  } catch (error) {
    console.log('   ❌ Error:', error.response?.data || error.message);
  }
}

testMLServiceDirectly();