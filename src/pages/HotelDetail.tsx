import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Star, Wifi, Waves, Utensils, Car, Dumbbell, Wine, PawPrint, Briefcase } from 'lucide-react';
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
  const { filters } = useSearch();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  useEffect(() => {
    const fetchHotelData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        const [hotelData, roomsData] = await Promise.all([
          hotelsApi.getById(id),
          hotelsApi.getRooms(id),
        ]);
        setHotel(hotelData);
        setRooms(roomsData);
      } catch (err) {
        setError('Failed to load hotel details. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHotelData();
  }, [id]);

  const handleBookRoom = (room: Room) => {
    setSelectedRoom(room);
    navigate(`/booking/${hotel?.id}/${room.id}`, {
      state: {
        hotel,
        room,
        checkIn: filters.checkIn,
        checkOut: filters.checkOut,
        guests: filters.guests,
      },
    });
  };

  if (loading) return <LoadingPage />;
  if (error) return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Alert variant="error">{error}</Alert>
    </div>
  );
  if (!hotel) return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Alert variant="error">Hotel not found</Alert>
    </div>
  );

  const nights = filters.checkIn && filters.checkOut
    ? calculateNights(filters.checkIn, filters.checkOut)
    : 1;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Hero Image */}
      <div className="relative h-96">
        <img
          src={hotel.images[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200'}
          alt={hotel.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center space-x-2 mb-2">
              <Badge variant="primary" className="text-sm">{hotel.starRating} Star Hotel</Badge>
              <div className="flex items-center bg-white/90 px-3 py-1 rounded-full">
                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                <span className="font-semibold text-gray-900">{hotel.rating}</span>
                <span className="text-gray-600 ml-1">({hotel.reviewCount} reviews)</span>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">{hotel.name}</h1>
            <p className="text-white/90 flex items-center text-lg">
              <MapPin className="h-5 w-5 mr-2" />
              {hotel.location.address}, {hotel.location.city}, {hotel.location.country}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <section className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About this property</h2>
              <p className="text-gray-600 leading-relaxed">{hotel.description}</p>
            </section>

            {/* Amenities */}
            <section className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {hotel.amenities.map((amenity) => {
                  const Icon = AMENITY_ICONS[amenity] || Star;
                  return (
                    <div key={amenity} className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-primary-600" />
                      </div>
                      <span className="text-gray-700">{amenity}</span>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Policies */}
            {hotel.policies && (
              <section className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Policies</h2>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Check-in</span>
                    <span className="font-medium">{hotel.policies.checkIn}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Check-out</span>
                    <span className="font-medium">{hotel.policies.checkOut}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Cancellation</span>
                    <span className="font-medium">{hotel.policies.cancellation}</span>
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* Rooms & Booking */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Available Rooms</h2>
              
              {rooms.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No rooms available for selected dates</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {rooms.map((room) => (
                    <div
                      key={room.id}
                      className={`border rounded-lg p-4 transition-all ${
                        selectedRoom?.id === room.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-primary-300'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900">{room.name}</h3>
                        <Badge variant={room.availableRooms > 5 ? 'success' : 'warning'}>
                          {room.availableRooms} left
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{room.description}</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xl font-bold text-gray-900">
                            {formatCurrency(room.pricePerNight * nights, room.currency)}
                          </span>
                          <span className="text-gray-500 text-sm"> / {nights} nights</span>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleBookRoom(room)}
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