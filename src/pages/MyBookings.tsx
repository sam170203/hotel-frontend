import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, AlertCircle, CheckCircle, XCircle, ChevronRight, RefreshCw } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { LoadingPage, Alert } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';
import { bookingsApi } from '../services/hotels';
import { formatDate, formatCurrency, calculateNights } from '../lib/utils';
import type { Booking } from '../types';

const STATUS_CONFIG: Record<string, { variant: 'warning' | 'success' | 'danger' | 'default'; icon: React.ElementType; label: string }> = {
  pending: { variant: 'warning', icon: Clock, label: 'Pending' },
  confirmed: { variant: 'success', icon: CheckCircle, label: 'Confirmed' },
  cancelled: { variant: 'danger', icon: XCircle, label: 'Cancelled' },
  completed: { variant: 'default', icon: CheckCircle, label: 'Completed' },
};

export const MyBookings: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await bookingsApi.getMyBookings();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to load your bookings. Please try again.');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchBookings();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const handleCancel = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    try {
      setCancellingId(bookingId);
      await bookingsApi.cancel(bookingId);
      setBookings(bookings.map(b => 
        b.id === bookingId ? { ...b, status: 'cancelled' as const } : b
      ));
    } catch (err) {
      console.error('Error cancelling booking:', err);
      setError('Failed to cancel booking. Please try again.');
    } finally {
      setCancellingId(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gray-800 mb-6">
            <AlertCircle className="h-10 w-10 text-gray-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Please Sign In</h2>
          <p className="text-gray-400 mb-6">You need to be signed in to view your bookings.</p>
          <Link to="/login">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) return <LoadingPage />;

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">My Bookings</h1>
          <p className="text-gray-400 mt-2">Manage your hotel reservations</p>
        </div>

        {error && (
          <Alert variant="error" className="mb-6">
            <div className="flex items-center justify-between">
              <span>{error}</span>
              <Button variant="ghost" size="sm" onClick={fetchBookings}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </Alert>
        )}

        {bookings.length === 0 ? (
          <Card className="text-center py-12 border border-gray-700 bg-gray-800/50" hover={false}>
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gray-700 mb-4">
              <Calendar className="h-8 w-8 text-gray-500" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No bookings yet</h3>
            <p className="text-gray-400 mb-6">Start exploring hotels and make your first booking.</p>
            <Link to="/hotels">
              <Button>Browse Hotels</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => {
              const statusConfig = STATUS_CONFIG[booking.status] || STATUS_CONFIG.pending;
              const StatusIcon = statusConfig.icon;
              const nights = booking.checkIn && booking.checkOut ? calculateNights(booking.checkIn, booking.checkOut) : 1;

              return (
                <Card 
                  key={booking.id} 
                  className="overflow-hidden border border-gray-700 bg-gray-800/50"
                  hover={false}
                >
                  <div className="flex flex-col lg:flex-row">
                    <div className="lg:w-64 h-48 lg:h-auto relative">
                      <img
                        src={booking.hotel?.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400'}
                        alt={booking.hotel?.name || 'Hotel'}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge variant={statusConfig.variant} className="flex items-center">
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusConfig.label}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex-grow p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                        <div className="flex-grow">
                          <CardHeader className="p-0 mb-4">
                            <CardTitle className="text-xl text-white">{booking.hotel?.name || 'Unknown Hotel'}</CardTitle>
                            <CardDescription className="flex items-center mt-1 text-gray-400">
                              <MapPin className="h-4 w-4 mr-1" />
                              {booking.hotel?.location?.city || 'Unknown'}, {booking.hotel?.location?.country || 'India'}
                            </CardDescription>
                          </CardHeader>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-500">Check-in</p>
                              <p className="font-medium text-white">{booking.checkIn ? formatDate(booking.checkIn) : 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Check-out</p>
                              <p className="font-medium text-white">{booking.checkOut ? formatDate(booking.checkOut) : 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Room</p>
                              <p className="font-medium text-white">{booking.room?.name || 'Standard Room'}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Guests</p>
                              <p className="font-medium text-white">
                                {booking.guests?.adults || 0} Adult{booking.guests?.adults !== 1 ? 's' : ''}, {booking.guests?.children || 0} Child{booking.guests?.children !== 1 ? 'ren' : ''}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                            <div>
                              <p className="text-sm text-gray-500">Total Price</p>
                              <p className="text-xl font-bold text-white">
                                {formatCurrency(booking.totalPrice || 0, booking.currency || 'INR')}
                              </p>
                              {booking.room?.pricePerNight && (
                                <p className="text-sm text-gray-500">
                                  {nights} night{nights !== 1 ? 's' : ''} · {formatCurrency(booking.room.pricePerNight, booking.currency || 'INR')}/night
                                </p>
                              )}
                            </div>
                            
                            <div className="flex items-center space-x-3">
                              {booking.hotelId && (
                                <Link to={`/hotels/${booking.hotelId}`}>
                                  <Button variant="outline" size="sm">
                                    View Hotel
                                    <ChevronRight className="h-4 w-4 ml-1" />
                                  </Button>
                                </Link>
                              )}
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
