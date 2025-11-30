const axios = require('axios');
const fs = require('fs');

async function checkDiagnosisStructure() {
  console.log('=== Checking Diagnosis Data Structure ===\n');
  
  try {
    // Login to get auth token
    console.log('1. Logging in...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'test@example.com',
      password: 'password123'
    });
    
    const token = loginResponse.data.token;
    console.log('   ✅ Logged in successfully\n');
    
    // Get diagnosis history to see the actual data structure
    console.log('2. Checking diagnosis history structure...');
    const historyResponse = await axios.get('http://localhost:5000/api/diagnose/history', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('   ✅ Diagnosis history retrieved');
    if (historyResponse.data.data && historyResponse.data.data.length > 0) {
      const sampleDiagnosis = historyResponse.data.data[0];
      console.log('   📊 Sample diagnosis structure:');
      console.log('   Keys:', Object.keys(sampleDiagnosis));
      console.log('   Sample data:');
      console.log('     id:', sampleDiagnosis.id);
      console.log('     prediction.disease:', sampleDiagnosis['prediction.disease']);
      console.log('     prediction.confidence:', sampleDiagnosis['prediction.confidence']);
      console.log('     prediction.scientificName:', sampleDiagnosis['prediction.scientificName']);
      
      // Check if there's a prediction object
      console.log('     prediction object:', sampleDiagnosis.prediction);
    } else {
      console.log('   ℹ️  No diagnosis history found');
    }
    
    console.log('\n=== Issue Identified ===');
    console.log('The diagnosis data uses dot notation in field names:');
    console.log('  - "prediction.disease" (as a literal field name)');
    console.log('  - NOT prediction: { disease: ... } (nested object)');
    console.log('\nBut the frontend expects nested objects:');
    console.log('  - diagnosisResult.prediction?.disease');
    console.log('\nThis mismatch causes the "unknown disease" display.');
    
  } catch (error) {
    console.log('   ❌ Error:', error.response?.data || error.message);
  }
}

checkDiagnosisStructure();