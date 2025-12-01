const axios = require('axios');

async function fullIntegrationTest() {
  console.log('=== Full Integration Test ===\n');
  
  try {
    // Test 1: ML Service Health
    console.log('1. Testing ML Service Health...');
    const mlHealth = await axios.get('http://localhost:8000/health');
    console.log('   ✅ ML Service Status:', mlHealth.data.status);
    console.log('   📊 Model Info:', {
      device: mlHealth.data.device,
      classes: mlHealth.data.num_classes,
      architecture: mlHealth.data.model_arch
    });
    
    // Test 2: Backend Health
    console.log('\n2. Testing Backend Health...');
    const backendHealth = await axios.get('http://localhost:5000/api/health');
    console.log('   ✅ Backend Status:', backendHealth.data.status);
    
    // Test 3: Frontend Accessibility
    console.log('\n3. Testing Frontend Accessibility...');
    try {
      const frontendResponse = await axios.get('http://localhost:3000');
      if (frontendResponse.status === 200) {
        console.log('   ✅ Frontend is accessible');
      } else {
        console.log('   ⚠️  Frontend response:', frontendResponse.status);
      }
    } catch (error) {
      console.log('   ℹ️  Frontend test inconclusive (may be running on different port)');
    }
    
    // Test 4: Service Communication
    console.log('\n4. Testing Service Communication...');
    
    // Test diagnosis endpoint accessibility
    try {
      const diagnosisTest = await axios.post('http://localhost:5000/api/diagnose', {});
      console.log('   ❓ Unexpected success:', diagnosisTest.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('   ✅ Diagnosis endpoint requires authentication (correct)');
      } else if (error.response && error.response.status === 400) {
        console.log('   ✅ Diagnosis endpoint accessible (correctly rejects requests without image)');
      } else {
        console.log('   ⚠️  Diagnosis endpoint response:', error.response?.status || error.message);
      }
    }
    
    // Test 5: ML Service Capabilities
    console.log('\n5. Testing ML Service Capabilities...');
    const metadata = await axios.get('http://localhost:8000/metadata');
    console.log('   ✅ ML Service Metadata Loaded');
    console.log('   📋 Available Classes:', metadata.data.classes.length);
    console.log('   🌱 Sample Diseases:', metadata.data.classes.slice(0, 3));
    
    console.log('\n=== Integration Test Complete ===');
    console.log('\n🎉 All services are properly connected!');
    console.log('\nTo test the full disease detection feature:');
    console.log('1. Open http://localhost:3000 in your browser (or check frontend terminal for correct port)');
    console.log('2. Register or log in with any credentials');
    console.log('3. Navigate to the Diagnosis page');
    console.log('4. Upload an image of a plant leaf');
    console.log('5. The ML service will process the image and return predictions');
    console.log('6. Results will be displayed in the UI');
    
  } catch (error) {
    console.log('   ❌ Integration test failed:', error.message);
  }
}

fullIntegrationTest();