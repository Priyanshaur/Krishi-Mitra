const axios = require('axios');
const fs = require('fs');

async function detailedDiagnosisTest() {
  console.log('=== Detailed Diagnosis Test ===\n');
  
  try {
    // Login to get auth token
    console.log('1. Logging in...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'test@example.com',
      password: 'password123'
    });
    
    const token = loginResponse.data.token;
    console.log('   ✅ Logged in successfully\n');
    
    // Test with an actual image file if it exists
    const testImages = ['tomato-sample.jpg', 'test-image.png'];
    let imageFile = null;
    
    for (const img of testImages) {
      if (fs.existsSync(img)) {
        imageFile = img;
        break;
      }
    }
    
    if (imageFile) {
      console.log(`2. Testing with existing image: ${imageFile}`);
      
      // Create form data
      const FormData = require('form-data');
      const formData = new FormData();
      formData.append('image', fs.createReadStream(imageFile));
      formData.append('cropType', 'tomato');
      
      try {
        const diagnosisResponse = await axios.post('http://localhost:5000/api/diagnose', formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            ...formData.getHeaders()
          }
        });
        
        console.log('   ✅ Diagnosis request successful');
        console.log('   Full Response:');
        console.log('   Disease:', diagnosisResponse.data.data['prediction.disease']);
        console.log('   Confidence:', diagnosisResponse.data.data['prediction.confidence']);
        console.log('   Scientific Name:', diagnosisResponse.data.data['prediction.scientificName']);
        console.log('   Severity:', diagnosisResponse.data.data.severity);
        
        // Check if it's a healthy prediction
        const disease = diagnosisResponse.data.data['prediction.disease'];
        const confidence = diagnosisResponse.data.data['prediction.confidence'];
        
        if (disease.includes('healthy')) {
          console.log('   ℹ️  This indicates a healthy plant (which may be correct)');
        } else if (confidence < 0.5) {
          console.log('   ⚠️  Low confidence prediction - image quality may be poor');
        } else {
          console.log('   ✅ High confidence disease detection');
        }
        
      } catch (error) {
        console.log('   ❌ Diagnosis request failed:', error.response?.data || error.message);
      }
    } else {
      console.log('2. No test image found - creating a detailed explanation\n');
      
      console.log('=== Why You Might See "Unknown" or "Healthy" Results ===');
      console.log('1. Image Quality Issues:');
      console.log('   - Very small or low-resolution images');
      console.log('   - Images without clear plant disease symptoms');
      console.log('   - Blurry or out-of-focus photos');
      
      console.log('\n2. Content Issues:');
      console.log('   - Images of healthy plants (correctly identified as "healthy")');
      console.log('   - Non-plant images or backgrounds');
      console.log('   - Multiple objects without clear focus on plant');
      
      console.log('\n3. Technical Issues:');
      console.log('   - Crop type mismatch (e.g., selecting "tomato" for a corn image)');
      console.log('   - File format issues');
      console.log('   - Image size limits exceeded');
      
      console.log('\n=== How to Improve Results ===');
      console.log('1. Use high-quality photos of diseased plant leaves');
      console.log('2. Ensure the image clearly shows disease symptoms');
      console.log('3. Select the correct crop type from the dropdown');
      console.log('4. Use JPG or PNG format with good resolution');
      
      console.log('\n=== Valid Disease Classes ===');
      const diseases = [
        "Tomato___Bacterial_spot",
        "Tomato___Early_blight", 
        "Tomato___Late_blight",
        "Tomato___Leaf_Mold",
        "Tomato___Septoria_leaf_spot",
        "Tomato___Spider_mites Two-spotted_spider_mite",
        "Tomato___Target_Spot",
        "Tomato___Tomato_Yellow_Leaf_Curl_Virus",
        "Tomato___Tomato_mosaic_virus",
        "Tomato___healthy"
      ];
      
      console.log('Tomato Diseases:');
      diseases.forEach(disease => console.log(`  • ${disease}`));
    }
    
  } catch (error) {
    console.log('   ❌ Error:', error.response?.data || error.message);
  }
}

detailedDiagnosisTest();