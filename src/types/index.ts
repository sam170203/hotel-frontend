export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: string;
  avatar?: string;
  createdAt?: string;
}

export interface Hotel {
  id: string;
  name: string;
  description: string;
  location: {
    address: string;
    city: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  images: string[];
  amenities: string[];
  rating: number;
  reviewCount: number;
  starRating: number;
  priceRange: {
    min: number;
    max: number;
    currency: string;
  };
  rooms: Room[];
  policies?: {
    checkIn: string;
    checkOut: string;
    cancellation: string;
  };
}

export interface Room {
  id: string;
  hotelId: string;
  name: string;
  description: string;
  type: string;
  images: string[];
  capacity: {
    adults: number;
    children: number;
  };
  amenities: string[];
  pricePerNight: number;
  currency: string;
  totalRooms: number;
  availableRooms: number;
  size?: number;
  bedType?: string;
}

export interface Booking {
  id: string;
  userId: string;
  hotelId: string;
  roomId: string;
  hotel: Hotel;
  room: Room;
  checkIn: string;
  checkOut: string;
  guests: {
    adults: number;
    children: number;
  };
  totalPrice: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  specialRequests?: string;
  guestDetails: {
    name: string;
    email: string;
    phone: string;
  };
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdAt: string;
  updatedAt: string;
}

export interface SearchFilters {
  location?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: {
    adults: number;
    children: number;
  };
  priceRange?: {
    min: number;
    max: number;
  };
  rating?: number;
  amenities?: string[];
  starRating?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}