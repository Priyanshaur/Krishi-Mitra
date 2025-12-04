import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ML_URL = 'http://127.0.0.1:8000';

async function testConnection() {
    console.log(`Testing connection to ML Server at ${ML_URL}...`);

    try {
        // 1. Test Recommendations Endpoint (GET)
        console.log('\n1. Testing /recommendations endpoint...');
        const recResponse = await axios.get(`${ML_URL}/recommendations`, {
            params: { disease: 'Test Disease', crop_type: 'tomato' }
        });
        console.log('✅ /recommendations success:', recResponse.status);
        console.log('Response:', recResponse.data);

        // 2. Test Predict Endpoint (POST) - Optional, requires an image
        // We will just check if the endpoint is reachable (422 Unprocessable Entity is expected if no image sent)
        console.log('\n2. Testing /predict endpoint reachability...');
        try {
            await axios.post(`${ML_URL}/predict`);
        } catch (error) {
            if (error.response && error.response.status === 422) {
                console.log('✅ /predict is reachable (got 422 as expected for missing file)');
            } else {
                console.log('❌ /predict failed with unexpected status:', error.response ? error.response.status : error.message);
            }
        }

        console.log('\n✅ ML Server connection verified successfully!');

    } catch (error) {
        console.error('\n❌ Connection failed:', error.message);
        if (error.code === 'ECONNREFUSED') {
            console.error('Make sure the ML server is running on port 8000.');
        }
    }
}

testConnection();
