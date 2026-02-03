// Simple test script to check phone API endpoint
const axios = require('axios');

const API_URL = 'https://jilinde-credit-production.up.railway.app/api';
// const API_URL = 'http://localhost:8080/api'; // For local testing

async function testPhoneAPI() {
    console.log('🧪 Testing Phone API Endpoint...');
    console.log('API URL:', API_URL);
    
    const testPhone = '+254712345678';
    
    try {
        console.log(`\n📞 Testing phone: ${testPhone}`);
        
        const response = await axios.post(`${API_URL}/onboarding/check-phone`, {
            phone: testPhone
        }, {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 10000 // 10 second timeout
        });
        
        console.log('✅ Success Response:');
        console.log('Status:', response.status);
        console.log('Data:', response.data);
        
    } catch (error) {
        console.log('❌ Error Response:');
        console.log('Message:', error.message);
        
        if (error.response) {
            console.log('Status:', error.response.status);
            console.log('Data:', error.response.data);
        } else if (error.request) {
            console.log('No response received - possible network/CORS issue');
            console.log('Request details:', error.request);
        } else {
            console.log('Request setup error:', error.message);
        }
    }
}

// Test multiple phone numbers
async function runTests() {
    const testPhones = [
        '+254712345678',
        '0712345678',
        '+254700000000',
        '0700000000'
    ];
    
    for (const phone of testPhones) {
        console.log(`\n📞 Testing phone: ${phone}`);
        
        try {
            const response = await axios.post(`${API_URL}/onboarding/check-phone`, {
                phone: phone
            }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 5000
            });
            
            console.log(`✅ ${phone}: Available`);
            console.log('Response:', response.data);
            
        } catch (error) {
            if (error.response?.status === 400 && error.response?.data?.error === 'PHONE_IN_USE') {
                console.log(`❌ ${phone}: Already registered`);
            } else {
                console.log(`⚠️ ${phone}: Error - ${error.message}`);
                if (error.response) {
                    console.log('Status:', error.response.status);
                    console.log('Data:', error.response.data);
                }
            }
        }
        
        // Wait a bit between requests
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
}

if (require.main === module) {
    runTests().then(() => {
        console.log('\n🏁 Test completed');
    }).catch(error => {
        console.error('Test failed:', error);
    });
}

module.exports = { testPhoneAPI, runTests };