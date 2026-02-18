import type { Room } from '../types';
import { INDIAN_HOTELS } from './hotels';

const ROOM_TYPES = [
  { name: 'Deluxe Room', type: 'deluxe', description: 'Comfortable room with modern amenities and city views', bedType: 'King Bed', size: 28 },
  { name: 'Executive Suite', type: 'suite', description: 'Spacious suite with separate living area and premium amenities', bedType: 'King Bed', size: 45 },
  { name: 'Premium Room', type: 'premium', description: 'Elegant room with premium furnishings and enhanced services', bedType: 'Queen Bed', size: 32 },
  { name: 'Luxury Suite', type: 'luxury', description: 'Opulent suite with breathtaking views and exclusive privileges', bedType: 'King Bed', size: 55 },
  { name: 'Standard Room', type: 'standard', description: 'Well-appointed room with essential amenities', bedType: 'Double Bed', size: 22 },
];

function generateRoomsForHotel(hotelId: string, basePrice: number): Room[] {
  return ROOM_TYPES.map((roomType, index) => {
    const priceMultiplier = [1, 2.2, 1.5, 3, 0.8][index];
    return {
      id: `${hotelId}-room-${index + 1}`,
      hotelId,
      name: roomType.name,
      description: roomType.description,
      type: roomType.type,
      images: [
        'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800',
      ],
      capacity: {
        adults: roomType.type === 'suite' || roomType.type === 'luxury' ? 3 : 2,
        children: roomType.type === 'suite' || roomType.type === 'luxury' ? 2 : 1,
      },
      amenities: ['WiFi', 'Air Conditioning', 'TV', 'Mini Bar', 'Room Service'],
      pricePerNight: Math.round(basePrice * priceMultiplier),
      currency: 'INR',
      totalRooms: [10, 5, 8, 3, 15][index],
      availableRooms: [6, 2, 5, 1, 10][index],
      size: roomType.size,
      bedType: roomType.bedType,
    };
  });
}

export const LOCAL_ROOMS: Record<string, Room[]> = {};

INDIAN_HOTELS.forEach((hotel) => {
  LOCAL_ROOMS[hotel.id] = generateRoomsForHotel(hotel.id, hotel.priceRange.min);
});

export function getLocalHotelById(id: string) {
  return INDIAN_HOTELS.find((hotel) => hotel.id === id) || null;
}

export function getLocalRoomsByHotelId(hotelId: string) {
  return LOCAL_ROOMS[hotelId] || [];
}
