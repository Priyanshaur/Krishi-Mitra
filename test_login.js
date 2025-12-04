const API_URL = 'http://localhost:5000/api';

const testLogin = async () => {
    try {
        console.log('Testing login...');
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'sakshant@example.com', // Replace with a known valid email
                password: 'password123'
            })
        });

        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Response:', data);
    } catch (error) {
        console.error('Login failed:', error.message);
    }
};

testLogin();
