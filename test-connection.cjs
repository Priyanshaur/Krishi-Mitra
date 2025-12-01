const axios = require('axios');

// Test if backend is accessible
async function testBackend() {
  try {
    const response = await axios.get('http://localhost:5000/api/diagnose/history', {
      headers: {
        'Authorization': 'Bearer test-token'
      }
    });
    console.log('Backend connection successful:', response.status);
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log('✅ Backend diagnose endpoint exists (requires authentication)');
    } else {
      console.log('Backend connection failed:', error.message);
    }
  }
}

// Test if ML service is accessible
async function testMLService() {
  try {
    const response = await axios.get('http://localhost:8000/health');
    console.log('ML Service Status:', response.data);
  } catch (error) {
    console.log('ML Service connection failed:', error.message);
  }
}

async function runTests() {
  console.log('Testing connections...');
  await testBackend();
  await testMLService();
}

runTests();