import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar, Users, CreditCard, Check, ChevronLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Alert } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';
import { bookingsApi } from '../services/hotels';
import { formatCurrency, formatDate, calculateNights } from '../lib/utils';
import type { Hotel, Room } from '../types';

export const Booking: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  const { hotel, room, checkIn, checkOut, guests } = (location.state as { hotel: Hotel; room: Room; checkIn: string; checkOut: string; guests: { adults: number; children: number } }) || {};
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingComplete, setBookingComplete] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    specialRequests: '',
  });

  if (!hotel || !room) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Alert variant="error">Invalid booking information. Please start over.</Alert>
        <Button onClick={() => navigate('/hotels')} className="mt-4">
          Browse Hotels
        </Button>
      </div>
    );
  }

  const nights = checkIn && checkOut ? calculateNights(checkIn, checkOut) : 1;
  const totalPrice = room.pricePerNight * nights;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      await bookingsApi.create({
        hotelId: hotel.id,
        roomId: room.id,
        checkIn,
        checkOut,
        guests: guests || { adults: 2, children: 0 },
        guestDetails: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        },
        specialRequests: formData.specialRequests,
      });

      setBookingComplete(true);
    } catch (err) {
      setError('Failed to create booking. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (bookingComplete) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="text-center py-12">
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
              <Check className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Booking Confirmed!</h1>
            <p className="text-gray-600 mb-8">
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Back to Hotel
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Complete Your Booking</h1>

        {error && (
          <Alert variant="error" className="mb-6">
            {error}
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Special Requests (Optional)
                    </label>
                    <textarea
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      rows={4}
                      value={formData.specialRequests}
                      onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                      placeholder="Any special requests for your stay..."
                    />
                  </div>

                  {!isAuthenticated && (
                    <Alert variant="info">
                      Please <button onClick={() => navigate('/login')} className="underline">sign in</button> or{' '}
                      <button onClick={() => navigate('/register')} className="underline">create an account</button> to complete your booking.
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
                    Complete Booking
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{hotel.name}</h3>
                  <p className="text-sm text-gray-600">{room.name}</p>
                </div>

                <div className="border-t border-b border-gray-100 py-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      Check-in
                    </div>
                    <span className="font-medium">{checkIn ? formatDate(checkIn) : 'Not selected'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      Check-out
                    </div>
                    <span className="font-medium">{checkOut ? formatDate(checkOut) : 'Not selected'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      Guests
                    </div>
                    <span className="font-medium">
                      {guests?.adults || 2} Adults, {guests?.children || 0} Children
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {formatCurrency(room.pricePerNight, room.currency)} x {nights} nights
                    </span>
                    <span>{formatCurrency(totalPrice, room.currency)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Taxes & Fees</span>
                    <span>Included</span>
                  </div>
                  <div className="border-t border-gray-100 pt-2 flex justify-between">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-gray-900">
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