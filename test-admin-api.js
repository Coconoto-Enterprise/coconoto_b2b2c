// Test the admin login API endpoint
const testAdminLogin = async () => {
  try {
    console.log('🧪 Testing admin login API...');
    
    const response = await fetch('http://localhost:5174/api/admin-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password: 'COCO1234'
      })
    });

    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', data);

    if (data.success) {
      console.log('✅ Admin login API is working correctly!');
    } else {
      console.log('❌ Admin login API returned error:', data.error);
    }

  } catch (error) {
    console.error('❌ Network error testing admin login:', error);
  }
};

testAdminLogin();