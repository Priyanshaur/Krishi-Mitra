const axios = require('axios');
const fs = require('fs');

async function testFullIntegration() {
  console.log('=== Testing Full Disease Detection Integration ===\n');
  
  // 1. Test ML Service Health
  console.log('1. Testing ML Service Health...');
  try {
    const mlHealth = await axios.get('http://localhost:8000/health');
    console.log('   ✅ ML Service Status:', mlHealth.data.status);
    console.log('   📊 Model Info:', {
      device: mlHealth.data.device,
      classes: mlHealth.data.num_classes,
      architecture: mlHealth.data.model_arch
    });
  } catch (error) {
    console.log('   ❌ ML Service Error:', error.message);
    return;
  }
  
  // 2. Test ML Service Metadata
  console.log('\n2. Testing ML Service Metadata...');
  try {
    const mlMetadata = await axios.get('http://localhost:8000/metadata');
    console.log('   ✅ ML Service Metadata Loaded');
    console.log('   📋 Available Classes:', mlMetadata.data.classes.length);
    if (mlMetadata.data.classes.length > 0) {
      console.log('   🌱 Sample Diseases:', mlMetadata.data.classes.slice(0, 5));
    }
  } catch (error) {
    console.log('   ❌ ML Metadata Error:', error.message);
  }
  
  // 3. Test Backend Connection
  console.log('\n3. Testing Backend Connection...');
  try {
    const backendHealth = await axios.get('http://localhost:5000/api/diagnose/history', {
      headers: {
        'Authorization': 'Bearer test-token'
      }
    });
    console.log('   ✅ Backend Diagnosis Endpoint Accessible');
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log('   ✅ Backend Diagnosis Endpoint Exists (Authentication Required)');
    } else {
      console.log('   ⚠️  Backend Connection Issue:', error.message);
    }
  }
  
  console.log('\n=== Integration Test Complete ===');
  console.log('\nNext Steps:');
  console.log('1. Ensure all services are running:');
  console.log('   - Frontend: http://localhost:5173');
  console.log('   - Backend: http://localhost:5000');
  console.log('   - ML Service: http://localhost:8000');
  console.log('2. Test the diagnosis feature in the frontend UI');
  console.log('3. Upload an image to see AI-powered predictions');
}

testFullIntegration();