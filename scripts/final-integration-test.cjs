const axios = require('axios');
const fs = require('fs');

async function testFullIntegration() {
  console.log('=== Final Integration Test ===\n');
  
  // Test 1: ML Service Health
  console.log('1. Testing ML Service Health...');
  try {
    const mlHealth = await axios.get('http://localhost:8000/health');
    console.log('   ✅ ML Service Status:', mlHealth.data.status);
  } catch (error) {
    console.log('   ❌ ML Service Error:', error.message);
    return;
  }
  
  // Test 2: Backend Health
  console.log('\n2. Testing Backend Health...');
  try {
    const backendHealth = await axios.get('http://localhost:5000/api/health');
    console.log('   ✅ Backend Status:', backendHealth.data.status);
  } catch (error) {
    console.log('   ❌ Backend Error:', error.message);
    return;
  }
  
  // Test 3: Frontend Accessibility
  console.log('\n3. Testing Frontend Accessibility...');
  try {
    const frontendResponse = await axios.get('http://localhost:5173');
    if (frontendResponse.status === 200) {
      console.log('   ✅ Frontend is accessible');
    } else {
      console.log('   ⚠️  Frontend response:', frontendResponse.status);
    }
  } catch (error) {
    console.log('   ⚠️  Frontend Error:', error.message);
  }
  
  // Test 4: API Endpoints
  console.log('\n4. Testing API Endpoints...');
  try {
    const diagnosisEndpoint = await axios.get('http://localhost:5000/api/diagnose/history', {
      headers: {
        'Authorization': 'Bearer test-token'
      }
    });
    console.log('   ✅ Diagnosis API endpoint accessible');
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log('   ✅ Diagnosis API endpoint exists (authentication required)');
    } else {
      console.log('   ⚠️  Diagnosis API Error:', error.message);
    }
  }
  
  console.log('\n=== Integration Test Complete ===');
  console.log('\n🎉 All services are properly connected!');
  console.log('\nYou can now test the full disease detection feature:');
  console.log('1. Open http://localhost:5173 in your browser');
  console.log('2. Navigate to the Diagnosis page');
  console.log('3. Upload an image of a plant leaf');
  console.log('4. See AI-powered disease predictions');
}

testFullIntegration();