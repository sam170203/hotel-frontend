import axios from 'axios';

const API_BASE = 'https://hotel-booking-backend-8a37.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
});

const hotelsData = [
  {
    name: 'The Grand Plaza Hotel',
    description: 'Luxury 5-star hotel in the heart of Manhattan with stunning city views, world-class amenities, and impeccable service.',
    city: 'New York',
    country: 'USA',
    address: '123 Fifth Avenue',
    starRating: 5,
    amenities: ['WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Room Service', 'Parking'],
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'
  },
  {
    name: 'Ocean View Resort & Spa',
    description: 'Stunning beachfront resort with private beach access, infinity pool, and award-winning spa.',
    city: 'Miami',
    country: 'USA',
    address: '456 Ocean Drive',
    starRating: 5,
    amenities: ['WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Beach', 'Bar', 'Parking'],
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800'
  },
  {
    name: 'Alpine Mountain Lodge',
    description: 'Cozy mountain retreat with breathtaking alpine views and fireplace suites.',
    city: 'Denver',
    country: 'USA',
    address: '789 Alpine Road',
    starRating: 4,
    amenities: ['WiFi', 'Spa', 'Restaurant', 'Parking', 'Fireplace', 'Hiking'],
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800'
  },
  {
    name: 'Urban Chic Boutique Hotel',
    description: 'Stylish boutique hotel in downtown LA featuring modern design and rooftop bar.',
    city: 'Los Angeles',
    country: 'USA',
    address: '321 Fashion Avenue',
    starRating: 4,
    amenities: ['WiFi', 'Gym', 'Restaurant', 'Bar', 'Room Service', 'Parking'],
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800'
  },
  {
    name: 'Historic Heritage Inn',
    description: 'Charming 19th-century inn with antique furnishings and classic hospitality.',
    city: 'Boston',
    country: 'USA',
    address: '555 Heritage Lane',
    starRating: 4,
    amenities: ['WiFi', 'Restaurant', 'Parking', 'Concierge', 'Breakfast'],
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800'
  },
  {
    name: 'Lakeside Paradise Resort',
    description: 'Serene lakefront property offering water activities and peaceful atmosphere.',
    city: 'Chicago',
    country: 'USA',
    address: '888 Lake Shore Drive',
    starRating: 4,
    amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Boating', 'Parking'],
    image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800'
  }
];

const roomTemplates = [
  {
    name: 'Standard Room',
    type: 'standard',
    description: 'Comfortable room with essential amenities, perfect for solo travelers or couples.',
    basePrice: 8000,
    adults: 2,
    children: 1,
    totalRooms: 15,
    size: 280,
    bedType: 'Queen',
    amenities: ['WiFi', 'AC', 'TV', 'Mini Fridge']
  },
  {
    name: 'Deluxe Room',
    type: 'deluxe',
    description: 'Spacious room with premium amenities and city views.',
    basePrice: 12000,
    adults: 2,
    children: 2,
    totalRooms: 10,
    size: 350,
    bedType: 'King',
    amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'City View']
  },
  {
    name: 'Executive Suite',
    type: 'suite',
    description: 'Luxurious suite with separate living area and premium amenities.',
    basePrice: 18000,
    adults: 3,
    children: 2,
    totalRooms: 6,
    size: 500,
    bedType: 'King',
    amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Living Room', 'City View']
  },
  {
    name: 'Presidential Suite',
    type: 'premium',
    description: 'Ultimate luxury with panoramic views and exclusive amenities.',
    basePrice: 35000,
    adults: 4,
    children: 2,
    totalRooms: 2,
    size: 800,
    bedType: 'King',
    amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Living Room', 'Panoramic View']
  }
];

function getMultiplier(starRating) {
  return starRating === 5 ? 1.5 : starRating === 4 ? 1.2 : 1.0;
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function seedDatabase() {
  console.log('🏨 Starting StayScape Hotel Seeding...\n');
  
  try {
    const ownerEmail = 'owner1771490941174@test.com';
    const ownerPassword = 'Test123!@#';
    
    console.log('🔐 Logging in as owner...');
    const loginRes = await api.post('/auth/login', {
      email: ownerEmail,
      password: ownerPassword
    });
    
    if (!loginRes.data.success) {
      throw new Error('Login failed: ' + loginRes.data.error);
    }
    
    const token = loginRes.data.data.token;
    console.log('✅ Logged in successfully\n');
    
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    let hotelsCreated = 0;
    let roomsCreated = 0;
    
    for (let i = 0; i < hotelsData.length; i++) {
      const hotelData = hotelsData[i];
      
      try {
        console.log(`\n🏨 Creating Hotel ${i + 1}/${hotelsData.length}: ${hotelData.name}`);
        
        const hotelRes = await api.post('/hotels', {
          name: hotelData.name,
          description: hotelData.description,
          address: hotelData.address,
          city: hotelData.city,
          country: hotelData.country,
          starRating: hotelData.starRating,
          amenities: hotelData.amenities,
          image: hotelData.image
        });
        
        if (!hotelRes.data.success) {
          console.log(`   ❌ Failed: ${hotelRes.data.error}`);
          continue;
        }
        
        const hotelId = hotelRes.data.data.id;
        hotelsCreated++;
        console.log(`   ✅ Created (ID: ${hotelId})`);
        
        await sleep(1000);
        
        console.log(`   🛏️  Creating rooms...`);
        
        for (const roomTemplate of roomTemplates) {
          try {
            const priceMultiplier = getMultiplier(hotelData.starRating);
            
            const roomRes = await api.post(`/hotels/${hotelId}/rooms`, {
              name: roomTemplate.name,
              description: roomTemplate.description,
              type: roomTemplate.type,
              pricePerNight: Math.round(roomTemplate.basePrice * priceMultiplier),
              capacity: {
                adults: roomTemplate.adults,
                children: roomTemplate.children
              },
              totalRooms: roomTemplate.totalRooms,
              availableRooms: roomTemplate.totalRooms,
              size: roomTemplate.size,
              bedType: roomTemplate.bedType,
              amenities: roomTemplate.amenities
            });
            
            if (roomRes.data.success) {
              roomsCreated++;
              console.log(`      ✅ ${roomTemplate.name}`);
            } else {
              console.log(`      ❌ ${roomTemplate.name}: ${roomRes.data.error}`);
            }
            
            await sleep(300);
            
          } catch (roomErr) {
            console.log(`      ❌ Error: ${roomErr.response?.data?.error || roomErr.message}`);
          }
        }
        
        await sleep(1000);
        
      } catch (err) {
        console.log(`   ❌ Error: ${err.response?.data?.error || err.message}`);
      }
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('🎉 SEEDING COMPLETE!');
    console.log('='.repeat(60));
    console.log(`📊 Created: ${hotelsCreated} hotels, ${roomsCreated} rooms`);
    
    console.log('\n🔍 Verifying...');
    await sleep(2000);
    
    const verifyRes = await api.get('/hotels');
    const createdHotels = verifyRes.data.data || [];
    console.log(`✅ Hotels in database: ${createdHotels.length}`);
    
    if (createdHotels.length > 0) {
      console.log('\n📋 Created Hotels:');
      createdHotels.forEach((hotel, idx) => {
        console.log(`   ${idx + 1}. ${hotel.name} - ${hotel.city}`);
      });
    }
    
  } catch (err) {
    console.error('\n❌ Fatal error:', err.response?.data || err.message);
    process.exit(1);
  }
}

seedDatabase();
