const axios = require('axios');

async function testBackend() {
  try {
    console.log('Testing backend health endpoint...');
    const response = await axios.get('http://localhost:5000/api/health');
    console.log('Backend Status:', response.data);
    
    console.log('\nTesting diagnosis endpoint...');
    try {
      const diagnosisResponse = await axios.get('http://localhost:5000/api/diagnose/history', {
        headers: {
          'Authorization': 'Bearer test-token'
        }
      });
      console.log('Diagnosis endpoint accessible');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('✅ Diagnosis endpoint exists (requires authentication)');
      } else {
        console.log('Diagnosis endpoint error:', error.message);
      }
    }
  } catch (error) {
    console.log('Backend test failed:', error.message);
  }
}

testBackend();