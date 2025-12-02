const axios = require('axios');

async function testCompleteDiagnosis() {
  console.log('=== Complete Diagnosis Test ===\n');
  
  try {
    // Step 1: Login with existing user (instead of registering)
    console.log('1. Logging in with test user...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'test@example.com',
      password: 'password123'
    });
    console.log('   ✅ User logged in successfully');
    const token = loginResponse.data.token;
    console.log('   Token length:', token?.length || 'null');
    
    // Step 2: Test ML service health
    console.log('\n2. Testing ML service health...');
    try {
      const mlHealth = await axios.get('http://localhost:8000/health');
      console.log('   ✅ ML Service Status:', mlHealth.data.status);
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
    
    // Step 4: Test diagnosis history endpoint
    console.log('\n4. Testing diagnosis history endpoint...');
    try {
      const historyResponse = await axios.get('http://localhost:5000/api/diagnose/history', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('   ✅ Diagnosis history endpoint working');
      console.log('   📊 History data:', {
        total: historyResponse.data.pagination?.total || 0,
        pages: historyResponse.data.pagination?.pages || 0
      });
    } catch (error) {
      console.log('   ⚠️  Diagnosis history error:', error.message);
      if (error.response) {
        console.log('   Response status:', error.response.status);
      }
    }
    
    console.log('\n=== Test Complete ===');
    console.log('\n📋 To test the full diagnosis feature in UI:');
    console.log('1. Open http://localhost:3001 in your browser');
    console.log('2. Log in with email: test@example.com, password: password123');
    console.log('3. Navigate to the Diagnosis page');
    console.log('4. Upload an image of a plant leaf');
    console.log('5. Check browser console for detailed logs');
    
  } catch (error) {
    console.log('   ❌ General Error:', error.message);
    if (error.response) {
      console.log('   Response status:', error.response.status);
      console.log('   Response data:', error.response.data);
    }
  }
}

testCompleteDiagnosis();