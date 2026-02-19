import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Star, Wifi, Waves, Utensils, Car, Dumbbell, Wine, PawPrint, Briefcase, Calendar, Users, Minus, Plus, ChevronLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { LoadingPage, Alert } from '../components/ui';
import { hotelsApi } from '../services/hotels';
import { formatCurrency, calculateNights } from '../lib/utils';
import { useSearch } from '../contexts/SearchContext';
import type { Hotel, Room } from '../types';

const AMENITY_ICONS: Record<string, React.ElementType> = {
  WiFi: Wifi,
  Pool: Waves,
  Restaurant: Utensils,
  Parking: Car,
  Gym: Dumbbell,
  Bar: Wine,
  Beach: Waves,
  'Pet Friendly': PawPrint,
  'Business Center': Briefcase,
};

export const HotelDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { filters, updateFilters } = useSearch();
  
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  
  const [checkIn, setCheckIn] = useState(filters.checkIn || today);
  const [checkOut, setCheckOut] = useState(filters.checkOut || tomorrow);
  const [guests, setGuests] = useState(filters.guests || { adults: 2, children: 0 });

  useEffect(() => {
    const fetchHotelData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const [hotelData, roomsData] = await Promise.all([
          hotelsApi.getById(id).catch(() => null),
          hotelsApi.getRooms(id).catch(() => []),
        ]);
        
        if (hotelData) {
          setHotel(hotelData);
          setRooms(Array.isArray(roomsData) ? roomsData : []);
        } else {
          setError('Hotel not found');
        }
      } catch (err) {
        console.error('Error fetching hotel:', err);
        setError('Failed to load hotel details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchHotelData();
  }, [id]);

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 1;
    const diff = calculateNights(checkIn, checkOut);
    return Math.max(1, diff);
  }, [checkIn, checkOut]);

  const handleGuestChange = (type: 'adults' | 'children', increment: boolean) => {
    setGuests(prev => {
      const newValue = increment ? prev[type] + 1 : Math.max(type === 'adults' ? 1 : 0, prev[type] - 1);
      const newGuests = { ...prev, [type]: newValue };
      updateFilters({ guests: newGuests });
      return newGuests;
    });
  };

  const handleBookRoom = (room: Room) => {
    if (!hotel) return;
    
    updateFilters({ checkIn, checkOut, guests });
    
    navigate(`/booking/${hotel.id}/${room.id}`, {
      state: {
        hotel,
        room,
        checkIn,
        checkOut,
        guests,
      },
    });
  };

  if (loading) return <LoadingPage />;
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Alert variant="error">{error}</Alert>
          <Button onClick={() => navigate('/hotels')} className="mt-4">
            Back to Hotels
          </Button>
        </div>
      </div>
    );
  }
  
  if (!hotel) {
    return (
      <div className="min-h-screen bg-gray-900 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Alert variant="error">Hotel not found</Alert>
          <Button onClick={() => navigate('/hotels')} className="mt-4">
            Back to Hotels
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pb-12">
      <div className="relative h-72 md:h-96">
        <img
          src={hotel.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200'}
          alt={hotel.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-24 left-4 md:left-8 flex items-center text-white/80 hover:text-white transition-colors"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Back
        </button>
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge variant="primary" size="md">{hotel.starRating} Star Hotel</Badge>
              <div className="flex items-center bg-white/10 backdrop-blur px-3 py-1 rounded-full">
                <Star className="h-4 w-4 text-yellow-400 mr-1" fill="currentColor" />
                <span className="font-semibold text-white">{hotel.rating || 'N/A'}</span>
                {hotel.reviewCount && (
                  <span className="text-gray-300 ml-1">({hotel.reviewCount} reviews)</span>
                )}
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{hotel.name}</h1>
            <p className="text-gray-300 flex items-center text-lg">
              <MapPin className="h-5 w-5 mr-2 text-emerald-400" />
              {hotel.location?.address || ''}, {hotel.location?.city || 'Unknown'}, {hotel.location?.country || 'India'}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-4">About this property</h2>
              <p className="text-gray-300 leading-relaxed">{hotel.description}</p>
            </section>

            {hotel.amenities && hotel.amenities.length > 0 && (
              <section className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <h2 className="text-xl font-bold text-white mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {hotel.amenities.map((amenity) => {
                    const Icon = AMENITY_ICONS[amenity] || Star;
                    return (
                      <div key={amenity} className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-emerald-900/50 flex items-center justify-center">
                          <Icon className="h-5 w-5 text-emerald-400" />
                        </div>
                        <span className="text-gray-300">{amenity}</span>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {hotel.policies && (
              <section className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <h2 className="text-xl font-bold text-white mb-4">Policies</h2>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-700">
                    <span className="text-gray-400">Check-in</span>
                    <span className="font-medium text-white">{hotel.policies.checkIn || '2:00 PM'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-700">
                    <span className="text-gray-400">Check-out</span>
                    <span className="font-medium text-white">{hotel.policies.checkOut || '11:00 AM'}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-400">Cancellation</span>
                    <span className="font-medium text-white">{hotel.policies.cancellation || 'Free cancellation up to 24 hours'}</span>
                  </div>
                </div>
              </section>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 sticky top-24">
              <h2 className="text-xl font-bold text-white mb-6">Book Your Stay</h2>
              
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      <Calendar className="h-4 w-4 inline mr-1" />
                      Check-in
                    </label>
                    <input
                      type="date"
                      min={today}
                      value={checkIn}
                      onChange={(e) => {
                        setCheckIn(e.target.value);
                        updateFilters({ checkIn: e.target.value });
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      <Calendar className="h-4 w-4 inline mr-1" />
                      Check-out
                    </label>
                    <input
                      type="date"
                      min={checkIn || today}
                      value={checkOut}
                      onChange={(e) => {
                        setCheckOut(e.target.value);
                        updateFilters({ checkOut: e.target.value });
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    <Users className="h-4 w-4 inline mr-1" />
                    Guests
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-gray-700 border border-gray-600">
                      <span className="text-xs text-gray-400">Adults</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleGuestChange('adults', false)}
                          className="p-0.5 rounded bg-gray-600 hover:bg-gray-500"
                        >
                          <Minus className="h-3 w-3 text-white" />
                        </button>
                        <span className="text-white text-sm w-4 text-center">{guests.adults}</span>
                        <button
                          type="button"
                          onClick={() => handleGuestChange('adults', true)}
                          className="p-0.5 rounded bg-gray-600 hover:bg-gray-500"
                        >
                          <Plus className="h-3 w-3 text-white" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-gray-700 border border-gray-600">
                      <span className="text-xs text-gray-400">Children</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleGuestChange('children', false)}
                          className="p-0.5 rounded bg-gray-600 hover:bg-gray-500"
                        >
                          <Minus className="h-3 w-3 text-white" />
                        </button>
                        <span className="text-white text-sm w-4 text-center">{guests.children}</span>
                        <button
                          type="button"
                          onClick={() => handleGuestChange('children', true)}
                          className="p-0.5 rounded bg-gray-600 hover:bg-gray-500"
                        >
                          <Plus className="h-3 w-3 text-white" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-white mb-4">Available Rooms</h3>
              
              {rooms.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400">No rooms available</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {rooms.map((room) => (
                    <div
                      key={room.id}
                      className={`border rounded-lg p-4 transition-all cursor-pointer ${
                        selectedRoom?.id === room.id
                          ? 'border-emerald-500 bg-emerald-900/20'
                          : 'border-gray-600 hover:border-gray-500 bg-gray-700/30'
                      }`}
                      onClick={() => setSelectedRoom(room)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-white">{room.name}</h4>
                          <p className="text-xs text-gray-400">{room.type}</p>
                        </div>
                        {room.availableRooms !== undefined && (
                          <Badge variant={room.availableRooms > 5 ? 'success' : 'warning'} size="sm">
                            {room.availableRooms} left
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-400 mb-3 line-clamp-2">{room.description}</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xl font-bold text-emerald-400">
                            {formatCurrency(room.pricePerNight * nights, room.currency || 'INR')}
                          </span>
                          <span className="text-gray-500 text-sm"> / {nights} night{nights !== 1 ? 's' : ''}</span>
                        </div>
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBookRoom(room);
                          }}
                          disabled={room.availableRooms === 0}
                        >
                          Book
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
