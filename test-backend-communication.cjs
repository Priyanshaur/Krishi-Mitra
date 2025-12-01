const axios = require('axios');
const fs = require('fs');

async function testBackendCommunication() {
  console.log('=== Testing Backend to ML Service Communication ===\n');
  
  try {
    // Test 1: Backend health
    console.log('1. Testing backend health...');
    const backendHealth = await axios.get('http://localhost:5000/api/health');
    console.log('   ✅ Backend status:', backendHealth.data.status);
    
    // Test 2: ML service health through backend
    console.log('\n2. Testing ML service health through backend...');
    try {
      // This will test if the backend can reach the ML service
      const mlService = require('./backend/src/services/mlService.js');
      // We can't directly test this without proper setup, so let's check the health endpoint
      console.log('   ℹ️  ML service integration would be tested through diagnosis requests');
    } catch (error) {
      console.log('   ⚠️  Direct ML service test not possible in this context');
    }
    
    // Test 3: Diagnosis endpoint accessibility
    console.log('\n3. Testing diagnosis endpoint structure...');
    try {
      // Test without authentication first
      const diagnosisResponse = await axios.post('http://localhost:5000/api/diagnose', {});
      console.log('   ❓ Unexpected success:', diagnosisResponse.data);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          console.log('   ✅ Diagnosis endpoint requires authentication (correct)');
        } else if (error.response.status === 400) {
          console.log('   ✅ Diagnosis endpoint accessible (correctly rejects requests without image)');
        } else {
          console.log('   ⚠️  Diagnosis endpoint response:', error.response.status);
        }
      } else {
        console.log('   ❌ Diagnosis endpoint error:', error.message);
      }
    }
    
    console.log('\n=== Backend Communication Test Complete ===');
    console.log('\n📋 To fully test ML service integration:');
    console.log('1. Log in to the application');
    console.log('2. Upload an image through the diagnosis feature');
    console.log('3. Check if the ML service processes the image correctly');
    console.log('4. Verify the results are displayed in the UI');
    
  } catch (error) {
    console.log('   ❌ General error:', error.message);
  }
}

testBackendCommunication();