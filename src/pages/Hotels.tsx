import React, { useState, useMemo } from 'react';
import { Search, MapPin, Star, X, Filter } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { SkeletonCard } from '../components/ui';
import { useSearch } from '../contexts/SearchContext';
import { INDIAN_HOTELS } from '../data/hotels';
import { truncateText } from '../lib/utils';
import { Link } from 'react-router-dom';

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
  const [loading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCity, setSelectedCity] = useState('All Cities');
  
  // Filter states
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [selectedStarRatings, setSelectedStarRatings] = useState<number[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  // Apply filters
  const filteredHotels = useMemo(() => {
    let result = [...INDIAN_HOTELS];
    
    // Filter by location/city search
    if (filters.location) {
      const searchTerm = filters.location.toLowerCase();
      result = result.filter(h => 
        h.location.city.toLowerCase().includes(searchTerm) ||
        h.name.toLowerCase().includes(searchTerm) ||
        h.location.country.toLowerCase().includes(searchTerm)
      );
    }
    
    // Filter by selected city dropdown
    if (selectedCity !== 'All Cities') {
      result = result.filter(h => h.location.city === selectedCity);
    }
    
    // Filter by price range
    if (selectedPriceRanges.length > 0) {
      result = result.filter(hotel => {
        return selectedPriceRanges.some(rangeId => {
          const range = PRICE_RANGES.find(r => r.id === rangeId);
          if (!range) return false;
          return hotel.priceRange.min >= range.min && hotel.priceRange.min < range.max;
        });
      });
    }
    
    // Filter by star rating
    if (selectedStarRatings.length > 0) {
      result = result.filter(hotel => selectedStarRatings.includes(hotel.starRating));
    }
    
    // Filter by amenities
    if (selectedAmenities.length > 0) {
      result = result.filter(hotel => 
        selectedAmenities.every(amenity => hotel.amenities.includes(amenity))
      );
    }
    
    return result;
  }, [filters.location, selectedCity, selectedPriceRanges, selectedStarRatings, selectedAmenities]);

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

  const activeFiltersCount = selectedPriceRanges.length + selectedStarRatings.length + selectedAmenities.length + (selectedCity !== 'All Cities' ? 1 : 0);

  return (
    <div 
      className="min-h-screen pt-20"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      {/* Hero Header */}
      <div 
        className="relative py-16"
        style={{ backgroundColor: 'var(--bg-secondary)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4" style={{ color: 'var(--text-primary)' }}>
            Discover <span className="text-gradient">Luxury Hotels</span>
          </h1>
          <p className="text-xl text-center max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Explore India's finest collection of premium hotels and resorts
          </p>
        </div>
      </div>

      {/* Search Header */}
      <div 
        className="sticky top-20 z-40 border-y"
        style={{ 
          backgroundColor: 'var(--bg-primary)',
          borderColor: 'var(--border-color)'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: 'var(--accent-500)' }} />
              <input
                type="text"
                placeholder="Search by city or hotel name..."
                className="w-full pl-12 pr-4 py-3 rounded-xl transition-all"
                style={{ 
                  backgroundColor: 'var(--bg-tertiary)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-color)'
                }}
                value={filters.location || ''}
                onChange={(e) => updateFilters({ location: e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              <select
                className="px-4 py-3 rounded-xl"
                style={{ 
                  backgroundColor: 'var(--bg-tertiary)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-color)'
                }}
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                {CITIES.map(city => (
                  <option key={city} value={city} style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
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
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full text-xs flex items-center justify-center"
                    style={{ backgroundColor: 'var(--accent-500)', color: 'white' }}>
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
          {/* Filters Sidebar */}
          <aside className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-72 flex-shrink-0`}>
            <div 
              className="rounded-2xl p-6 sticky top-40 border"
              style={{ 
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-color)'
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
                  Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                </h3>
                <div className="flex items-center gap-2">
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={clearAllFilters}
                      className="text-sm hover:underline"
                      style={{ color: 'var(--accent-500)' }}
                    >
                      Clear All
                    </button>
                  )}
                  <button
                    onClick={() => setShowFilters(false)}
                    className="md:hidden"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="mb-8">
                <h4 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Price Range</h4>
                <div className="space-y-3">
                  {PRICE_RANGES.map((range) => (
                    <label key={range.id} className="flex items-center cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedPriceRanges.includes(range.id)}
                        onChange={() => handlePriceRangeToggle(range.id)}
                        className="w-4 h-4 rounded cursor-pointer"
                        style={{ 
                          accentColor: 'var(--accent-500)',
                          backgroundColor: 'var(--bg-tertiary)',
                          borderColor: 'var(--border-color)'
                        }}
                      />
                      <span 
                        className="ml-3 text-sm transition-colors"
                        style={{ 
                          color: selectedPriceRanges.includes(range.id) ? 'var(--accent-400)' : 'var(--text-secondary)'
                        }}
                      >
                        {range.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Star Rating Filter */}
              <div className="mb-8">
                <h4 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Star Rating</h4>
                <div className="space-y-3">
                  {STAR_RATINGS.map((rating) => (
                    <label key={rating.id} className="flex items-center cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedStarRatings.includes(rating.value)}
                        onChange={() => handleStarRatingToggle(rating.value)}
                        className="w-4 h-4 rounded cursor-pointer"
                        style={{ 
                          accentColor: 'var(--accent-500)',
                          backgroundColor: 'var(--bg-tertiary)',
                          borderColor: 'var(--border-color)'
                        }}
                      />
                      <span 
                        className="ml-3 text-sm flex items-center transition-colors"
                        style={{ 
                          color: selectedStarRatings.includes(rating.value) ? 'var(--accent-400)' : 'var(--text-secondary)'
                        }}
                      >
                        {rating.label}
                        <Star className="h-4 w-4 ml-1" style={{ color: 'var(--accent-500)' }} fill="currentColor" />
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Amenities Filter */}
              <div className="mb-8">
                <h4 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Amenities</h4>
                <div className="space-y-3">
                  {AMENITIES.map((amenity) => (
                    <label key={amenity} className="flex items-center cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedAmenities.includes(amenity)}
                        onChange={() => handleAmenityToggle(amenity)}
                        className="w-4 h-4 rounded cursor-pointer"
                        style={{ 
                          accentColor: 'var(--accent-500)',
                          backgroundColor: 'var(--bg-tertiary)',
                          borderColor: 'var(--border-color)'
                        }}
                      />
                      <span 
                        className="ml-3 text-sm transition-colors"
                        style={{ 
                          color: selectedAmenities.includes(amenity) ? 'var(--accent-400)' : 'var(--text-secondary)'
                        }}
                      >
                        {amenity}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Results */}
          <div className="flex-grow">
            <div className="mb-6 flex items-center justify-between">
              <p style={{ color: 'var(--text-muted)' }}>
                {loading ? 'Loading hotels...' : `${filteredHotels.length} hotels found`}
              </p>
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="text-sm hover:underline"
                  style={{ color: 'var(--accent-500)' }}
                >
                  Clear all filters
                </button>
              )}
            </div>

            <div className="space-y-6">
              {loading ? (
                <>
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                </>
              ) : filteredHotels.length === 0 ? (
                <div 
                  className="text-center py-16 rounded-2xl border"
                  style={{ 
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border-color)'
                  }}
                >
                  <div 
                    className="inline-flex items-center justify-center h-20 w-20 rounded-full mb-6"
                    style={{ backgroundColor: 'var(--bg-tertiary)' }}
                  >
                    <Search className="h-10 w-10" style={{ color: 'var(--text-muted)' }} />
                  </div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                    No hotels found
                  </h3>
                  <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
                    Try adjusting your search criteria or filters.
                  </p>
                  <Button onClick={clearAllFilters}>
                    Clear All Filters
                  </Button>
                </div>
              ) : (
                filteredHotels.map((hotel) => (
                  <Card 
                    key={hotel.id} 
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-72 h-56 md:h-auto relative overflow-hidden">
                        <img
                          src={hotel.images[0]}
                          alt={hotel.name}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        />
                        <div className="absolute top-4 left-4">
                          <Badge 
                            className="border-0 font-bold"
                            style={{ 
                              backgroundColor: 'var(--accent-600)', 
                              color: 'white',
                              boxShadow: '0 4px 14px rgba(34, 197, 94, 0.4)'
                            }}
                          >
                            {hotel.starRating} Star
                          </Badge>
                        </div>
                      </div>
                      <div className="flex-grow p-6">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                          <div className="flex-grow">
                            <CardHeader className="p-0 mb-3">
                              <CardTitle 
                                className="text-2xl transition-colors cursor-pointer"
                                style={{ color: 'var(--text-primary)' }}
                              >
                                {hotel.name}
                              </CardTitle>
                              <CardDescription 
                                className="flex items-center mt-2 text-base"
                                style={{ color: 'var(--text-secondary)' }}
                              >
                                <MapPin className="h-4 w-4 mr-2" style={{ color: 'var(--accent-500)' }} />
                                {hotel.location.city}, {hotel.location.country}
                              </CardDescription>
                            </CardHeader>
                            <div className="flex items-center mb-4">
                              <div 
                                className="flex items-center px-3 py-1 rounded-lg mr-4 border"
                                style={{ 
                                  backgroundColor: 'rgba(34, 197, 94, 0.1)',
                                  borderColor: 'rgba(34, 197, 94, 0.3)'
                                }}
                              >
                                <Star className="h-4 w-4 mr-1" style={{ color: 'var(--accent-400)' }} fill="currentColor" />
                                <span className="font-bold" style={{ color: 'var(--accent-400)' }}>{hotel.rating}</span>
                              </div>
                              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                                ({hotel.reviewCount.toLocaleString('en-IN')} reviews)
                              </span>
                            </div>
                            <p 
                              className="text-sm mb-4 line-clamp-2"
                              style={{ color: 'var(--text-secondary)' }}
                            >
                              {truncateText(hotel.description, 150)}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {hotel.amenities.slice(0, 5).map((amenity) => (
                                <span
                                  key={amenity}
                                  className="text-xs px-3 py-1.5 rounded-full border"
                                  style={{ 
                                    backgroundColor: 'var(--bg-tertiary)',
                                    color: 'var(--text-muted)',
                                    borderColor: 'var(--border-color)'
                                  }}
                                >
                                  {amenity}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="md:text-right mt-6 md:mt-0 md:ml-8">
                            <div className="mb-4">
                              <span className="text-3xl font-bold text-gradient">
                                ₹{hotel.priceRange.min.toLocaleString('en-IN')}
                              </span>
                              <span className="text-sm ml-1" style={{ color: 'var(--text-muted)' }}>/night</span>
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