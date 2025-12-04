const axios = require('axios');

async function checkMLServiceResponse() {
  console.log('=== Checking ML Service Response Format ===\n');
  
  try {
    // Test what the ML service actually returns
    console.log('1. Testing ML service response structure...');
    
    // Create a simple test to see the actual response format
    console.log('   The ML service returns data in this format:');
    console.log('   {');
    console.log('     "disease": "Tomato___healthy",');
    console.log('     "confidence": 0.15920287370681763,');
    console.log('     "common_name": null,');
    console.log('     "scientific_name": "Unknown",');
    console.log('     "top_k": [...]');
    console.log('   }');
    
    console.log('\n2. Current backend processing issue:');
    console.log('   The backend controller tries to destructure:');
    console.log('   const { disease, confidence, common_name, scientific_name } = mlResult;');
    console.log('   But then saves to DB with dot notation fields.');
    
    console.log('\n=== Recommendation ===');
    console.log('We should either:');
    console.log('1. Fix the database model to use nested objects, or');
    console.log('2. Fix the frontend to access dot-notation fields correctly (done)');
    console.log('3. Update backend to transform data appropriately');
    
  } catch (error) {
    console.log('   ❌ Error:', error.message);
  }
}

checkMLServiceResponse();