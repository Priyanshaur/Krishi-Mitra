const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

async function testDiagnosisFlow() {
  console.log('=== Testing Diagnosis Flow ===\n');
  
  try {
    // Step 1: Login
    console.log('1. Logging in...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'test@example.com',
      password: 'password123'
    });
    
    const token = loginResponse.data.token;
    console.log('   ✅ Logged in successfully');
    console.log('   Token:', token.substring(0, 20) + '...');
    
    // Step 2: Test ML service
    console.log('\n2. Testing ML service...');
    const mlHealth = await axios.get('http://localhost:8000/health');
    console.log('   ✅ ML service is running:', mlHealth.data.status);
    
    // Step 3: Create a simple test image (using a small base64 encoded image)
    console.log('\n3. Creating test image...');
    const testImageData = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
    const imageBuffer = Buffer.from(testImageData, 'base64');
    fs.writeFileSync('test-image.png', imageBuffer);
    console.log('   ✅ Test image created');
    
    // Step 4: Test diagnosis endpoint
    console.log('\n4. Testing diagnosis endpoint...');
    const formData = new FormData();
    formData.append('image', fs.createReadStream('test-image.png'));
    formData.append('cropType', 'tomato');
    
    try {
      const diagnosisResponse = await axios.post('http://localhost:5000/api/diagnose', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          ...formData.getHeaders()
        }
      });
      
      console.log('   ✅ Diagnosis request successful');
      console.log('   Response:', JSON.stringify(diagnosisResponse.data, null, 2));
    } catch (error) {
      console.log('   ❌ Diagnosis request failed:', error.response?.data || error.message);
    }
    
    // Clean up test image
    fs.unlinkSync('test-image.png');
    
  } catch (error) {
    console.log('   ❌ Error:', error.response?.data || error.message);
  }
}

testDiagnosisFlow();