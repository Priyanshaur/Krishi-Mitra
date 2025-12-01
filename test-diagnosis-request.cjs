const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function testDiagnosisRequest() {
  console.log('=== Testing Diagnosis Request ===\n');
  
  try {
    // First register a test user to get a token
    console.log('1. Registering test user...');
    const registerResponse = await axios.post('http://localhost:5000/api/auth/register', {
      name: 'Test User',
      email: 'test' + Date.now() + '@example.com', // Unique email
      password: 'password123',
      role: 'farmer'
    });
    console.log('   ✅ User registered successfully');
    const token = registerResponse.data.token;
    console.log('   Token:', token ? `${token.substring(0, 20)}...` : 'null');
    
    // Test the diagnosis endpoint structure and authentication
    console.log('\n2. Testing diagnosis endpoint accessibility...');
    
    try {
      // Send a request without an image to test the endpoint structure
      const diagnosisResponse = await axios.post('http://localhost:5000/api/diagnose', 
        {}, // Empty body to trigger "no image" error
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      console.log('   ❓ Unexpected success:', diagnosisResponse.data);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400 && error.response.data.message === 'Please upload an image') {
          console.log('   ✅ Diagnosis endpoint accessible (correctly rejects requests without image)');
          console.log('   📊 Error response:', error.response.data);
        } else {
          console.log('   ⚠️  Diagnosis endpoint response:', error.response.status);
          console.log('   📊 Response data:', error.response.data);
        }
      } else {
        console.log('   ❌ Diagnosis endpoint error:', error.message);
      }
    }
    
    console.log('\n=== Test Complete ===');
    console.log('\n📋 To test the full diagnosis feature in UI:');
    console.log('1. Open http://localhost:3000 in your browser');
    console.log('2. Register or log in to the application');
    console.log('3. Navigate to the Diagnosis page');
    console.log('4. Upload an image of a plant leaf');
    console.log('5. Check browser console for detailed logs');
    console.log('6. Look for messages like "Sending diagnosis request..." and "Diagnosis result received:"');
    
  } catch (error) {
    console.log('   ❌ Error:', error.message);
    if (error.response) {
      console.log('   Response status:', error.response.status);
      console.log('   Response data:', error.response.data);
    }
  }
}

testDiagnosisRequest();