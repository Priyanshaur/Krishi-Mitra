// Test function to verify diagnosis integration
export const testDiagnosisIntegration = async () => {
  console.log('Testing diagnosis integration...');
  
  try {
    // Test ML service connection
    const mlResponse = await fetch('http://localhost:8000/health');
    const mlData = await mlResponse.json();
    console.log('ML Service Status:', mlData);
    
    if (mlData.status === 'ok') {
      console.log('✅ ML Service is running properly');
    } else {
      console.log('❌ ML Service is not running properly');
    }
    
    // Test backend connection
    const backendResponse = await fetch('http://localhost:5000/api/diagnose/history', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer test-token'
      }
    });
    
    if (backendResponse.status === 401) {
      console.log('✅ Backend diagnose endpoint exists (requires authentication)');
    } else {
      console.log('ℹ️ Backend diagnose endpoint response:', backendResponse.status);
    }
  } catch (error) {
    console.log('Connection test error:', error.message);
  }
};