import React, { useState, useEffect, useMemo } from 'react';
import { Search, MapPin, Star, X, Filter, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { SkeletonCard, Alert } from '../components/ui';
import { useSearch } from '../contexts/SearchContext';
import { hotelsApi } from '../services/hotels';
import { truncateText } from '../lib/utils';
import { Link } from 'react-router-dom';
import type { Hotel } from '../types';

const PRICE_RANGES = [
  { label: 'Under ₹5,000', min: 0, max: 5000, id: 'price-1' },
  { label: '₹5,000 - ₹10,000', min: 5000, max: 10000, id: 'price-2' },
  { label: '₹10,000 - ₹20,000', min: 10000, max: 20000, id: 'price-3' },
  { label: '₹20,000 - ₹35,000', min: 20000, max: 35000, id: 'price-4' },
  { label: '₹35,000+', min: 35000, max: Infinity, id: 'price-5' },
];

const STAR_RATINGS = [
  { value: 5, label: '5 Star', id: 'star-5' },
  { value: 4, label: '4 Star', id: 'star-4' },
  { value: 3, label: '3 Star', id: 'star-3' },
];

const CITIES = ['All Cities', 'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Jaipur', 'Goa', 'Kolkata', 'Pune', 'Agra', 'Udaipur', 'Jodhpur', 'Kochi', 'Ahmedabad', 'Chandigarh'];

const AMENITIES = ['WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Beach', 'Parking', 'Business Center'];

export const Hotels: React.FC = () => {
  const { filters, updateFilters } = useSearch();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCity, setSelectedCity] = useState('All Cities');
  
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [selectedStarRatings, setSelectedStarRatings] = useState<number[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await hotelsApi.getAll();
        const hotelData = response?.data || [];
        setHotels(Array.isArray(hotelData) ? hotelData : []);
      } catch (err) {
        console.error('Error fetching hotels:', err);
        setError('Failed to load hotels. Please try again.');
        setHotels([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  const filteredHotels = useMemo(() => {
    let result = [...hotels];
    
    if (filters.location) {
      const searchTerm = filters.location.toLowerCase();
      result = result.filter(h => 
        h.location?.city?.toLowerCase().includes(searchTerm) ||
        h.name?.toLowerCase().includes(searchTerm) ||
        h.location?.country?.toLowerCase().includes(searchTerm)
      );
    }
    
    if (selectedCity !== 'All Cities') {
      result = result.filter(h => h.location?.city === selectedCity);
    }
    
    if (selectedPriceRanges.length > 0) {
      result = result.filter(hotel => {
        return selectedPriceRanges.some(rangeId => {
          const range = PRICE_RANGES.find(r => r.id === rangeId);
          if (!range || !hotel.priceRange) return false;
          return hotel.priceRange.min >= range.min && hotel.priceRange.min < range.max;
        });
      });
    }
    
    if (selectedStarRatings.length > 0) {
      result = result.filter(hotel => selectedStarRatings.includes(hotel.starRating));
    }
    
    if (selectedAmenities.length > 0) {
      result = result.filter(hotel => 
        hotel.amenities && selectedAmenities.every(amenity => hotel.amenities.includes(amenity))
      );
    }
    
    return result;
  }, [hotels, filters.location, selectedCity, selectedPriceRanges, selectedStarRatings, selectedAmenities]);

  const handlePriceRangeToggle = (rangeId: string) => {
    setSelectedPriceRanges(prev => 
      prev.includes(rangeId) 
        ? prev.filter(id => id !== rangeId)
        : [...prev, rangeId]
    );
  };

  const handleStarRatingToggle = (rating: number) => {
    setSelectedStarRatings(prev => 
      prev.includes(rating)
        ? prev.filter(r => r !== rating)
        : [...prev, rating]
    );
  };

  const handleAmenityToggle = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const clearAllFilters = () => {
    updateFilters({ location: '' });
    setSelectedCity('All Cities');
    setSelectedPriceRanges([]);
    setSelectedStarRatings([]);
    setSelectedAmenities([]);
  };

  const retryFetch = () => {
    setLoading(true);
    setError(null);
    hotelsApi.getAll()
      .then(response => {
        const hotelData = response?.data || [];
        setHotels(Array.isArray(hotelData) ? hotelData : []);
      })
      .catch(err => {
        console.error('Error fetching hotels:', err);
        setError('Failed to load hotels. Please try again.');
      })
      .finally(() => setLoading(false));
  };

  const activeFiltersCount = selectedPriceRanges.length + selectedStarRatings.length + selectedAmenities.length + (selectedCity !== 'All Cities' ? 1 : 0);

  return (
    <div className="min-h-screen pt-20 bg-gray-900">
      <div className="relative py-16 bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 text-white">
            Discover <span className="text-emerald-400">Luxury Hotels</span>
          </h1>
          <p className="text-xl text-center max-w-2xl mx-auto text-gray-400">
            Explore India's finest collection of premium hotels and resorts
          </p>
        </div>
      </div>

      <div className="sticky top-20 z-40 border-y border-gray-700 bg-gray-900/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-400" />
              <input
                type="text"
                placeholder="Search by city or hotel name..."
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                value={filters.location || ''}
                onChange={(e) => updateFilters({ location: e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              <select
                className="px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                {CITIES.map(city => (
                  <option key={city} value={city} className="bg-gray-800 text-white">
                    {city}
                  </option>
                ))}
              </select>
              <Button 
                type="button"
                variant="outline" 
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden relative"
              >
                <Filter className="h-5 w-5" />
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full text-xs flex items-center justify-center bg-emerald-500 text-white">
                    {activeFiltersCount}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <aside className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-72 flex-shrink-0`}>
            <div className="rounded-2xl p-6 sticky top-40 border border-gray-700 bg-gray-800/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg text-white">
                  Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                </h3>
                <div className="flex items-center gap-2">
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={clearAllFilters}
                      className="text-sm hover:underline text-emerald-400"
                    >
                      Clear All
                    </button>
                  )}
                  <button
                    onClick={() => setShowFilters(false)}
                    className="md:hidden text-gray-400 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="mb-8">
                <h4 className="font-semibold mb-4 text-white">Price Range</h4>
                <div className="space-y-3">
                  {PRICE_RANGES.map((range) => (
                    <label key={range.id} className="flex items-center cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedPriceRanges.includes(range.id)}
                        onChange={() => handlePriceRangeToggle(range.id)}
                        className="w-4 h-4 rounded cursor-pointer accent-emerald-500"
                      />
                      <span className="ml-3 text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                        {range.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h4 className="font-semibold mb-4 text-white">Star Rating</h4>
                <div className="space-y-3">
                  {STAR_RATINGS.map((rating) => (
                    <label key={rating.id} className="flex items-center cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedStarRatings.includes(rating.value)}
                        onChange={() => handleStarRatingToggle(rating.value)}
                        className="w-4 h-4 rounded cursor-pointer accent-emerald-500"
                      />
                      <span className="ml-3 text-sm flex items-center text-gray-400 group-hover:text-gray-300 transition-colors">
                        {rating.label}
                        <Star className="h-4 w-4 ml-1 text-yellow-400" fill="currentColor" />
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h4 className="font-semibold mb-4 text-white">Amenities</h4>
                <div className="space-y-3">
                  {AMENITIES.map((amenity) => (
                    <label key={amenity} className="flex items-center cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedAmenities.includes(amenity)}
                        onChange={() => handleAmenityToggle(amenity)}
                        className="w-4 h-4 rounded cursor-pointer accent-emerald-500"
                      />
                      <span className="ml-3 text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                        {amenity}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <div className="flex-grow">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-gray-400">
                {loading ? 'Loading hotels...' : `${filteredHotels.length} hotel${filteredHotels.length !== 1 ? 's' : ''} found`}
              </p>
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="text-sm hover:underline text-emerald-400"
                >
                  Clear all filters
                </button>
              )}
            </div>

            {error && (
              <Alert variant="error" className="mb-6">
                <div className="flex items-center justify-between">
                  <span>{error}</span>
                  <Button variant="ghost" size="sm" onClick={retryFetch}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Retry
                  </Button>
                </div>
              </Alert>
            )}

            <div className="space-y-6">
              {loading ? (
                <>
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                </>
              ) : filteredHotels.length === 0 ? (
                <div className="text-center py-16 rounded-2xl border border-gray-700 bg-gray-800/50">
                  <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gray-700 mb-6">
                    {error ? (
                      <AlertCircle className="h-10 w-10 text-red-400" />
                    ) : (
                      <Search className="h-10 w-10 text-gray-500" />
                    )}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">
                    {error ? 'Error Loading Hotels' : 'No hotels found'}
                  </h3>
                  <p className="mb-6 text-gray-400">
                    {error ? 'Please try again later.' : 'Try adjusting your search criteria or filters.'}
                  </p>
                  {error ? (
                    <Button onClick={retryFetch}>Try Again</Button>
                  ) : (
                    <Button onClick={clearAllFilters}>Clear All Filters</Button>
                  )}
                </div>
              ) : (
                filteredHotels.map((hotel) => (
                  <Card 
                    key={hotel.id} 
                    className="overflow-hidden border border-gray-700 bg-gray-800/50"
                    hover={false}
                  >
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-72 h-56 md:h-auto relative overflow-hidden">
                        <img
                          src={hotel.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'}
                          alt={hotel.name}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        />
                        <div className="absolute top-4 left-4">
                          <Badge 
                            size="md"
                            variant="success"
                          >
                            {hotel.starRating} Star
                          </Badge>
                        </div>
                      </div>
                      <div className="flex-grow p-6">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                          <div className="flex-grow">
                            <CardHeader className="p-0 mb-3">
                              <CardTitle className="text-2xl text-white">
                                {hotel.name}
                              </CardTitle>
                              <CardDescription className="flex items-center mt-2 text-base text-gray-400">
                                <MapPin className="h-4 w-4 mr-2 text-emerald-400" />
                                {hotel.location?.city || 'Unknown'}, {hotel.location?.country || 'India'}
                              </CardDescription>
                            </CardHeader>
                            <div className="flex items-center mb-4">
                              <div className="flex items-center px-3 py-1 rounded-lg mr-4 bg-emerald-900/50 border border-emerald-700">
                                <Star className="h-4 w-4 mr-1 text-yellow-400" fill="currentColor" />
                                <span className="font-bold text-emerald-300">{hotel.rating || 'N/A'}</span>
                              </div>
                              {hotel.reviewCount && (
                                <span className="text-sm text-gray-500">
                                  ({hotel.reviewCount.toLocaleString('en-IN')} reviews)
                                </span>
                              )}
                            </div>
                            <p className="text-sm mb-4 line-clamp-2 text-gray-400">
                              {truncateText(hotel.description || '', 150)}
                            </p>
                            {hotel.amenities && hotel.amenities.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {hotel.amenities.slice(0, 5).map((amenity) => (
                                  <span
                                    key={amenity}
                                    className="text-xs px-3 py-1.5 rounded-full bg-gray-700 text-gray-300"
                                  >
                                    {amenity}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="md:text-right mt-6 md:mt-0 md:ml-8">
                            <div className="mb-4">
                              <span className="text-3xl font-bold text-emerald-400">
                                ₹{(hotel.priceRange?.min || 0).toLocaleString('en-IN')}
                              </span>
                              <span className="text-sm ml-1 text-gray-500">/night</span>
                            </div>
                            <Link to={`/hotels/${hotel.id}`}>
                              <Button className="w-full md:w-auto">View Details</Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
