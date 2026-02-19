import type { Hotel } from '../types';

interface LocalStorageHotelsReturn {
  getHotels: () => Hotel[];
  saveHotels: (hotels: Hotel[]) => void;
  seedDemoHotels: () => Hotel[];
}

// Temporary workaround: Store hotels in localStorage until backend is fixed
export const useLocalStorageHotels = (): LocalStorageHotelsReturn => {
  const STORAGE_KEY = 'stayscape_hotels';
  
  const getHotels = (): Hotel[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  };
  
  const saveHotels = (hotels: Hotel[]): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(hotels));
  };
  
  const seedDemoHotels = (): Hotel[] => {
    const demoHotels: Hotel[] = [
      {
        id: 'hotel_001',
        name: 'Grand Plaza Hotel',
        description: 'Luxury 5-star hotel in the heart of New York City with stunning views and world-class amenities.',
        location: {
          address: '123 Fifth Avenue',
          city: 'New York',
          country: 'USA'
        },
        images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'],
        amenities: ['WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Bar'],
        rating: 4.8,
        reviewCount: 1250,
        starRating: 5,
        priceRange: { min: 8000, max: 35000, currency: 'INR' },
        rooms: [
          { id: 'room_001', hotelId: 'hotel_001', name: 'Standard Room', description: 'Comfortable room with city view', type: 'standard', images: [], capacity: { adults: 2, children: 1 }, amenities: ['WiFi', 'AC', 'TV'], pricePerNight: 8000, currency: 'INR', totalRooms: 10, availableRooms: 10, size: 300, bedType: 'Queen' },
          { id: 'room_002', hotelId: 'hotel_001', name: 'Deluxe Suite', description: 'Spacious suite with luxury amenities', type: 'suite', images: [], capacity: { adults: 2, children: 2 }, amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Balcony'], pricePerNight: 15000, currency: 'INR', totalRooms: 5, availableRooms: 5, size: 500, bedType: 'King' },
          { id: 'room_003', hotelId: 'hotel_001', name: 'Presidential Suite', description: 'Ultimate luxury suite with panoramic views', type: 'premium', images: [], capacity: { adults: 4, children: 2 }, amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Balcony', 'Ocean View'], pricePerNight: 35000, currency: 'INR', totalRooms: 2, availableRooms: 2, size: 800, bedType: 'King' }
        ]
      },
      {
        id: 'hotel_002',
        name: 'Seaside Resort & Spa',
        description: 'Beautiful beachfront resort with private beach, infinity pool, and rejuvenating spa treatments.',
        location: {
          address: '456 Ocean Drive',
          city: 'Miami',
          country: 'USA'
        },
        images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800'],
        amenities: ['WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Beach', 'Bar'],
        rating: 4.7,
        reviewCount: 980,
        starRating: 5,
        priceRange: { min: 12000, max: 25000, currency: 'INR' },
        rooms: [
          { id: 'room_004', hotelId: 'hotel_002', name: 'Ocean View Room', description: 'Room with stunning ocean views', type: 'deluxe', images: [], capacity: { adults: 2, children: 1 }, amenities: ['WiFi', 'AC', 'TV', 'Ocean View'], pricePerNight: 12000, currency: 'INR', totalRooms: 8, availableRooms: 8, size: 350, bedType: 'Queen' },
          { id: 'room_005', hotelId: 'hotel_002', name: 'Beachfront Villa', description: 'Private villa with direct beach access', type: 'suite', images: [], capacity: { adults: 4, children: 2 }, amenities: ['WiFi', 'AC', 'TV', 'Private Pool', 'Beach Access'], pricePerNight: 25000, currency: 'INR', totalRooms: 3, availableRooms: 3, size: 600, bedType: 'King' }
        ]
      },
      {
        id: 'hotel_003',
        name: 'Mountain View Lodge',
        description: 'Cozy mountain retreat with breathtaking views, hiking trails, and fireplace suites.',
        location: {
          address: '789 Alpine Road',
          city: 'Denver',
          country: 'USA'
        },
        images: ['https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800'],
        amenities: ['WiFi', 'Spa', 'Restaurant', 'Parking', 'Fireplace', 'Hiking'],
        rating: 4.5,
        reviewCount: 650,
        starRating: 4,
        priceRange: { min: 6000, max: 10000, currency: 'INR' },
        rooms: [
          { id: 'room_006', hotelId: 'hotel_003', name: 'Cozy Cabin', description: 'Rustic cabin with fireplace', type: 'standard', images: [], capacity: { adults: 2, children: 2 }, amenities: ['WiFi', 'Fireplace', 'Mountain View'], pricePerNight: 6000, currency: 'INR', totalRooms: 12, availableRooms: 12, size: 280, bedType: 'Queen' },
          { id: 'room_007', hotelId: 'hotel_003', name: 'Mountain Suite', description: 'Spacious suite with full kitchen', type: 'suite', images: [], capacity: { adults: 4, children: 2 }, amenities: ['WiFi', 'Fireplace', 'Kitchen', 'Mountain View'], pricePerNight: 10000, currency: 'INR', totalRooms: 6, availableRooms: 6, size: 450, bedType: 'King' }
        ]
      },
      {
        id: 'hotel_004',
        name: 'Urban Boutique Hotel',
        description: 'Stylish boutique hotel in downtown with modern design and personalized service.',
        location: {
          address: '321 Fashion Ave',
          city: 'Los Angeles',
          country: 'USA'
        },
        images: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800'],
        amenities: ['WiFi', 'Gym', 'Restaurant', 'Bar', 'Room Service', 'Parking'],
        rating: 4.6,
        reviewCount: 820,
        starRating: 4,
        priceRange: { min: 9000, max: 20000, currency: 'INR' },
        rooms: [
          { id: 'room_008', hotelId: 'hotel_004', name: 'Designer Room', description: 'Modern room with designer furnishings', type: 'deluxe', images: [], capacity: { adults: 2, children: 1 }, amenities: ['WiFi', 'AC', 'Smart TV', 'Workspace'], pricePerNight: 9000, currency: 'INR', totalRooms: 15, availableRooms: 15, size: 320, bedType: 'Queen' },
          { id: 'room_009', hotelId: 'hotel_004', name: 'Penthouse Suite', description: 'Luxury penthouse with rooftop terrace', type: 'suite', images: [], capacity: { adults: 2, children: 1 }, amenities: ['WiFi', 'AC', 'Smart TV', 'Rooftop Terrace', 'Jacuzzi'], pricePerNight: 20000, currency: 'INR', totalRooms: 2, availableRooms: 2, size: 700, bedType: 'King' }
        ]
      },
      {
        id: 'hotel_005',
        name: 'Historic Inn',
        description: 'Charming historic inn with antique furnishings and classic hospitality.',
        location: {
          address: '555 Heritage Lane',
          city: 'Boston',
          country: 'USA'
        },
        images: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800'],
        amenities: ['WiFi', 'Restaurant', 'Parking', 'Concierge', 'Breakfast'],
        rating: 4.4,
        reviewCount: 540,
        starRating: 4,
        priceRange: { min: 7000, max: 12000, currency: 'INR' },
        rooms: [
          { id: 'room_010', hotelId: 'hotel_005', name: 'Heritage Room', description: 'Classic room with period decor', type: 'standard', images: [], capacity: { adults: 2, children: 1 }, amenities: ['WiFi', 'Antique Decor', 'Garden View'], pricePerNight: 7000, currency: 'INR', totalRooms: 10, availableRooms: 10, size: 300, bedType: 'Queen' },
          { id: 'room_011', hotelId: 'hotel_005', name: 'Colonial Suite', description: 'Elegant suite with separate living area', type: 'suite', images: [], capacity: { adults: 2, children: 2 }, amenities: ['WiFi', 'Antique Decor', 'Living Room', 'Garden View'], pricePerNight: 12000, currency: 'INR', totalRooms: 4, availableRooms: 4, size: 480, bedType: 'King' }
        ]
      },
      {
        id: 'hotel_006',
        name: 'Lakeside Paradise',
        description: 'Serene lakefront property with water activities and peaceful atmosphere.',
        location: {
          address: '888 Lake Shore Dr',
          city: 'Chicago',
          country: 'USA'
        },
        images: ['https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800'],
        amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Boating', 'Parking'],
        rating: 4.3,
        reviewCount: 710,
        starRating: 4,
        priceRange: { min: 8500, max: 16000, currency: 'INR' },
        rooms: [
          { id: 'room_012', hotelId: 'hotel_006', name: 'Lake View Room', description: 'Room overlooking the lake', type: 'deluxe', images: [], capacity: { adults: 2, children: 1 }, amenities: ['WiFi', 'AC', 'TV', 'Lake View'], pricePerNight: 8500, currency: 'INR', totalRooms: 8, availableRooms: 8, size: 340, bedType: 'Queen' },
          { id: 'room_013', hotelId: 'hotel_006', name: 'Boathouse Suite', description: 'Unique suite with private dock', type: 'suite', images: [], capacity: { adults: 4, children: 2 }, amenities: ['WiFi', 'AC', 'TV', 'Private Dock', 'Kitchen'], pricePerNight: 16000, currency: 'INR', totalRooms: 3, availableRooms: 3, size: 550, bedType: 'King' }
        ]
      }
    ];
    
    saveHotels(demoHotels);
    return demoHotels;
  };
  
  return { getHotels, saveHotels, seedDemoHotels };
};

export default useLocalStorageHotels;
