// Debug script to check token in localStorage
console.log('🔍 Debugging frontend token storage...\n');

// Check if we're in a browser environment
if (typeof window !== 'undefined' && window.localStorage) {
  console.log('1. Checking localStorage for token...');
  const token = localStorage.getItem('token');
  
  if (token) {
    console.log('✅ Token found in localStorage');
    console.log('✅ Token length:', token.length);
    console.log('✅ Token type:', typeof token);
    
    // Check if token has proper format (3 parts separated by dots)
    const parts = token.split('.');
    console.log('✅ Token parts:', parts.length);
    
    if (parts.length === 3) {
      console.log('✅ Token has proper JWT format');
      console.log('   Part 1 (Header):', parts[0].substring(0, 20) + '...');
      console.log('   Part 2 (Payload):', parts[1].substring(0, 20) + '...');
      console.log('   Part 3 (Signature):', parts[2].substring(0, 20) + '...');
    } else {
      console.log('❌ Token does not have proper JWT format');
      console.log('   Token content:', token);
    }
    
    // Check for common issues
    if (token.includes(' ')) {
      console.log('❌ Token contains spaces (malformed)');
    }
    
    if (token.includes('\n') || token.includes('\r')) {
      console.log('❌ Token contains line breaks (malformed)');
    }
    
  } else {
    console.log('❌ No token found in localStorage');
  }
} else {
  console.log('❌ Not in browser environment or localStorage not available');
}

// Check all localStorage items
if (typeof window !== 'undefined' && window.localStorage) {
  console.log('\n2. All localStorage items:');
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const value = localStorage.getItem(key);
    console.log(`   ${key}: ${value.substring(0, 50)}${value.length > 50 ? '...' : ''}`);
  }
}