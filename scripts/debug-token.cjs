// Debug script to check JWT token issues
const jwt = require('jsonwebtoken');

console.log('🔍 Debugging JWT token issues...\n');

// Test token generation
const testSecret = 'krishi_mitra_jwt_secret_key_2025';
const testPayload = { id: 'test-user-id-123' };

console.log('1. Generating test token...');
const token = jwt.sign(testPayload, testSecret, { expiresIn: '30d' });
console.log('✅ Token generated:', token);
console.log('✅ Token length:', token.length);

console.log('\n2. Verifying token...');
try {
  const decoded = jwt.verify(token, testSecret);
  console.log('✅ Token verified successfully:', decoded);
} catch (error) {
  console.log('❌ Token verification failed:', error.message);
}

console.log('\n3. Testing token format...');
if (typeof token === 'string' && token.length > 0) {
  console.log('✅ Token is a non-empty string');
  
  // Check if token has proper format (3 parts separated by dots)
  const parts = token.split('.');
  if (parts.length === 3) {
    console.log('✅ Token has proper JWT format (3 parts)');
    console.log('   Part 1 (Header):', parts[0].length, 'characters');
    console.log('   Part 2 (Payload):', parts[1].length, 'characters');
    console.log('   Part 3 (Signature):', parts[2].length, 'characters');
  } else {
    console.log('❌ Token does not have proper JWT format');
    console.log('   Expected 3 parts, got:', parts.length);
  }
} else {
  console.log('❌ Token is not a valid string');
}

console.log('\n4. Testing with malformed token...');
const malformedToken = 'invalid.token.here';
try {
  jwt.verify(malformedToken, testSecret);
  console.log('❌ Malformed token was accepted (unexpected)');
} catch (error) {
  console.log('✅ Malformed token correctly rejected:', error.name);
}