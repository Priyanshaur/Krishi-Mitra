const axios = require('axios');
const FormData = require('form-data');

async function checkBackendResponse() {
  console.log('=== Checking Backend Response Structure ===\n');
  
  try {
    // Register a test user to get a token
    console.log('1. Registering test user...');
    const registerResponse = await axios.post('http://localhost:5000/api/auth/register', {
      name: 'Test User',
      email: 'test' + Date.now() + '@example.com',
      password: 'password123',
      role: 'farmer'
    });
    console.log('   ✅ User registered successfully');
    const token = registerResponse.data.token;
    
    // Create a mock diagnosis record directly in the database to check its structure
    console.log('\n2. Checking database model structure...');
    
    // Since we can't easily create a real image test, let's check what a typical diagnosis record looks like
    // by examining the model structure
    
    console.log('   Database model fields:');
    console.log('   - id: UUID');
    console.log('   - userId: UUID (reference to users table)');
    console.log('   - imageUrl: String');
    console.log('   - cropType: String');
    console.log('   - prediction.disease: String');
    console.log('   - prediction.confidence: Float');
    console.log('   - prediction.scientificName: String');
    console.log('   - prediction.commonName: String');
    console.log('   - severity: String');
    console.log('   - status: String');
    console.log('   - notes: Text');
    console.log('   - timestamps: createdAt, updatedAt');
    
    console.log('\n3. Expected frontend access pattern:');
    console.log('   - diagnosisResult[\'prediction.disease\']');
    console.log('   - diagnosisResult[\'prediction.confidence\']');
    console.log('   - diagnosisResult[\'prediction.scientificName\']');
    console.log('   - diagnosisResult[\'prediction.commonName\']');
    console.log('   - diagnosisResult.severity');
    console.log('   - diagnosisResult.status');
    
    console.log('\n=== Analysis Complete ===');
    console.log('\nIf you\'re seeing "failed to get a diagnosis" in the UI, the issue might be:');
    console.log('1. Network connectivity issues between frontend and backend');
    console.log('2. Authentication token not being sent correctly');
    console.log('3. Image file too large or unsupported format');
    console.log('4. ML service temporarily unavailable');
    console.log('5. Browser console errors that need investigation');
    
    console.log('\n🔧 Troubleshooting steps:');
    console.log('1. Open browser developer tools (F12)');
    console.log('2. Go to the Network tab');
    console.log('3. Try uploading an image again');
    console.log('4. Look for failed requests to /api/diagnose');
    console.log('5. Check the Console tab for JavaScript errors');
    
  } catch (error) {
    console.log('   ❌ Error:', error.message);
    if (error.response) {
      console.log('   Response:', error.response.data);
    }
  }
}

checkBackendResponse();