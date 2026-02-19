import React, { useState, useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Calendar, Users, CreditCard, Check, ChevronLeft, Minus, Plus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Alert, LoadingSpinner } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';
import { bookingsApi, hotelsApi } from '../services/hotels';
import { formatCurrency, formatDate, calculateNights } from '../lib/utils';
import type { Hotel, Room } from '../types';

export const Booking: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { hotelId, roomId } = useParams<{ hotelId: string; roomId: string }>();
  const { isAuthenticated, user } = useAuth();
  
  const passedState = location.state as { hotel?: Hotel; room?: Room; checkIn?: string; checkOut?: string; guests?: { adults: number; children: number } } | null;
  
  const [hotel, setHotel] = useState<Hotel | null>(passedState?.hotel || null);
  const [room, setRoom] = useState<Room | null>(passedState?.room || null);
  const [loadingHotel, setLoadingHotel] = useState(!passedState?.hotel && !passedState?.room);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hotelError, setHotelError] = useState<string | null>(null);
  const [bookingComplete, setBookingComplete] = useState(false);
  
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  
  const [checkInDate, setCheckInDate] = useState(passedState?.checkIn || today);
  const [checkOutDate, setCheckOutDate] = useState(passedState?.checkOut || tomorrow);
  const [guests, setGuests] = useState(passedState?.guests || { adults: 2, children: 0 });
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    specialRequests: '',
  });

  React.useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
      }));
    }
  }, [user]);

  React.useEffect(() => {
    const fetchHotelAndRoom = async () => {
      if ((passedState?.hotel && passedState?.room) || !hotelId || !roomId) return;
      
      try {
        setLoadingHotel(true);
        setHotelError(null);
        
        const hotelData = await hotelsApi.getById(hotelId);
        setHotel(hotelData);
        
        const rooms = await hotelsApi.getRooms(hotelId);
        const roomData = rooms.find((r: Room) => r.id === roomId);
        if (roomData) {
          setRoom(roomData);
        } else {
          setHotelError('Room not found');
        }
      } catch (err) {
        console.error('Error fetching hotel/room:', err);
        setHotelError('Failed to load booking details. Please try again.');
      } finally {
        setLoadingHotel(false);
      }
    };

    fetchHotelAndRoom();
  }, [hotelId, roomId, passedState]);

  const nights = useMemo(() => {
    if (!checkInDate || !checkOutDate) return 1;
    return calculateNights(checkInDate, checkOutDate);
  }, [checkInDate, checkOutDate]);

  const totalPrice = useMemo(() => {
    if (!room) return 0;
    return room.pricePerNight * Math.max(nights, 1);
  }, [room, nights]);

  const handleGuestChange = (type: 'adults' | 'children', increment: boolean) => {
    setGuests(prev => {
      const newValue = increment ? prev[type] + 1 : Math.max(type === 'adults' ? 1 : 0, prev[type] - 1);
      return { ...prev, [type]: newValue };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!hotel || !room) {
      setError('Missing booking information');
      return;
    }
    
    if (!checkInDate || !checkOutDate) {
      setError('Please select check-in and check-out dates');
      return;
    }
    
    if (new Date(checkOutDate) <= new Date(checkInDate)) {
      setError('Check-out date must be after check-in date');
      return;
    }
    
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setError('Please fill in all guest information fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      await bookingsApi.create({
        hotelId: hotel.id,
        roomId: room.id,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guests,
        guestDetails: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        },
        specialRequests: formData.specialRequests,
      });

      setBookingComplete(true);
    } catch (err) {
      console.error('Booking error:', err);
      setError('Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loadingHotel) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-400">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (hotelError || !hotel || !room) {
    return (
      <div className="min-h-screen bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Alert variant="error">{hotelError || 'Invalid booking information. Please start over.'}</Alert>
          <Button onClick={() => navigate('/hotels')} className="mt-4">
            Browse Hotels
          </Button>
        </div>
      </div>
    );
  }

  if (bookingComplete) {
    return (
      <div className="min-h-screen bg-gray-900 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="text-center py-12">
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-emerald-900/50 mb-6">
              <Check className="h-10 w-10 text-emerald-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">Booking Confirmed!</h1>
            <p className="text-gray-400 mb-8">
              Your reservation at {hotel.name} has been successfully confirmed.
              A confirmation email has been sent to {formData.email}.
            </p>
            <div className="flex justify-center space-x-4">
              <Button onClick={() => navigate('/my-bookings')}>
                View My Bookings
              </Button>
              <Button variant="outline" onClick={() => navigate('/hotels')}>
                Browse More Hotels
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Back to Hotel
        </button>

        <h1 className="text-3xl font-bold text-white mb-8">Complete Your Booking</h1>

        {error && (
          <Alert variant="error" className="mb-6">
            {error}
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Stay Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Calendar className="h-4 w-4 inline mr-2" />
                      Check-in Date
                    </label>
                    <input
                      type="date"
                      min={today}
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Calendar className="h-4 w-4 inline mr-2" />
                      Check-out Date
                    </label>
                    <input
                      type="date"
                      min={checkInDate || today}
                      value={checkOutDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-300 mb-4">
                    <Users className="h-4 w-4 inline mr-2" />
                    Guests
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-gray-800 border border-gray-700">
                      <span className="text-gray-300">Adults</span>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleGuestChange('adults', false)}
                          disabled={guests.adults <= 1}
                          className="p-1 rounded-lg bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Minus className="h-4 w-4 text-white" />
                        </button>
                        <span className="text-white font-medium w-8 text-center">{guests.adults}</span>
                        <button
                          type="button"
                          onClick={() => handleGuestChange('adults', true)}
                          disabled={guests.adults >= 10}
                          className="p-1 rounded-lg bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Plus className="h-4 w-4 text-white" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-gray-800 border border-gray-700">
                      <span className="text-gray-300">Children</span>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleGuestChange('children', false)}
                          disabled={guests.children <= 0}
                          className="p-1 rounded-lg bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Minus className="h-4 w-4 text-white" />
                        </button>
                        <span className="text-white font-medium w-8 text-center">{guests.children}</span>
                        <button
                          type="button"
                          onClick={() => handleGuestChange('children', true)}
                          disabled={guests.children >= 6}
                          className="p-1 rounded-lg bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Plus className="h-4 w-4 text-white" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Guest Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <Input
                      label="Email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <Input
                    label="Phone Number"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Special Requests (Optional)
                    </label>
                    <textarea
                      className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      rows={4}
                      value={formData.specialRequests}
                      onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                      placeholder="Any special requests for your stay..."
                    />
                  </div>

                  {!isAuthenticated && (
                    <Alert variant="info">
                      Please <button onClick={() => navigate('/login')} className="underline text-blue-300 hover:text-blue-200">sign in</button> or{' '}
                      <button onClick={() => navigate('/register')} className="underline text-blue-300 hover:text-blue-200">create an account</button> to complete your booking.
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    isLoading={loading}
                    disabled={!isAuthenticated}
                  >
                    <CreditCard className="h-5 w-5 mr-2" />
                    Complete Booking - {formatCurrency(totalPrice, room.currency)}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-white">{hotel.name}</h3>
                  <p className="text-sm text-gray-400">{room.name}</p>
                </div>

                <div className="border-t border-b border-gray-700 py-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-400">
                      <Calendar className="h-4 w-4 mr-2" />
                      Check-in
                    </div>
                    <span className="font-medium text-white">{formatDate(checkInDate)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-400">
                      <Calendar className="h-4 w-4 mr-2" />
                      Check-out
                    </div>
                    <span className="font-medium text-white">{formatDate(checkOutDate)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-400">
                      <Users className="h-4 w-4 mr-2" />
                      Guests
                    </div>
                    <span className="font-medium text-white">
                      {guests.adults} Adult{guests.adults !== 1 ? 's' : ''}, {guests.children} Child{guests.children !== 1 ? 'ren' : ''}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">
                      {formatCurrency(room.pricePerNight, room.currency)} x {nights} night{nights !== 1 ? 's' : ''}
                    </span>
                    <span className="text-white">{formatCurrency(room.pricePerNight * nights, room.currency)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Taxes & Fees</span>
                    <span className="text-white">Included</span>
                  </div>
                  <div className="border-t border-gray-700 pt-2 flex justify-between">
                    <span className="font-semibold text-white">Total</span>
                    <span className="text-xl font-bold text-emerald-400">
                      {formatCurrency(totalPrice, room.currency)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
