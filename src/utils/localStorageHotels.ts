import type { Hotel } from '../types';

interface LocalStorageHotelsReturn {
  getHotels: () => Hotel[];
  saveHotels: (hotels: Hotel[]) => void;
  seedDemoHotels: () => Hotel[];
}

// Expanded demo data with 35 hotels across multiple cities and countries
export const useLocalStorageHotels = (): LocalStorageHotelsReturn => {
  const STORAGE_KEY = 'stayscape_hotels';
  
  const getHotels = (): Hotel[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  };
  
  const saveHotels = (hotels: Hotel[]): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(hotels));
  };

  const createRoom = (hotelId: string, roomNum: number, type: string, price: number, adults: number, children: number, size: number, bedType: string) => ({
    id: `room_${hotelId.slice(-3)}_${roomNum}`,
    hotelId,
    name: `${type} Room`,
    description: `Comfortable ${type.toLowerCase()} room with ${bedType.toLowerCase()} bed`,
    type: type.toLowerCase(),
    images: [],
    capacity: { adults, children },
    amenities: ['WiFi', 'AC', 'TV'],
    pricePerNight: price,
    currency: 'INR',
    totalRooms: Math.floor(Math.random() * 10) + 5,
    availableRooms: Math.floor(Math.random() * 8) + 2,
    size,
    bedType
  });
  
  const seedDemoHotels = (): Hotel[] => {
    const demoHotels: Hotel[] = [
      // USA Hotels
      {
        id: 'hotel_001',
        name: 'The Grand Plaza Hotel',
        description: 'Luxury 5-star hotel in the heart of Manhattan with stunning city views and world-class amenities.',
        location: { address: '123 Fifth Avenue', city: 'New York', country: 'USA' },
        images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'],
        amenities: ['WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Bar'],
        rating: 4.8, reviewCount: 1250, starRating: 5,
        priceRange: { min: 8000, max: 35000, currency: 'INR' },
        rooms: [
          createRoom('hotel_001', 1, 'Standard', 8000, 2, 1, 300, 'Queen'),
          createRoom('hotel_001', 2, 'Deluxe', 15000, 2, 2, 450, 'King'),
          createRoom('hotel_001', 3, 'Suite', 25000, 3, 2, 650, 'King'),
          createRoom('hotel_001', 4, 'Presidential', 35000, 4, 2, 900, 'King')
        ]
      },
      {
        id: 'hotel_002',
        name: 'Ocean View Resort & Spa',
        description: 'Stunning beachfront resort with private beach, infinity pool, and rejuvenating spa treatments.',
        location: { address: '456 Ocean Drive', city: 'Miami', country: 'USA' },
        images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800'],
        amenities: ['WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Beach', 'Bar'],
        rating: 4.7, reviewCount: 980, starRating: 5,
        priceRange: { min: 12000, max: 28000, currency: 'INR' },
        rooms: [
          createRoom('hotel_002', 1, 'Standard', 12000, 2, 1, 320, 'Queen'),
          createRoom('hotel_002', 2, 'Ocean View', 18000, 2, 2, 400, 'King'),
          createRoom('hotel_002', 3, 'Beachfront Villa', 28000, 4, 2, 700, 'King')
        ]
      },
      {
        id: 'hotel_003',
        name: 'Alpine Mountain Lodge',
        description: 'Cozy mountain retreat with breathtaking views, hiking trails, and fireplace suites.',
        location: { address: '789 Alpine Road', city: 'Denver', country: 'USA' },
        images: ['https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800'],
        amenities: ['WiFi', 'Spa', 'Restaurant', 'Parking', 'Fireplace', 'Hiking'],
        rating: 4.5, reviewCount: 650, starRating: 4,
        priceRange: { min: 6000, max: 12000, currency: 'INR' },
        rooms: [
          createRoom('hotel_003', 1, 'Standard', 6000, 2, 1, 280, 'Queen'),
          createRoom('hotel_003', 2, 'Mountain View', 8500, 2, 2, 380, 'King'),
          createRoom('hotel_003', 3, 'Cabin Suite', 12000, 4, 2, 550, 'King')
        ]
      },
      {
        id: 'hotel_004',
        name: 'Urban Chic Boutique Hotel',
        description: 'Stylish boutique hotel in downtown LA featuring modern design and personalized service.',
        location: { address: '321 Fashion Ave', city: 'Los Angeles', country: 'USA' },
        images: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800'],
        amenities: ['WiFi', 'Gym', 'Restaurant', 'Bar', 'Room Service', 'Parking'],
        rating: 4.6, reviewCount: 820, starRating: 4,
        priceRange: { min: 9000, max: 20000, currency: 'INR' },
        rooms: [
          createRoom('hotel_004', 1, 'Standard', 9000, 2, 1, 300, 'Queen'),
          createRoom('hotel_004', 2, 'Deluxe', 14000, 2, 2, 420, 'King'),
          createRoom('hotel_004', 3, 'Penthouse', 20000, 2, 1, 650, 'King')
        ]
      },
      {
        id: 'hotel_005',
        name: 'Historic Heritage Inn',
        description: 'Charming historic inn with antique furnishings and classic New England hospitality.',
        location: { address: '555 Heritage Lane', city: 'Boston', country: 'USA' },
        images: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800'],
        amenities: ['WiFi', 'Restaurant', 'Parking', 'Concierge', 'Breakfast'],
        rating: 4.4, reviewCount: 540, starRating: 4,
        priceRange: { min: 7000, max: 15000, currency: 'INR' },
        rooms: [
          createRoom('hotel_005', 1, 'Standard', 7000, 2, 1, 290, 'Queen'),
          createRoom('hotel_005', 2, 'Heritage', 10000, 2, 2, 400, 'King'),
          createRoom('hotel_005', 3, 'Colonial Suite', 15000, 4, 2, 600, 'King')
        ]
      },
      {
        id: 'hotel_006',
        name: 'Lakeside Paradise Resort',
        description: 'Serene lakefront property with water activities and peaceful atmosphere.',
        location: { address: '888 Lake Shore Dr', city: 'Chicago', country: 'USA' },
        images: ['https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800'],
        amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Boating', 'Parking'],
        rating: 4.3, reviewCount: 710, starRating: 4,
        priceRange: { min: 8500, max: 18000, currency: 'INR' },
        rooms: [
          createRoom('hotel_006', 1, 'Standard', 8500, 2, 1, 310, 'Queen'),
          createRoom('hotel_006', 2, 'Lake View', 13000, 2, 2, 450, 'King'),
          createRoom('hotel_006', 3, 'Boathouse Suite', 18000, 4, 2, 650, 'King')
        ]
      },
      {
        id: 'hotel_007',
        name: 'Desert Oasis Resort',
        description: 'Luxurious desert retreat with world-class golf course and spectacular sunset views.',
        location: { address: '999 Desert Blvd', city: 'Phoenix', country: 'USA' },
        images: ['https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800'],
        amenities: ['WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Golf', 'Bar'],
        rating: 4.7, reviewCount: 890, starRating: 5,
        priceRange: { min: 11000, max: 26000, currency: 'INR' },
        rooms: [
          createRoom('hotel_007', 1, 'Standard', 11000, 2, 1, 320, 'Queen'),
          createRoom('hotel_007', 2, 'Deluxe', 17000, 2, 2, 480, 'King'),
          createRoom('hotel_007', 3, 'Villa Suite', 26000, 4, 2, 750, 'King')
        ]
      },
      {
        id: 'hotel_008',
        name: 'Golden Gate Business Hotel',
        description: 'Modern hotel designed for business travelers with premium location in San Francisco.',
        location: { address: '111 Market Street', city: 'San Francisco', country: 'USA' },
        images: ['https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800'],
        amenities: ['WiFi', 'Gym', 'Business Center', 'Restaurant', 'Parking', 'Meeting Rooms'],
        rating: 4.5, reviewCount: 760, starRating: 4,
        priceRange: { min: 10000, max: 22000, currency: 'INR' },
        rooms: [
          createRoom('hotel_008', 1, 'Standard', 10000, 2, 0, 280, 'Queen'),
          createRoom('hotel_008', 2, 'Executive', 16000, 2, 1, 400, 'King'),
          createRoom('hotel_008', 3, 'Business Suite', 22000, 3, 1, 550, 'King')
        ]
      },
      
      // UK Hotels
      {
        id: 'hotel_009',
        name: 'The Royal London Hotel',
        description: 'Historic luxury hotel near Buckingham Palace with classic British elegance.',
        location: { address: '100 Pall Mall', city: 'London', country: 'UK' },
        images: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800'],
        amenities: ['WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Concierge'],
        rating: 4.9, reviewCount: 2100, starRating: 5,
        priceRange: { min: 15000, max: 40000, currency: 'INR' },
        rooms: [
          createRoom('hotel_009', 1, 'Standard', 15000, 2, 1, 320, 'Queen'),
          createRoom('hotel_009', 2, 'Deluxe', 22000, 2, 2, 480, 'King'),
          createRoom('hotel_009', 3, 'Royal Suite', 35000, 4, 2, 800, 'King'),
          createRoom('hotel_009', 4, 'Presidential', 40000, 6, 2, 1200, 'King')
        ]
      },
      {
        id: 'hotel_010',
        name: 'Thames Riverside Inn',
        description: 'Charming riverside hotel with stunning views of Tower Bridge.',
        location: { address: '200 Thames Path', city: 'London', country: 'UK' },
        images: ['https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800'],
        amenities: ['WiFi', 'Restaurant', 'Bar', 'River View', 'Parking'],
        rating: 4.4, reviewCount: 680, starRating: 4,
        priceRange: { min: 9000, max: 18000, currency: 'INR' },
        rooms: [
          createRoom('hotel_010', 1, 'Standard', 9000, 2, 1, 290, 'Double'),
          createRoom('hotel_010', 2, 'Riverside', 14000, 2, 2, 420, 'King'),
          createRoom('hotel_010', 3, 'Suite', 18000, 3, 2, 600, 'King')
        ]
      },
      
      // France Hotels
      {
        id: 'hotel_011',
        name: 'Le Grand Paris Hotel',
        description: 'Iconic luxury hotel with Eiffel Tower views and Michelin-starred dining.',
        location: { address: '1 Avenue des Champs-Élysées', city: 'Paris', country: 'France' },
        images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'],
        amenities: ['WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Eiffel View'],
        rating: 4.9, reviewCount: 1850, starRating: 5,
        priceRange: { min: 18000, max: 50000, currency: 'INR' },
        rooms: [
          createRoom('hotel_011', 1, 'Standard', 18000, 2, 1, 300, 'Queen'),
          createRoom('hotel_011', 2, 'Deluxe', 28000, 2, 2, 450, 'King'),
          createRoom('hotel_011', 3, 'Eiffel Suite', 42000, 4, 2, 700, 'King'),
          createRoom('hotel_011', 4, 'Presidential', 50000, 6, 2, 1000, 'King')
        ]
      },
      {
        id: 'hotel_012',
        name: 'Château Bordeaux Vineyard Hotel',
        description: 'Elegant château hotel set among vineyards with wine tasting experiences.',
        location: { address: '50 Route des Vins', city: 'Bordeaux', country: 'France' },
        images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800'],
        amenities: ['WiFi', 'Spa', 'Restaurant', 'Wine Tasting', 'Pool', 'Gardens'],
        rating: 4.7, reviewCount: 920, starRating: 5,
        priceRange: { min: 14000, max: 32000, currency: 'INR' },
        rooms: [
          createRoom('hotel_012', 1, 'Standard', 14000, 2, 1, 320, 'Queen'),
          createRoom('hotel_012', 2, 'Vineyard View', 20000, 2, 2, 480, 'King'),
          createRoom('hotel_012', 3, 'Château Suite', 32000, 4, 2, 720, 'King')
        ]
      },
      
      // Italy Hotels
      {
        id: 'hotel_013',
        name: 'Roma Imperial Palace',
        description: 'Luxury hotel near the Colosseum with Roman architecture and modern amenities.',
        location: { address: 'Via del Corso 100', city: 'Rome', country: 'Italy' },
        images: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800'],
        amenities: ['WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Rooftop Terrace'],
        rating: 4.8, reviewCount: 1650, starRating: 5,
        priceRange: { min: 13000, max: 38000, currency: 'INR' },
        rooms: [
          createRoom('hotel_013', 1, 'Standard', 13000, 2, 1, 310, 'Queen'),
          createRoom('hotel_013', 2, 'Deluxe', 20000, 2, 2, 460, 'King'),
          createRoom('hotel_013', 3, 'Imperial Suite', 32000, 4, 2, 680, 'King'),
          createRoom('hotel_013', 4, 'Penthouse', 38000, 6, 2, 950, 'King')
        ]
      },
      {
        id: 'hotel_014',
        name: 'Venetian Canal Hotel',
        description: 'Romantic hotel on the Grand Canal with private water taxi service.',
        location: { address: 'San Marco 200', city: 'Venice', country: 'Italy' },
        images: ['https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800'],
        amenities: ['WiFi', 'Restaurant', 'Bar', 'Canal View', 'Water Taxi', 'Terrace'],
        rating: 4.6, reviewCount: 890, starRating: 4,
        priceRange: { min: 16000, max: 35000, currency: 'INR' },
        rooms: [
          createRoom('hotel_014', 1, 'Standard', 16000, 2, 1, 290, 'Double'),
          createRoom('hotel_014', 2, 'Canal View', 24000, 2, 2, 420, 'King'),
          createRoom('hotel_014', 3, 'Suite', 35000, 4, 2, 650, 'King')
        ]
      },
      
      // Japan Hotels
      {
        id: 'hotel_015',
        name: 'Tokyo Skyline Tower Hotel',
        description: 'Modern luxury hotel with panoramic views of Mount Fuji and Tokyo Bay.',
        location: { address: '1-1 Shibuya', city: 'Tokyo', country: 'Japan' },
        images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800'],
        amenities: ['WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Onsen'],
        rating: 4.9, reviewCount: 1450, starRating: 5,
        priceRange: { min: 14000, max: 42000, currency: 'INR' },
        rooms: [
          createRoom('hotel_015', 1, 'Standard', 14000, 2, 1, 280, 'Double'),
          createRoom('hotel_015', 2, 'Deluxe', 22000, 2, 2, 400, 'King'),
          createRoom('hotel_015', 3, 'Executive', 32000, 3, 2, 580, 'King'),
          createRoom('hotel_015', 4, 'Sky Suite', 42000, 4, 2, 850, 'King')
        ]
      },
      {
        id: 'hotel_016',
        name: 'Kyoto Traditional Ryokan',
        description: 'Authentic Japanese inn with tatami rooms, kaiseki dining, and zen gardens.',
        location: { address: 'Gion District 50', city: 'Kyoto', country: 'Japan' },
        images: ['https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800'],
        amenities: ['WiFi', 'Restaurant', 'Onsen', 'Garden', 'Tea Ceremony', 'Kimono'],
        rating: 4.8, reviewCount: 780, starRating: 5,
        priceRange: { min: 18000, max: 40000, currency: 'INR' },
        rooms: [
          createRoom('hotel_016', 1, 'Standard', 18000, 2, 1, 250, 'Futon'),
          createRoom('hotel_016', 2, 'Deluxe', 26000, 2, 2, 350, 'Futon'),
          createRoom('hotel_016', 3, 'Suite', 40000, 4, 2, 550, 'Futon')
        ]
      },
      
      // Dubai Hotels
      {
        id: 'hotel_017',
        name: 'Burj View Palace Hotel',
        description: 'Ultra-luxury hotel with views of Burj Khalifa and Dubai Fountain.',
        location: { address: 'Downtown Dubai', city: 'Dubai', country: 'UAE' },
        images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'],
        amenities: ['WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Burj View'],
        rating: 4.9, reviewCount: 1200, starRating: 5,
        priceRange: { min: 20000, max: 60000, currency: 'INR' },
        rooms: [
          createRoom('hotel_017', 1, 'Standard', 20000, 2, 1, 350, 'King'),
          createRoom('hotel_017', 2, 'Deluxe', 30000, 2, 2, 500, 'King'),
          createRoom('hotel_017', 3, 'Executive', 45000, 4, 2, 750, 'King'),
          createRoom('hotel_017', 4, 'Royal Suite', 60000, 6, 2, 1200, 'King')
        ]
      },
      {
        id: 'hotel_018',
        name: 'Palm Jumeirah Beach Resort',
        description: 'Exclusive beachfront resort on Palm Jumeirah with private beach access.',
        location: { address: 'Palm Jumeirah Crescent', city: 'Dubai', country: 'UAE' },
        images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800'],
        amenities: ['WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Beach', 'Water Sports'],
        rating: 4.8, reviewCount: 980, starRating: 5,
        priceRange: { min: 18000, max: 50000, currency: 'INR' },
        rooms: [
          createRoom('hotel_018', 1, 'Standard', 18000, 2, 1, 380, 'King'),
          createRoom('hotel_018', 2, 'Ocean View', 28000, 2, 2, 550, 'King'),
          createRoom('hotel_018', 3, 'Beach Villa', 50000, 6, 2, 900, 'King')
        ]
      },
      
      // India Hotels
      {
        id: 'hotel_019',
        name: 'Taj Mahal Palace Hotel',
        description: 'Iconic luxury hotel with views of the Taj Mahal and Mughal architecture.',
        location: { address: 'Taj Road, Agra', city: 'Agra', country: 'India' },
        images: ['https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800'],
        amenities: ['WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Taj View'],
        rating: 4.9, reviewCount: 2500, starRating: 5,
        priceRange: { min: 8000, max: 25000, currency: 'INR' },
        rooms: [
          createRoom('hotel_019', 1, 'Standard', 8000, 2, 1, 320, 'Queen'),
          createRoom('hotel_019', 2, 'Deluxe', 12000, 2, 2, 480, 'King'),
          createRoom('hotel_019', 3, 'Taj View Suite', 18000, 4, 2, 700, 'King'),
          createRoom('hotel_019', 4, 'Presidential', 25000, 6, 2, 1000, 'King')
        ]
      },
      {
        id: 'hotel_020',
        name: 'Mumbai Marine Drive Hotel',
        description: 'Art Deco hotel on Marine Drive with stunning sea views and heritage charm.',
        location: { address: 'Marine Drive, Mumbai', city: 'Mumbai', country: 'India' },
        images: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800'],
        amenities: ['WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Sea View'],
        rating: 4.7, reviewCount: 1800, starRating: 5,
        priceRange: { min: 10000, max: 30000, currency: 'INR' },
        rooms: [
          createRoom('hotel_020', 1, 'Standard', 10000, 2, 1, 300, 'Queen'),
          createRoom('hotel_020', 2, 'Deluxe', 16000, 2, 2, 450, 'King'),
          createRoom('hotel_020', 3, 'Marine Suite', 24000, 4, 2, 680, 'King'),
          createRoom('hotel_020', 4, 'Penthouse', 30000, 6, 2, 950, 'King')
        ]
      },
      {
        id: 'hotel_021',
        name: 'Jaipur Pink Palace',
        description: 'Royal palace hotel with Rajasthani architecture and elephant experiences.',
        location: { address: 'Pink City, Jaipur', city: 'Jaipur', country: 'India' },
        images: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800'],
        amenities: ['WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Elephant Rides', 'Palace Tours'],
        rating: 4.8, reviewCount: 1200, starRating: 5,
        priceRange: { min: 7000, max: 22000, currency: 'INR' },
        rooms: [
          createRoom('hotel_021', 1, 'Standard', 7000, 2, 1, 310, 'Queen'),
          createRoom('hotel_021', 2, 'Royal', 11000, 2, 2, 460, 'King'),
          createRoom('hotel_021', 3, 'Maharaja Suite', 17000, 4, 2, 650, 'King'),
          createRoom('hotel_021', 4, 'Presidential', 22000, 6, 2, 900, 'King')
        ]
      },
      {
        id: 'hotel_022',
        name: 'Kerala Backwaters Resort',
        description: 'Serene resort on the backwaters with houseboat experiences and Ayurvedic spa.',
        location: { address: 'Alleppey Backwaters', city: 'Kerala', country: 'India' },
        images: ['https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800'],
        amenities: ['WiFi', 'Pool', 'Spa', 'Ayurveda', 'Restaurant', 'Houseboat', 'Yoga'],
        rating: 4.6, reviewCount: 950, starRating: 4,
        priceRange: { min: 6000, max: 18000, currency: 'INR' },
        rooms: [
          createRoom('hotel_022', 1, 'Standard', 6000, 2, 1, 280, 'Queen'),
          createRoom('hotel_022', 2, 'Water View', 9000, 2, 2, 400, 'King'),
          createRoom('hotel_022', 3, 'Premium Suite', 14000, 4, 2, 600, 'King'),
          createRoom('hotel_022', 4, 'Houseboat Villa', 18000, 4, 2, 800, 'King')
        ]
      },
      {
        id: 'hotel_023',
        name: 'Goa Beach Paradise',
        description: 'Vibrant beach resort on Calangute Beach with parties and water sports.',
        location: { address: 'Calangute Beach Road', city: 'Goa', country: 'India' },
        images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800'],
        amenities: ['WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Beach', 'Nightclub'],
        rating: 4.5, reviewCount: 2100, starRating: 4,
        priceRange: { min: 5000, max: 15000, currency: 'INR' },
        rooms: [
          createRoom('hotel_023', 1, 'Standard', 5000, 2, 1, 260, 'Queen'),
          createRoom('hotel_023', 2, 'Beach View', 8000, 2, 2, 380, 'King'),
          createRoom('hotel_023', 3, 'Suite', 12000, 4, 2, 580, 'King'),
          createRoom('hotel_023', 4, 'Beach Villa', 15000, 6, 2, 850, 'King')
        ]
      },
      
      // Thailand Hotels
      {
        id: 'hotel_024',
        name: 'Bangkok Riverside Grand Hotel',
        description: 'Luxury hotel on the Chao Phraya River with Thai architecture and modern comfort.',
        location: { address: 'Charoen Krung Road', city: 'Bangkok', country: 'Thailand' },
        images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'],
        amenities: ['WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'River View'],
        rating: 4.7, reviewCount: 1300, starRating: 5,
        priceRange: { min: 6000, max: 18000, currency: 'INR' },
        rooms: [
          createRoom('hotel_024', 1, 'Standard', 6000, 2, 1, 300, 'Queen'),
          createRoom('hotel_024', 2, 'Deluxe', 9500, 2, 2, 440, 'King'),
          createRoom('hotel_024', 3, 'River Suite', 14000, 4, 2, 650, 'King'),
          createRoom('hotel_024', 4, 'Presidential', 18000, 6, 2, 900, 'King')
        ]
      },
      {
        id: 'hotel_025',
        name: 'Phuket Tropical Beach Resort',
        description: 'Paradise resort on Patong Beach with crystal clear waters and palm trees.',
        location: { address: 'Patong Beach', city: 'Phuket', country: 'Thailand' },
        images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800'],
        amenities: ['WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Beach', 'Water Sports'],
        rating: 4.6, reviewCount: 1100, starRating: 4,
        priceRange: { min: 5000, max: 16000, currency: 'INR' },
        rooms: [
          createRoom('hotel_025', 1, 'Standard', 5000, 2, 1, 280, 'Queen'),
          createRoom('hotel_025', 2, 'Ocean View', 8500, 2, 2, 400, 'King'),
          createRoom('hotel_025', 3, 'Beach Villa', 13000, 4, 2, 620, 'King'),
          createRoom('hotel_025', 4, 'Presidential Villa', 16000, 6, 2, 880, 'King')
        ]
      },
      
      // Maldives Hotels
      {
        id: 'hotel_026',
        name: 'Maldives Overwater Paradise',
        description: 'Luxury overwater bungalows with glass floors and private infinity pools.',
        location: { address: 'North Malé Atoll', city: 'Maldives', country: 'Maldives' },
        images: ['https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800'],
        amenities: ['WiFi', 'Private Pool', 'Spa', 'Restaurant', 'Bar', 'Diving', 'Snorkeling'],
        rating: 4.9, reviewCount: 750, starRating: 5,
        priceRange: { min: 25000, max: 80000, currency: 'INR' },
        rooms: [
          createRoom('hotel_026', 1, 'Beach Villa', 25000, 2, 1, 450, 'King'),
          createRoom('hotel_026', 2, 'Overwater Bungalow', 40000, 2, 1, 600, 'King'),
          createRoom('hotel_026', 3, 'Sunset Villa', 55000, 4, 2, 850, 'King'),
          createRoom('hotel_026', 4, 'Presidential Suite', 80000, 6, 2, 1200, 'King')
        ]
      },
      
      // Singapore Hotels
      {
        id: 'hotel_027',
        name: 'Marina Bay Sands View Hotel',
        description: 'Modern luxury hotel with rooftop infinity pool and skyline views.',
        location: { address: 'Marina Bay', city: 'Singapore', country: 'Singapore' },
        images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'],
        amenities: ['WiFi', 'Infinity Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Skyline View'],
        rating: 4.8, reviewCount: 1600, starRating: 5,
        priceRange: { min: 15000, max: 45000, currency: 'INR' },
        rooms: [
          createRoom('hotel_027', 1, 'Standard', 15000, 2, 1, 320, 'Queen'),
          createRoom('hotel_027', 2, 'Deluxe', 22000, 2, 2, 480, 'King'),
          createRoom('hotel_027', 3, 'Executive Suite', 32000, 4, 2, 700, 'King'),
          createRoom('hotel_027', 4, 'Skyline Penthouse', 45000, 6, 2, 1000, 'King')
        ]
      },
      
      // Australia Hotels
      {
        id: 'hotel_028',
        name: 'Sydney Opera House Hotel',
        description: 'Iconic hotel with views of the Opera House and Sydney Harbour Bridge.',
        location: { address: 'Circular Quay', city: 'Sydney', country: 'Australia' },
        images: ['https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800'],
        amenities: ['WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Opera View'],
        rating: 4.8, reviewCount: 980, starRating: 5,
        priceRange: { min: 18000, max: 50000, currency: 'INR' },
        rooms: [
          createRoom('hotel_028', 1, 'Standard', 18000, 2, 1, 330, 'Queen'),
          createRoom('hotel_028', 2, 'Harbour View', 28000, 2, 2, 500, 'King'),
          createRoom('hotel_028', 3, 'Opera Suite', 38000, 4, 2, 750, 'King'),
          createRoom('hotel_028', 4, 'Presidential', 50000, 6, 2, 1100, 'King')
        ]
      },
      {
        id: 'hotel_029',
        name: 'Great Barrier Reef Resort',
        description: 'Eco-resort on the Great Barrier Reef with diving and marine experiences.',
        location: { address: 'Hamilton Island', city: 'Queensland', country: 'Australia' },
        images: ['https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800'],
        amenities: ['WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Diving', 'Snorkeling'],
        rating: 4.7, reviewCount: 650, starRating: 5,
        priceRange: { min: 20000, max: 55000, currency: 'INR' },
        rooms: [
          createRoom('hotel_029', 1, 'Reef View', 20000, 2, 1, 350, 'King'),
          createRoom('hotel_029', 2, 'Ocean Villa', 32000, 2, 2, 550, 'King'),
          createRoom('hotel_029', 3, 'Beach House', 45000, 6, 2, 900, 'King'),
          createRoom('hotel_029', 4, 'Presidential Villa', 55000, 8, 2, 1300, 'King')
        ]
      },
      
      // Greece Hotels
      {
        id: 'hotel_030',
        name: 'Santorini Cliffside Villas',
        description: 'Whitewashed villas carved into the cliffside with breathtaking caldera views.',
        location: { address: 'Oia Village', city: 'Santorini', country: 'Greece' },
        images: ['https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800'],
        amenities: ['WiFi', 'Private Pool', 'Spa', 'Restaurant', 'Bar', 'Caldera View', 'Sunset Terrace'],
        rating: 4.9, reviewCount: 850, starRating: 5,
        priceRange: { min: 22000, max: 60000, currency: 'INR' },
        rooms: [
          createRoom('hotel_030', 1, 'Cave Suite', 22000, 2, 1, 350, 'Queen'),
          createRoom('hotel_030', 2, 'Caldera View', 35000, 2, 2, 500, 'King'),
          createRoom('hotel_030', 3, 'Private Villa', 48000, 4, 2, 800, 'King'),
          createRoom('hotel_030', 4, 'Presidential Suite', 60000, 6, 2, 1100, 'King')
        ]
      },
      {
        id: 'hotel_031',
        name: 'Athens Acropolis View Hotel',
        description: 'Historic hotel with rooftop views of the Parthenon and ancient Athens.',
        location: { address: 'Plaka District', city: 'Athens', country: 'Greece' },
        images: ['https://images.unsplash.com/photo-1555993539-1732b0258235?w=800'],
        amenities: ['WiFi', 'Rooftop Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Acropolis View'],
        rating: 4.6, reviewCount: 720, starRating: 4,
        priceRange: { min: 9000, max: 25000, currency: 'INR' },
        rooms: [
          createRoom('hotel_031', 1, 'Standard', 9000, 2, 1, 300, 'Queen'),
          createRoom('hotel_031', 2, 'Acropolis View', 15000, 2, 2, 450, 'King'),
          createRoom('hotel_031', 3, 'Parthenon Suite', 22000, 4, 2, 680, 'King')
        ]
      },
      
      // Spain Hotels
      {
        id: 'hotel_032',
        name: 'Barcelona Gaudi Boutique Hotel',
        description: 'Art Nouveau hotel inspired by Gaudi with mosaic details and city views.',
        location: { address: 'Passeig de Gracia', city: 'Barcelona', country: 'Spain' },
        images: ['https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800'],
        amenities: ['WiFi', 'Rooftop Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'City View'],
        rating: 4.7, reviewCount: 890, starRating: 5,
        priceRange: { min: 11000, max: 30000, currency: 'INR' },
        rooms: [
          createRoom('hotel_032', 1, 'Standard', 11000, 2, 1, 310, 'Queen'),
          createRoom('hotel_032', 2, 'Deluxe', 18000, 2, 2, 480, 'King'),
          createRoom('hotel_032', 3, 'Gaudi Suite', 26000, 4, 2, 720, 'King'),
          createRoom('hotel_032', 4, 'Presidential', 30000, 6, 2, 1000, 'King')
        ]
      },
      
      // Brazil Hotels
      {
        id: 'hotel_033',
        name: 'Rio Copacabana Palace Hotel',
        description: 'Iconic beachfront hotel on Copacabana Beach with Art Deco architecture.',
        location: { address: 'Av. Atlantica', city: 'Rio de Janeiro', country: 'Brazil' },
        images: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800'],
        amenities: ['WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Beach Access'],
        rating: 4.8, reviewCount: 1100, starRating: 5,
        priceRange: { min: 12000, max: 35000, currency: 'INR' },
        rooms: [
          createRoom('hotel_033', 1, 'Standard', 12000, 2, 1, 330, 'Queen'),
          createRoom('hotel_033', 2, 'Ocean View', 20000, 2, 2, 500, 'King'),
          createRoom('hotel_033', 3, 'Copacabana Suite', 30000, 4, 2, 780, 'King'),
          createRoom('hotel_033', 4, 'Presidential', 35000, 6, 2, 1100, 'King')
        ]
      },
      
      // South Africa Hotels
      {
        id: 'hotel_034',
        name: 'Cape Town Table Mountain Hotel',
        description: 'Luxury hotel with views of Table Mountain and the V&A Waterfront.',
        location: { address: 'V&A Waterfront', city: 'Cape Town', country: 'South Africa' },
        images: ['https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800'],
        amenities: ['WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Mountain View'],
        rating: 4.7, reviewCount: 760, starRating: 5,
        priceRange: { min: 10000, max: 28000, currency: 'INR' },
        rooms: [
          createRoom('hotel_034', 1, 'Standard', 10000, 2, 1, 320, 'Queen'),
          createRoom('hotel_034', 2, 'Table View', 16000, 2, 2, 480, 'King'),
          createRoom('hotel_034', 3, 'Waterfront Suite', 24000, 4, 2, 720, 'King'),
          createRoom('hotel_034', 4, 'Presidential', 28000, 6, 2, 1000, 'King')
        ]
      },
      
      // Egypt Hotels
      {
        id: 'hotel_035',
        name: 'Nile View Pyramid Resort',
        description: 'Historic resort with views of the Pyramids of Giza and the Nile River.',
        location: { address: 'Giza Plateau', city: 'Cairo', country: 'Egypt' },
        images: ['https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=800'],
        amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Bar', 'Pyramid View', 'Camel Rides'],
        rating: 4.6, reviewCount: 920, starRating: 5,
        priceRange: { min: 8000, max: 22000, currency: 'INR' },
        rooms: [
          createRoom('hotel_035', 1, 'Standard', 8000, 2, 1, 300, 'Queen'),
          createRoom('hotel_035', 2, 'Nile View', 13000, 2, 2, 460, 'King'),
          createRoom('hotel_035', 3, 'Pyramid Suite', 18000, 4, 2, 700, 'King'),
          createRoom('hotel_035', 4, 'Pharaoh Suite', 22000, 6, 2, 950, 'King')
        ]
      }
    ];
    
    saveHotels(demoHotels);
    return demoHotels;
  };
  
  return { getHotels, saveHotels, seedDemoHotels };
};

export default useLocalStorageHotels;
