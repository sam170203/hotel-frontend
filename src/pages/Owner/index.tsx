import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Hotel, Plus, BedDouble, Calendar, DollarSign } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { LoadingSpinner, Alert } from '../../components/ui';
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/api';
import type { Hotel as HotelType } from '../../types';

interface OwnerStats {
  totalHotels: number;
  totalRooms: number;
  totalBookings: number;
  revenue: number;
}

export const OwnerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [hotels, setHotels] = useState<HotelType[]>([]);
  const [stats, setStats] = useState<OwnerStats>({
    totalHotels: 0,
    totalRooms: 0,
    totalBookings: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOwnerData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const hotelsResponse = await apiService.get<{ success: boolean; data: HotelType[] }>('/hotels/owner/my-hotels').catch(() => null);
        
        if (hotelsResponse?.success && Array.isArray(hotelsResponse.data)) {
          setHotels(hotelsResponse.data);
          const totalRooms = hotelsResponse.data.reduce((acc, h) => acc + (h.rooms?.length || 0), 0);
          setStats(prev => ({ ...prev, totalHotels: hotelsResponse.data.length, totalRooms }));
        }
        
        const statsResponse = await apiService.get<{ success: boolean; data: OwnerStats }>('/bookings/owner/stats').catch(() => null);
        if (statsResponse?.success && statsResponse.data) {
          setStats(prev => ({ ...prev, ...statsResponse.data }));
        }
      } catch (err) {
        console.error('Error fetching owner data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchOwnerData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 pt-24 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Owner Dashboard</h1>
            <p className="text-gray-400 mt-1">Welcome back, {user?.name}</p>
          </div>
          <Link to="/owner/add-hotel" className="mt-4 md:mt-0">
            <Button leftIcon={<Plus className="h-5 w-5" />}>
              Add New Hotel
            </Button>
          </Link>
        </div>

        {error && <Alert variant="error" className="mb-6">{error}</Alert>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border border-gray-700 bg-gray-800/50" hover={false}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Hotels</p>
                  <p className="text-3xl font-bold text-white">{stats.totalHotels}</p>
                </div>
                <div className="p-3 rounded-full bg-emerald-900/30">
                  <Hotel className="h-6 w-6 text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border border-gray-700 bg-gray-800/50" hover={false}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Rooms</p>
                  <p className="text-3xl font-bold text-white">{stats.totalRooms}</p>
                </div>
                <div className="p-3 rounded-full bg-blue-900/30">
                  <BedDouble className="h-6 w-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border border-gray-700 bg-gray-800/50" hover={false}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Bookings</p>
                  <p className="text-3xl font-bold text-white">{stats.totalBookings}</p>
                </div>
                <div className="p-3 rounded-full bg-purple-900/30">
                  <Calendar className="h-6 w-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border border-gray-700 bg-gray-800/50" hover={false}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Revenue</p>
                  <p className="text-3xl font-bold text-white">₹{stats.revenue.toLocaleString()}</p>
                </div>
                <div className="p-3 rounded-full bg-yellow-900/30">
                  <DollarSign className="h-6 w-6 text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border border-gray-700 bg-gray-800/50" hover={false}>
          <CardHeader>
            <CardTitle className="text-white">Your Hotels</CardTitle>
          </CardHeader>
          <CardContent>
            {hotels.length === 0 ? (
              <div className="text-center py-12">
                <Hotel className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">You haven't added any hotels yet.</p>
                <Link to="/owner/add-hotel">
                  <Button>Add Your First Hotel</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {hotels.map((hotel) => (
                  <div key={hotel.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-700/30 border border-gray-700">
                    <div className="flex items-center gap-4">
                      <img
                        src={hotel.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=100'}
                        alt={hotel.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div>
                        <h3 className="font-semibold text-white">{hotel.name}</h3>
                        <p className="text-sm text-gray-400">{hotel.location?.city}, {hotel.location?.country}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="primary" size="sm">{hotel.starRating} Star</Badge>
                          <Badge variant={hotel.rooms?.length ? 'success' : 'default'} size="sm">
                            {hotel.rooms?.length || 0} Rooms
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Link to={`/owner/add-room/${hotel.id}`}>
                      <Button variant="outline" size="sm" leftIcon={<Plus className="h-4 w-4" />}>
                        Add Room
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export const AddHotel: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    city: '',
    country: 'India',
    starRating: 5,
    amenities: [] as string[],
    images: [] as string[],
  });

  const AMENITY_OPTIONS = ['WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Beach', 'Parking', 'Business Center', 'Room Service', 'Concierge', 'Laundry'];
  const STAR_RATINGS = [3, 4, 5];

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name || !formData.description || !formData.address || !formData.city) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      
      const response = await apiService.post<{ success: boolean; data: { id: string } }>('/hotels', {
        name: formData.name,
        description: formData.description,
        address: formData.address,
        city: formData.city,
        country: formData.country,
        starRating: formData.starRating,
        amenities: formData.amenities,
        image: formData.images.length > 0 ? formData.images[0] : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      });

      if (response.success) {
        navigate('/owner');
      }
    } catch (err) {
      console.error('Error adding hotel:', err);
      setError('Failed to add hotel. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-24 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
        >
          ← Back to Dashboard
        </button>

        <h1 className="text-3xl font-bold text-white mb-8">Add New Hotel</h1>

        {error && <Alert variant="error" className="mb-6">{error}</Alert>}

        <Card className="border border-gray-700 bg-gray-800/50" hover={false}>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Hotel Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Enter hotel name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Describe your hotel..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Address *</label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Street address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">City *</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="City"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Country</label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Star Rating</label>
                  <select
                    value={formData.starRating}
                    onChange={(e) => setFormData({ ...formData, starRating: Number(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {STAR_RATINGS.map(rating => (
                      <option key={rating} value={rating}>{rating} Star</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Amenities</label>
                <div className="flex flex-wrap gap-2">
                  {AMENITY_OPTIONS.map(amenity => (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => handleAmenityToggle(amenity)}
                      className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                        formData.amenities.includes(amenity)
                          ? 'bg-emerald-900/50 border-emerald-500 text-emerald-300'
                          : 'bg-gray-700 border-gray-600 text-gray-300 hover:border-gray-500'
                      }`}
                    >
                      {amenity}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Image URL (Optional)</label>
                <input
                  type="url"
                  value={formData.images[0] || ''}
                  onChange={(e) => setFormData({ ...formData, images: e.target.value ? [e.target.value] : [] })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" isLoading={loading} className="flex-1">
                  Add Hotel
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate('/owner')}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

import { useNavigate, useParams } from 'react-router-dom';

export const AddRoom: React.FC = () => {
  const navigate = useNavigate();
  const { hotelId } = useParams<{ hotelId: string }>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'standard',
    pricePerNight: '',
    capacity: { adults: 2, children: 1 },
    totalRooms: '1',
    bedType: 'Queen',
    size: '',
    amenities: [] as string[],
  });

  const ROOM_TYPES = ['standard', 'deluxe', 'suite', 'premium', 'luxury'];
  const BED_TYPES = ['Single', 'Double', 'Queen', 'King', 'Twin'];
  const ROOM_AMENITIES = ['WiFi', 'AC', 'TV', 'Mini Bar', 'Safe', 'Balcony', 'Ocean View', 'Mountain View', 'Bathtub', 'Workspace'];

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name || !formData.pricePerNight || !hotelId) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      
      const response = await apiService.post<{ success: boolean }>(`/hotels/${hotelId}/rooms`, {
        name: formData.name,
        description: formData.description,
        type: formData.type,
        pricePerNight: Number(formData.pricePerNight),
        maxAdults: formData.capacity.adults,
        maxChildren: formData.capacity.children,
        totalRooms: Number(formData.totalRooms),
        bedType: formData.bedType,
        size: formData.size ? Number(formData.size) : undefined,
        amenities: formData.amenities,
      });

      if (response.success) {
        navigate('/owner');
      }
    } catch (err) {
      console.error('Error adding room:', err);
      setError('Failed to add room. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-24 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
        >
          ← Back to Dashboard
        </button>

        <h1 className="text-3xl font-bold text-white mb-8">Add New Room</h1>

        {error && <Alert variant="error" className="mb-6">{error}</Alert>}

        <Card className="border border-gray-700 bg-gray-800/50" hover={false}>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Room Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g., Deluxe Ocean View Suite"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Describe the room..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Room Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {ROOM_TYPES.map(type => (
                      <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Price per Night (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.pricePerNight}
                    onChange={(e) => setFormData({ ...formData, pricePerNight: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="5000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Total Rooms</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.totalRooms}
                    onChange={(e) => setFormData({ ...formData, totalRooms: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Max Adults</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.capacity.adults}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      capacity: { ...formData.capacity, adults: Number(e.target.value) }
                    })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Max Children</label>
                  <input
                    type="number"
                    min="0"
                    max="6"
                    value={formData.capacity.children}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      capacity: { ...formData.capacity, children: Number(e.target.value) }
                    })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Bed Type</label>
                  <select
                    value={formData.bedType}
                    onChange={(e) => setFormData({ ...formData, bedType: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {BED_TYPES.map(bed => (
                      <option key={bed} value={bed}>{bed}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Room Size (sq ft)</label>
                <input
                  type="number"
                  min="1"
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="350"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Room Amenities</label>
                <div className="flex flex-wrap gap-2">
                  {ROOM_AMENITIES.map(amenity => (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => handleAmenityToggle(amenity)}
                      className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                        formData.amenities.includes(amenity)
                          ? 'bg-emerald-900/50 border-emerald-500 text-emerald-300'
                          : 'bg-gray-700 border-gray-600 text-gray-300 hover:border-gray-500'
                      }`}
                    >
                      {amenity}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit" isLoading={loading} className="flex-1">
                  Add Room
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate('/owner')}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
