const axios = require('axios');
const fs = require('fs');

async function debugDiagnosis() {
  console.log('=== Debugging Diagnosis Flow ===\n');
  
  try {
    // Step 1: Register a test user
    console.log('1. Registering test user...');
    const registerResponse = await axios.post('http://localhost:5000/api/auth/register', {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'password123',
      role: 'farmer'
    });
    console.log('   ✅ User registered successfully');
    const token = registerResponse.data.token;
    console.log('   Token length:', token?.length || 'null');
    
    // Step 2: Test ML service health
    console.log('\n2. Testing ML service health...');
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
    
    // Step 3: Test backend health
    console.log('\n3. Testing backend health...');
    try {
      const backendHealth = await axios.get('http://localhost:5000/api/health', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('   ✅ Backend Status:', backendHealth.data.status);
    } catch (error) {
      console.log('   ❌ Backend Health Error:', error.message);
      return;
    }
    
    // Step 4: Test diagnosis endpoint accessibility
    console.log('\n4. Testing diagnosis endpoint accessibility...');
    try {
      const diagnosisTest = await axios.get('http://localhost:5000/api/diagnose/history', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('   ✅ Diagnosis history endpoint accessible');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('   ⚠️  Diagnosis endpoint requires authentication (expected)');
      } else {
        console.log('   ❌ Diagnosis endpoint error:', error.message);
        if (error.response) {
          console.log('   Response status:', error.response.status);
          console.log('   Response data:', error.response.data);
        }
      }
    }
    
    // Step 5: Test actual diagnosis with a sample image
    console.log('\n5. Testing actual diagnosis with sample data...');
    try {
      // Create a minimal form data simulation
      const formData = new FormData();
      console.log('   📦 Preparing diagnosis request...');
      
      // Note: We can't easily test the full image upload without a real image file
      // But we can test the endpoint structure
      console.log('   📝 Diagnosis request would include:');
      console.log('   - Image file (multipart/form-data)');
      console.log('   - cropType: tomato');
      console.log('   - notes: Test diagnosis');
      
    } catch (error) {
      console.log('   ❌ Diagnosis request preparation error:', error.message);
    }
    
    console.log('\n=== Debug Complete ===');
    console.log('\n📋 Next debugging steps:');
    console.log('1. Check browser console for detailed error messages');
    console.log('2. Check Network tab in browser dev tools for failed requests');
    console.log('3. Verify all services are running on correct ports:');
    console.log('   - ML Service: http://localhost:8000');
    console.log('   - Backend: http://localhost:5000');
    console.log('   - Frontend: http://localhost:3001');
    console.log('4. Ensure you are logged in before testing diagnosis');
    
  } catch (error) {
    console.log('   ❌ General Error:', error.message);
    if (error.response) {
      console.log('   Response status:', error.response.status);
      console.log('   Response data:', error.response.data);
    }
  }
}

debugDiagnosis();