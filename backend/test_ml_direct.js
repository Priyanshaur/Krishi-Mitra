import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to run test
async function testPrediction(imagePath, cropType) {
    console.log(`\n--- Testing Crop Type: ${cropType} ---`);
    try {
        const form = new FormData();
        form.append('image', fs.createReadStream(imagePath));
        form.append('crop_type', cropType);

        const response = await axios.post('http://127.0.0.1:8000/predict', form, {
            headers: {
                ...form.getHeaders()
            },
            validateStatus: () => true // Handle 400s manually
        });

        if (response.status === 200) {
            console.log(`✅ Success! Response:`, response.data);
        } else {
            console.log(`⚠️ Status: ${response.status}`);
            console.log(`❌ Error:`, response.data);
        }
        return response;
    } catch (error) {
        console.error(`💥 Exception:`, error.message);
        if (error.response) console.error(error.response.data);
        return { status: 500 };
    }
}

async function runTests() {
    // 1. Find a test image
    const uploadDir = path.join(__dirname, 'uploads');
    let testImage;
    try {
        const files = fs.readdirSync(uploadDir);
        testImage = files.find(f => f.endsWith('.jpg') || f.endsWith('.png') || f.endsWith('.jpeg'));
        if (!testImage) throw new Error("No image found");
        testImage = path.join(uploadDir, testImage);
        console.log(`Using test image: ${testImage}`);
    } catch (e) {
        console.error("Could not find test image in uploads. Please ensure server has run at least once.");
        process.exit(1);
    }

    // 2. Test Unsupported (Wheat)
    console.log("\n🧪 TEST 1: Unsupported Crop (Wheat)");
    const res1 = await testPrediction(testImage, 'wheat');
    if (res1.status === 400 && res1.data.detail && res1.data.detail.includes("not supported")) {
        console.log("PASS: Wheat was correctly rejected.");
    } else {
        console.log("FAIL: Wheat should have been rejected.");
    }

    // 3. Test Supported (Tomato)
    console.log("\n🧪 TEST 2: Supported Crop (Tomato)");
    const res2 = await testPrediction(testImage, 'tomato');
    if (res2.status === 200) {
        console.log("PASS: Tomato was accepted.");
    } else {
        console.log("FAIL: Tomato request failed.");
    }

    // 4. Test Other
    console.log("\n🧪 TEST 3: General/Other");
    const res3 = await testPrediction(testImage, 'other');
    if (res3.status === 200) {
        console.log("PASS: 'other' was accepted.");
    } else {
        console.log("FAIL: 'other' request failed.");
    }
}

runTests();
