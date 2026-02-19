import axios from 'axios';

const API_BASE = 'https://hotel-booking-backend-8a37.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
});

const hotelsData = [
  {
    name: 'Grand Palace Hotel',
    description: 'Luxury 5-star hotel in the heart of the city with stunning views and world-class amenities.',
    city: 'New York',
    country: 'USA',
    address: '123 Main Street',
    starRating: 5,
    amenities: ['WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Room Service', 'Parking'],
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'
  },
  {
    name: 'Seaside Resort & Spa',
    description: 'Beautiful beachfront resort with private beach, infinity pool, and rejuvenating spa treatments.',
    city: 'Miami',
    country: 'USA',
    address: '456 Ocean Drive',
    starRating: 5,
    amenities: ['WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Beach', 'Bar', 'Parking'],
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800'
  },
  {
    name: 'Mountain View Lodge',
    description: 'Cozy mountain retreat with breathtaking views, hiking trails, and fireplace suites.',
    city: 'Denver',
    country: 'USA',
    address: '789 Alpine Road',
    starRating: 4,
    amenities: ['WiFi', 'Spa', 'Restaurant', 'Parking', 'Fireplace', 'Hiking'],
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800'
  },
  {
    name: 'Urban Boutique Hotel',
    description: 'Stylish boutique hotel in downtown with modern design and personalized service.',
    city: 'Los Angeles',
    country: 'USA',
    address: '321 Fashion Ave',
    starRating: 4,
    amenities: ['WiFi', 'Gym', 'Restaurant', 'Bar', 'Room Service', 'Parking'],
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800'
  },
  {
    name: 'Historic Inn',
    description: 'Charming historic inn with antique furnishings and classic hospitality.',
    city: 'Boston',
    country: 'USA',
    address: '555 Heritage Lane',
    starRating: 4,
    amenities: ['WiFi', 'Restaurant', 'Parking', 'Concierge', 'Breakfast'],
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800'
  },
  {
    name: 'Lakeside Paradise',
    description: 'Serene lakefront property with water activities and peaceful atmosphere.',
    city: 'Chicago',
    country: 'USA',
    address: '888 Lake Shore Dr',
    starRating: 4,
    amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Boating', 'Parking'],
    image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800'
  },
  {
    name: 'Desert Oasis Resort',
    description: 'Luxurious desert resort with pool, golf course, and stunning sunset views.',
    city: 'Phoenix',
    country: 'USA',
    address: '999 Desert Blvd',
    starRating: 5,
    amenities: ['WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Golf', 'Bar'],
    image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800'
  },
  {
    name: 'City Center Express',
    description: 'Modern hotel in central location perfect for business travelers.',
    city: 'San Francisco',
    country: 'USA',
    address: '111 Business Plaza',
    starRating: 3,
    amenities: ['WiFi', 'Gym', 'Business Center', 'Restaurant', 'Parking'],
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800'
  },
  {
    name: 'Riverside Hotel',
    description: 'Scenic riverside property with river walks and fine dining.',
    city: 'Seattle',
    country: 'USA',
    address: '222 River Road',
    starRating: 4,
    amenities: ['WiFi', 'Pool', 'Restaurant', 'Bar', 'Room Service', 'Parking'],
    image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800'
  },
  {
    name: 'Garden Plaza Hotel',
    description: 'Elegant hotel surrounded by beautiful gardens and outdoor spaces.',
    city: 'Austin',
    country: 'USA',
    address: '333 Garden Way',
    starRating: 4,
    amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Bar', 'Parking', 'Garden'],
    image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800'
  },
  {
    name: 'Tech Hub Hotel',
    description: 'Cutting-edge hotel with smart rooms and startup-friendly amenities.',
    city: 'San Jose',
    country: 'USA',
    address: '444 Innovation Blvd',
    starRating: 4,
    amenities: ['WiFi', 'Gym', 'Business Center', 'Restaurant', 'Co-working', 'Parking'],
    image: 'https://images.unsplash.com/photo-1606402179428-a57976d71fa4?w=800'
  },
  {
    name: 'Coastal Inn',
    description: 'Charming coastal hotel with easy beach access and nautical decor.',
    city: 'San Diego',
    country: 'USA',
    address: '555 Harbor View',
    starRating: 3,
    amenities: ['WiFi', 'Pool', 'Restaurant', 'Beach Access', 'Parking'],
    image: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebf6?w=800'
  },
  {
    name: 'Grand Metropolitan',
    description: 'Iconic hotel in the metropolitan area with grand ballrooms and luxury suites.',
    city: 'Washington DC',
    country: 'USA',
    address: '777 Executive Dr',
    starRating: 5,
    amenities: ['WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Room Service', 'Concierge'],
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800'
  },
  {
    name: 'Sunset Boutique Hotel',
    description: 'Art-inspired boutique hotel with unique rooms and local artwork.',
    city: 'Portland',
    country: 'USA',
    address: '888 Art District',
    starRating: 4,
    amenities: ['WiFi', 'Restaurant', 'Bar', 'Art Gallery', 'Parking'],
    image: 'https://images.unsplash.com/photo-1568495248636-6432b97bd949?w=800'
  },
  {
    name: 'Executive Suites',
    description: 'Professional hotel with extended stay suites and kitchen facilities.',
    city: 'Atlanta',
    country: 'USA',
    address: '999 Corporate Pkwy',
    starRating: 3,
    amenities: ['WiFi', 'Gym', 'Business Center', 'Kitchen', 'Laundry', 'Parking'],
    image: 'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800'
  },
  {
    name: 'Harbor Front Hotel',
    description: 'Waterfront hotel with marina views and nautical theme throughout.',
    city: 'Baltimore',
    country: 'USA',
    address: '111 Marina Bay',
    starRating: 4,
    amenities: ['WiFi', 'Pool', 'Restaurant', 'Bar', 'Marina', 'Parking'],
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'
  },
  {
    name: 'Park Avenue Residence',
    description: 'Elegant hotel on prestigious Park Avenue with luxury amenities.',
    city: 'New York',
    country: 'USA',
    address: '222 Park Avenue',
    starRating: 5,
    amenities: ['WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Concierge', 'Room Service'],
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'
  },
  {
    name: 'Vineyard Estate',
    description: 'Charming hotel on a working vineyard with wine tastings.',
    city: 'Napa Valley',
    country: 'USA',
    address: '333 Vineyard Lane',
    starRating: 4,
    amenities: ['WiFi', 'Spa', 'Restaurant', 'Wine Tasting', 'Pool', 'Parking'],
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800'
  },
  {
    name: 'Downtown Loft Hotel',
    description: 'Trendy loft-style hotel in the arts district with rooftop terrace.',
    city: 'Nashville',
    country: 'USA',
    address: '444 Loft Street',
    starRating: 4,
    amenities: ['WiFi', 'Gym', 'Restaurant', 'Rooftop Bar', 'Parking', 'Live Music'],
    image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800'
  },
  {
    name: 'Lighthouse Point Hotel',
    description: 'Historic hotel near the lighthouse with panoramic ocean views.',
    city: 'Portland',
    country: 'USA',
    address: '555 Lighthouse Rd',
    starRating: 3,
    amenities: ['WiFi', 'Restaurant', 'Beach Access', 'Parking', 'Ocean View'],
    image: 'https://images.unsplash.com/photo-1544124499-58912cbddaad?w=800'
  },
  {
    name: 'Royal Crown Hotel',
    description: 'Majestic hotel with royal treatment and regal decor.',
    city: 'Las Vegas',
    country: 'USA',
    address: '666 Crown Plaza',
    starRating: 5,
    amenities: ['WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Casino', 'Room Service'],
    image: 'https://images.unsplash.com/photo-1580041065738-e72023775cdc?w=800'
  },
  {
    name: 'Forest Retreat',
    description: 'Secluded forest hotel with eco-friendly practices and nature trails.',
    city: 'Asheville',
    country: 'USA',
    address: '777 Forest Path',
    starRating: 4,
    amenities: ['WiFi', 'Spa', 'Restaurant', 'Hiking', 'Nature Walks', 'Parking'],
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'
  },
  {
    name: 'Midtown Manhattan Hotel',
    description: 'Classic hotel in the heart of Manhattan with skyline views.',
    city: 'New York',
    country: 'USA',
    address: '888 Midtown Ave',
    starRating: 4,
    amenities: ['WiFi', 'Gym', 'Restaurant', 'Bar', 'Room Service', 'Parking'],
    image: 'https://images.unsplash.com/photo-1559599101-f09722fb4948?w=800'
  },
  {
    name: 'Sunrise Beach Resort',
    description: 'Family-friendly resort with private beach and kids club.',
    city: 'Honolulu',
    country: 'USA',
    address: '999 Sunrise Blvd',
    starRating: 4,
    amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Beach', 'Kids Club', 'Bar'],
    image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800'
  },
  {
    name: 'The Plaza Hotel',
    description: 'Iconic luxury hotel offering timeless elegance and impeccable service.',
    city: 'New York',
    country: 'USA',
    address: '100 Fifth Avenue',
    starRating: 5,
    amenities: ['WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Concierge', 'Room Service'],
    image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800'
  },
  {
    name: 'Riverside Inn',
    description: 'Charming riverside inn with boat rentals and fishing access.',
    city: 'Minneapolis',
    country: 'USA',
    address: '321 River Lane',
    starRating: 3,
    amenities: ['WiFi', 'Restaurant', 'Boating', 'Fishing', 'Parking'],
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800'
  },
  {
    name: 'Skyline Tower',
    description: 'Tallest hotel in the city with360-degree views from rooftop observatory.',
    city: 'Chicago',
    country: 'USA',
    address: '500 Skyline Dr',
    starRating: 5,
    amenities: ['WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Observatory', 'Room Service'],
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800'
  },
  {
    name: 'Canyon View Hotel',
    description: 'Hotel overlooking majestic canyon with guided hiking tours.',
    city: 'Scottsdale',
    country: 'USA',
    address: '789 Canyon View',
    starRating: 4,
    amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Hiking Tours', 'Parking'],
    image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800'
  },
  {
    name: 'Metropolitan Business Hotel',
    description: 'Purpose-built hotel for business travelers with meeting facilities.',
    city: 'Houston',
    country: 'USA',
    address: '100 Commerce St',
    starRating: 4,
    amenities: ['WiFi', 'Gym', 'Business Center', 'Meeting Rooms', 'Restaurant', 'Parking'],
    image: 'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800'
  },
  {
    name: 'Crystal Lagoon Resort',
    description: 'Stunning resort with crystal clear lagoon and water activities.',
    city: 'Orlando',
    country: 'USA',
    address: '222 Lagoon Way',
    starRating: 4,
    amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Water Park', 'Bar', 'Kids Club'],
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800'
  }
];

