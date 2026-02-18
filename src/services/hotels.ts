import apiService from './api';
import type { Hotel, Room, Booking, SearchFilters, ApiResponse, PaginatedResponse } from '../types';
import { INDIAN_HOTELS } from '../data/hotels';
import { getLocalHotelById, getLocalRoomsByHotelId } from '../data/rooms';

export const hotelsApi = {
  getLocalHotels: (): Hotel[] => INDIAN_HOTELS,
  
  getLocalHotelById: (id: string): Hotel | null => getLocalHotelById(id),
  
  getLocalRooms: (hotelId: string): Room[] => getLocalRoomsByHotelId(hotelId),
  getAll: async (params?: SearchFilters & { page?: number; limit?: number }): Promise<PaginatedResponse<Hotel>> => {
    const response = await apiService.get<ApiResponse<PaginatedResponse<Hotel>>>('/hotels', params as Record<string, unknown>);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch hotels');
  },

  getById: async (id: string): Promise<Hotel> => {
    try {
      const response = await apiService.get<ApiResponse<Hotel>>(`/hotels/${id}`);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message || 'Failed to fetch hotel');
    } catch {
      const localHotel = getLocalHotelById(id);
      if (localHotel) {
        return localHotel;
      }
      throw new Error('Hotel not found');
    }
  },

  getFeatured: async (): Promise<Hotel[]> => {
    const response = await apiService.get<ApiResponse<Hotel[]>>('/hotels/featured');
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch featured hotels');
  },

  search: async (filters: SearchFilters): Promise<Hotel[]> => {
    const response = await apiService.post<ApiResponse<Hotel[]>>('/hotels/search', filters);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Search failed');
  },

  getRooms: async (hotelId: string): Promise<Room[]> => {
    try {
      const response = await apiService.get<ApiResponse<Room[]>>(`/hotels/${hotelId}/rooms`);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message || 'Failed to fetch rooms');
    } catch {
      return getLocalRoomsByHotelId(hotelId);
    }
  },

  checkAvailability: async (
    hotelId: string,
    checkIn: string,
    checkOut: string,
    guests: { adults: number; children: number }
  ): Promise<Room[]> => {
    const response = await apiService.post<ApiResponse<Room[]>>(`/hotels/${hotelId}/availability`, {
      checkIn,
      checkOut,
      guests,
    });
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to check availability');
  },
};

export const bookingsApi = {
  getMyBookings: async (): Promise<Booking[]> => {
    try {
      const response = await apiService.get<ApiResponse<Booking[]>>('/bookings/my-bookings');
      if (response.success && response.data) {
        return response.data;
      }
      return [];
    } catch {
      const localBookings = localStorage.getItem('localBookings');
      return localBookings ? JSON.parse(localBookings) : [];
    }
  },

  getById: async (id: string): Promise<Booking> => {
    const response = await apiService.get<ApiResponse<Booking>>(`/bookings/${id}`);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch booking');
  },

  create: async (data: {
    hotelId: string;
    roomId: string;
    checkIn: string;
    checkOut: string;
    guests: { adults: number; children: number };
    guestDetails: {
      name: string;
      email: string;
      phone: string;
    };
    specialRequests?: string;
  }): Promise<Booking> => {
    try {
      const response = await apiService.post<ApiResponse<Booking>>('/bookings', data);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message || 'Failed to create booking');
    } catch {
      const hotel = getLocalHotelById(data.hotelId);
      const rooms = getLocalRoomsByHotelId(data.hotelId);
      const room = rooms.find(r => r.id === data.roomId);
      
      if (!hotel || !room) {
        throw new Error('Hotel or room not found');
      }
      
      const nights = data.checkIn && data.checkOut 
        ? Math.ceil((new Date(data.checkOut).getTime() - new Date(data.checkIn).getTime()) / (1000 * 60 * 60 * 24))
        : 1;
      
      const localBooking: Booking = {
        id: `local-${Date.now()}`,
        userId: 'local-user',
        hotelId: data.hotelId,
        roomId: data.roomId,
        hotel,
        room,
        checkIn: data.checkIn,
        checkOut: data.checkOut,
        guests: data.guests,
        totalPrice: room.pricePerNight * nights,
        currency: 'INR',
        status: 'confirmed',
        specialRequests: data.specialRequests,
        guestDetails: data.guestDetails,
        paymentStatus: 'paid',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const existingBookings = JSON.parse(localStorage.getItem('localBookings') || '[]');
      existingBookings.push(localBooking);
      localStorage.setItem('localBookings', JSON.stringify(existingBookings));
      
      return localBooking;
    }
  },

  cancel: async (id: string): Promise<Booking> => {
    try {
      const response = await apiService.put<ApiResponse<Booking>>(`/bookings/${id}/cancel`);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message || 'Failed to cancel booking');
    } catch {
      const localBookings: Booking[] = JSON.parse(localStorage.getItem('localBookings') || '[]');
      const booking = localBookings.find(b => b.id === id);
      if (booking) {
        booking.status = 'cancelled';
        localStorage.setItem('localBookings', JSON.stringify(localBookings));
        return booking;
      }
      throw new Error('Booking not found');
    }
  },
};