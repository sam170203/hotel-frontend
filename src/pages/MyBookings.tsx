import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, AlertCircle, CheckCircle, XCircle, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { LoadingPage, Alert } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';
import { bookingsApi } from '../services/hotels';
import { formatDate, formatCurrency, calculateNights } from '../lib/utils';
import type { Booking } from '../types';

const STATUS_CONFIG = {
  pending: { color: 'warning', icon: Clock, label: 'Pending' },
  confirmed: { color: 'success', icon: CheckCircle, label: 'Confirmed' },
  cancelled: { color: 'danger', icon: XCircle, label: 'Cancelled' },
  completed: { color: 'default', icon: CheckCircle, label: 'Completed' },
};

export const MyBookings: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await bookingsApi.getMyBookings();
        setBookings(data);
      } catch (err) {
        setError('Failed to load your bookings. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchBookings();
    }
  }, [isAuthenticated]);

  const handleCancel = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    try {
      setCancellingId(bookingId);
      await bookingsApi.cancel(bookingId);
      setBookings(bookings.map(b => 
        b.id === bookingId ? { ...b, status: 'cancelled' } : b
      ));
    } catch (err) {
      setError('Failed to cancel booking. Please try again.');
    } finally {
      setCancellingId(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gray-100 mb-6">
            <AlertCircle className="h-10 w-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Sign In</h2>
          <p className="text-gray-600 mb-6">You need to be signed in to view your bookings.</p>
          <Link to="/login">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) return <LoadingPage />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-600 mt-2">Manage your hotel reservations</p>
        </div>

        {error && (
          <Alert variant="error" className="mb-6">
            {error}
          </Alert>
        )}

        {bookings.length === 0 ? (
          <Card className="text-center py-12">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4">
              <Calendar className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings yet</h3>
            <p className="text-gray-600 mb-6">Start exploring hotels and make your first booking.</p>
            <Link to="/hotels">
              <Button>Browse Hotels</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => {
              const statusConfig = STATUS_CONFIG[booking.status];
              const StatusIcon = statusConfig.icon;
              const nights = calculateNights(booking.checkIn, booking.checkOut);

              return (
                <Card key={booking.id} className="overflow-hidden">
                  <div className="flex flex-col lg:flex-row">
                    {/* Hotel Image */}
                    <div className="lg:w-64 h-48 lg:h-auto relative">
                      <img
                        src={booking.hotel.images[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400'}
                        alt={booking.hotel.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge variant={statusConfig.color as any} className="flex items-center">
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusConfig.label}
                        </Badge>
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div className="flex-grow p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                        <div className="flex-grow">
                          <CardHeader className="p-0 mb-4">
                            <CardTitle className="text-xl">{booking.hotel.name}</CardTitle>
                            <CardDescription className="flex items-center mt-1">
                              <MapPin className="h-4 w-4 mr-1" />
                              {booking.hotel.location.city}, {booking.hotel.location.country}
                            </CardDescription>
                          </CardHeader>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-500">Check-in</p>
                              <p className="font-medium">{formatDate(booking.checkIn)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Check-out</p>
                              <p className="font-medium">{formatDate(booking.checkOut)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Room</p>
                              <p className="font-medium">{booking.room.name}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Guests</p>
                              <p className="font-medium">
                                {booking.guests.adults} Adults, {booking.guests.children} Children
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <div>
                              <p className="text-sm text-gray-500">Total Price</p>
                              <p className="text-xl font-bold text-gray-900">
                                {formatCurrency(booking.totalPrice, booking.currency)}
                              </p>
                              <p className="text-sm text-gray-500">
                                {nights} nights · {formatCurrency(booking.room.pricePerNight, booking.currency)}/night
                              </p>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                              <Link to={`/hotels/${booking.hotelId}`}>
                                <Button variant="outline" size="sm">
                                  View Hotel
                                  <ChevronRight className="h-4 w-4 ml-1" />
                                </Button>
                              </Link>
                              {booking.status === 'confirmed' && (
                                <Button
                                  variant="danger"
                                  size="sm"
                                  onClick={() => handleCancel(booking.id)}
                                  isLoading={cancellingId === booking.id}
                                >
                                  Cancel
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};