const axios = require('axios');

const API_BASE = 'https://hotel-booking-backend-8a37.onrender.com/api';

async function test() {
  try {
    // 1. Register owner
    console.log('1. Registering owner...');
    const timestamp = Date.now();
    const signupRes = await axios.post(`${API_BASE}/auth/signup`, {
      name: 'Test Owner',
      email: `owner${timestamp}@test.com`,
      password: 'Test123!@#',
      phone: '+1234567890',
      role: 'owner'
    });
    console.log('Signup:', signupRes.data.success ? 'SUCCESS' : 'FAILED');
    
    // 2. Login
    console.log('\n2. Logging in...');
    const loginRes = await axios.post(`${API_BASE}/auth/login`, {
      email: `owner${timestamp}@test.com`,
      password: 'Test123!@#'
    });
    const token = loginRes.data.data.token;
    console.log('Login: SUCCESS, got token');
    
    // 3. Create hotel
    console.log('\n3. Creating hotel...');
    const hotelRes = await axios.post(`${API_BASE}/hotels`, {
      name: 'Debug Hotel',
      description: 'Test description',
      address: '123 Test St',
      city: 'New York',
      country: 'USA',
      starRating: 5,
      amenities: ['WiFi', 'Pool'],
      image: 'https://example.com/hotel.jpg'
    }, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('Create hotel:', hotelRes.data.success ? 'SUCCESS' : 'FAILED');
    console.log('Hotel ID:', hotelRes.data.data?.id);
    const hotelId = hotelRes.data.data?.id;
    
    // 4. Try to get the specific hotel
    console.log('\n4. Getting specific hotel...');
    try {
      const getRes = await axios.get(`${API_BASE}/hotels/${hotelId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log('Get specific hotel:', getRes.data.success ? 'SUCCESS' : 'FAILED');
      console.log('Data:', JSON.stringify(getRes.data.data, null, 2));
    } catch(e) {
      console.log('Get specific hotel: FAILED -', e.response?.data?.error || e.message);
    }
    
    // 5. List all hotels
    console.log('\n5. Listing all hotels...');
    const listRes = await axios.get(`${API_BASE}/hotels`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('List hotels:', listRes.data.success ? 'SUCCESS' : 'FAILED');
    console.log('Count:', listRes.data.data?.length || 0);
    
    if (listRes.data.data?.length > 0) {
      console.log('First hotel:', listRes.data.data[0].name);
    }
    
    // 6. Try adding a room
    if (hotelId) {
      console.log('\n6. Adding room to hotel...');
      try {
        const roomRes = await axios.post(`${API_BASE}/hotels/${hotelId}/rooms`, {
          name: 'Standard Room',
          description: 'A nice room',
          type: 'standard',
          pricePerNight: 15000,
          capacity: { adults: 2, children: 1 },
          totalRooms: 10,
          bedType: 'Queen',
          size: 300,
          amenities: ['WiFi', 'AC', 'TV']
        }, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log('Add room:', roomRes.data.success ? 'SUCCESS' : 'FAILED');
        if (!roomRes.data.success) {
          console.log('Error:', roomRes.data.error);
        }
      } catch(e) {
        console.log('Add room: FAILED -', e.response?.data?.error || e.message);
      }
    }
    
    console.log('\n=== Summary ===');
    console.log('Owner:', `owner${timestamp}@test.com`);
    console.log('Password: Test123!@#');
    console.log('Hotel ID:', hotelId);
    
  } catch (err) {
    console.error('Error:', err.response?.data || err.message);
  }
}

test();
