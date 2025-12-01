// Simple test to debug the diagnosis issue
async function testDiagnosis() {
  try {
    console.log('Testing diagnosis flow...');
    
    // First check if ML service is running
    const mlHealth = await fetch('http://localhost:8000/health');
    const mlData = await mlHealth.json();
    console.log('ML Service Status:', mlData);
    
    if (mlData.status !== 'ok') {
      console.log('❌ ML Service is not running properly');
      return;
    }
    
    console.log('✅ ML Service is running');
    
    // Check if backend is running
    const backendHealth = await fetch('http://localhost:5000/api/diagnose/history', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer invalid-token' // We expect 401 for unauthorized
      }
    });
    
    console.log('Backend diagnose endpoint status:', backendHealth.status);
    
    if (backendHealth.status === 401) {
      console.log('✅ Backend diagnose endpoint exists (requires authentication)');
    } else {
      console.log('ℹ️ Backend diagnose endpoint response:', backendHealth.status);
    }
    
    console.log('\nTo test the full diagnosis flow:');
    console.log('1. Make sure you are logged in to the frontend application');
    console.log('2. Upload an image through the diagnosis page');
    console.log('3. Check browser console for any errors');
    console.log('4. Check network tab for failed requests');
    
  } catch (error) {
    console.log('Error testing diagnosis:', error.message);
  }
}

testDiagnosis();