const roomTypes = [
  { type: 'Standard', bedType: 'Queen', maxAdults: 2, maxChildren: 1 },
  { type: 'Deluxe', bedType: 'King', maxAdults: 2, maxChildren: 2 },
  { type: 'Suite', bedType: 'King', maxAdults: 3, maxChildren: 2 },
  { type: 'Family', bedType: 'Queen', maxAdults: 4, maxChildren: 3 },
  { type: 'Premium', bedType: 'King', maxAdults: 2, maxChildren: 1 },
  { type: 'Executive', bedType: 'King', maxAdults: 3, maxChildren: 2 }
];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomElements(arr, count) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function seedDatabase() {
  let apiClient = axios.create({
    baseURL: API_BASE,
    headers: { 'Content-Type': 'application/json' }
  });
  
  try {
    console.log('🚀 Starting hotel seeding...');
    
    // Register an owner user
    const ownerEmail = `owner${Date.now()}@stayscape.com`;
    const ownerPassword = 'Owner@123456';
    
    console.log('📝 Registering owner user...');
    
    const registerRes = await apiClient.post('/auth/signup', {
      name: 'StayScape Owner',
      email: ownerEmail,
      password: ownerPassword,
      phone: '+1234567890',
      role: 'owner'
    });
    
    console.log('Registration response:', registerRes.data);
    
    if (!registerRes.data.success) {
      throw new Error('Registration failed: ' + registerRes.data.error);
    }
    
    // Login to get token
    console.log('🔐 Logging in...');
    await sleep(500);
    
    const loginRes = await apiClient.post('/auth/login', {
      email: ownerEmail,
      password: ownerPassword
    });
    
    console.log('Login response:', loginRes.data.success ? 'Success' : 'Failed');
    
    if (!loginRes.data.success) {
      throw new Error('Login failed: ' + loginRes.data.error);
    }
    
    const token = loginRes.data.data.token;
    console.log('✅ Authenticated, token received');
    
    // Create new axios instance with auth
    apiClient = axios.create({
      baseURL: API_BASE,
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    await sleep(500);
    
    let hotelsCreated = 0;
    
    for (let i = 0; i < hotelsData.length; i++) {
      const hotel = hotelsData[i];
      
      try {
        console.log(`🏨 Creating hotel ${i + 1}/${hotelsData.length}: ${hotel.name}...`);
        
        const hotelRes = await apiClient.post('/hotels', {
          name: hotel.name,
          description: hotel.description,
          address: hotel.address,
          city: hotel.city,
          country: hotel.country,
          starRating: hotel.starRating,
          amenities: hotel.amenities,
          image: hotel.image
        });
        
        console.log('   Hotel response:', hotelRes.data.success ? 'Created' : hotelRes.data.error);
        
        if (hotelRes.data.success) {
          const hotelId = hotelRes.data.data.id;
          hotelsCreated++;
          
          // Add 3-6 rooms for this hotel
          const numRooms = getRandomInt(3, 6);
          const selectedRoomTypes = getRandomElements(roomTypes, numRooms);
          
          for (let j = 0; j < selectedRoomTypes.length; j++) {
            const roomType = selectedRoomTypes[j];
            const basePrice = getRandomInt(80, 400) * hotel.starRating * 10;
            
            await apiClient.post(`/hotels/${hotelId}/rooms`, {
              name: `${roomType.type} Room`,
              description: `Comfortable ${roomType.type.toLowerCase()} room with ${roomType.bedType.toLowerCase()} bed. Perfect for ${roomType.maxAdults} adults and ${roomType.maxChildren} children.`,
              type: roomType.type.toLowerCase(),
              pricePerNight: basePrice,
              capacity: {
                adults: roomType.maxAdults,
                children: roomType.maxChildren
              },
              totalRooms: getRandomInt(5, 20),
              bedType: roomType.bedType,
              size: getRandomInt(250, 600),
              amenities: getRandomElements([
                'WiFi', 'AC', 'TV', 'Mini Bar', 'Safe', 'Balcony', 
                'Ocean View', 'Mountain View', 'Bathtub', 'Workspace'
              ], getRandomInt(4, 8))
            });
          }
          
          console.log(`   ✅ ${hotel.name} with ${numRooms} rooms`);
        }
        
        await sleep(300);
        
      } catch (err) {
        console.log(`   ❌ Error:`, err.response?.data || err.message);
      }
    }
    
    console.log(`\n🎉 Seeding complete! Created ${hotelsCreated} hotels.`);
    console.log(`📧 Owner credentials:`);
    console.log(`   Email: ${ownerEmail}`);
    console.log(`   Password: ${ownerPassword}`);
    
    // Verify
    console.log('\n📊 Verifying...');
    const verifyRes = await apiClient.get('/hotels');
    console.log(`   Total hotels in system: ${verifyRes.data.data?.length || 0}`);
    
  } catch (err) {
    console.error('❌ Seeding failed:', err.response?.data || err.message);
    process.exit(1);
  }
}

seedDatabase();
