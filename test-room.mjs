import axios from 'axios';

const API = 'https://hotel-booking-backend-8a37.onrender.com/api';

async function test() {
  try {
    const login = await axios.post(API + '/auth/login', {
      email: 'owner1771490941174@test.com',
      password: 'Test123!@#'
    });
    const token = login.data.data.token;
    const hotelId = 'hotel_1526b5be-2fbf-404d-bfcc-ee014f314aeb';
    
    // Try minimal room data
    console.log('Test 1: Minimal room data...');
    try {
      const res1 = await axios.post(API + '/hotels/' + hotelId + '/rooms', {
        name: 'Basic Room',
        pricePerNight: 100
      }, { headers: { Authorization: 'Bearer ' + token }});
      console.log('Result:', res1.data);
    } catch(e) {
      console.log('Error:', e.response?.data?.error || e.message);
    }
    
    // Try with flat fields
    console.log('\nTest 2: With type and capacity...');
    try {
      const res2 = await axios.post(API + '/hotels/' + hotelId + '/rooms', {
        name: 'Deluxe Room',
        type: 'deluxe',
        pricePerNight: 200,
        maxAdults: 2,
        maxChildren: 1,
        totalRooms: 5
      }, { headers: { Authorization: 'Bearer ' + token }});
      console.log('Result:', res2.data);
    } catch(e) {
      console.log('Error:', e.response?.data?.error || e.message);
    }
    
    // Try to check if hotel exists in any form
    console.log('\nTest 3: Search hotels...');
    try {
      const search = await axios.get(API + '/hotels?city=New+York', {
        headers: { Authorization: 'Bearer ' + token }
      });
      console.log('Search results:', search.data.data?.length || 0);
    } catch(e) {
      console.log('Error:', e.response?.data?.error || e.message);
    }
    
  } catch(err) {
    console.error('Fatal error:', err.message);
  }
}

test();
