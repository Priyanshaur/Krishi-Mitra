const fs = require('fs');
const path = require('path');

// Test if the backend is properly integrated with the ML service
console.log('Testing diagnosis integration...');

// Check if the ML service is running
fetch('http://localhost:8000/health')
  .then(response => response.json())
  .then(data => {
    console.log('ML Service Status:', data);
    
    if (data.status === 'ok') {
      console.log('✅ ML Service is running properly');
      
      // Check if we can access the backend
      fetch('http://localhost:5000/api/diagnose/history', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer test-token' // This will fail but we can see if the endpoint exists
        }
      })
      .then(response => {
        if (response.status === 401) {
          console.log('✅ Backend diagnose endpoint exists (requires authentication)');
        } else {
          console.log('ℹ️ Backend diagnose endpoint response:', response.status);
        }
      })
      .catch(error => {
        console.log('⚠️ Backend might not be running or accessible');
      });
    } else {
      console.log('❌ ML Service is not running properly');
    }
  })
  .catch(error => {
    console.log('❌ ML Service is not accessible:', error.message);
  });