import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Star, ArrowRight, Hotel, Shield, Clock, Tag, MapPinned } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { SkeletonCard } from '../components/ui/LoadingSpinner';
import { useSearch } from '../contexts/SearchContext';
import { INDIAN_HOTELS, FEATURES } from '../data/hotels';

const getFeatureIcon = (iconName: string) => {
  const icons: Record<string, React.ElementType> = {
    Shield,
    Clock,
    Tag,
    Hotel,
    Star,
    MapPinned,
  };
  return icons[iconName] || Star;
};

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { filters, updateFilters } = useSearch();
  const [isLoading] = useState(false);
  const [featuredHotels] = useState(INDIAN_HOTELS.slice(0, 6));
  const [animationStarted, setAnimationStarted] = useState(false);

  useEffect(() => {
    setAnimationStarted(true);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/hotels');
  };

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
      {/* Debug Element - Should always be visible */}
      <div style={{ 
        backgroundColor: '#22c55e', 
        color: 'white', 
        padding: '20px', 
        textAlign: 'center',
        fontSize: '24px',
        fontWeight: 'bold'
      }}>
        ✅ StayScape is Loading...
      </div>
      {/* Hero Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: 'var(--bg-primary)' }}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl animate-pulse-slow"
            style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)' }}
          />
          <div 
            className="absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl animate-pulse-slow"
            style={{ backgroundColor: 'rgba(34, 197, 94, 0.05)', animationDelay: '1s' }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div 
              className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full border mb-8 transition-all duration-1000 ${animationStarted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ 
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                borderColor: 'rgba(34, 197, 94, 0.3)'
              }}
            >
              <Star className="h-4 w-4" style={{ color: 'var(--accent-400)' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--accent-400)' }}>
                India's Premium Hotel Booking Platform
              </span>
            </div>

            {/* Main Heading */}
            <h1 
              className={`text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight transition-all duration-1000 delay-100 ${animationStarted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ color: 'var(--text-primary)' }}
            >
              Discover <span className="text-gradient">Luxury Stays</span>
              <br />
              Across India
            </h1>

            <p 
              className={`text-xl md:text-2xl mb-12 max-w-2xl mx-auto leading-relaxed transition-all duration-1000 delay-200 ${animationStarted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ color: 'var(--text-secondary)' }}
            >
              Experience unparalleled hospitality at handpicked hotels from Kashmir to Kanyakumari
            </p>

            {/* Search Box */}
            <div className={`transition-all duration-1000 delay-300 ${animationStarted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div 
                className="p-4 max-w-4xl mx-auto rounded-2xl border"
                style={{ 
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-color)'
                }}
              >
                <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: 'var(--accent-500)' }} />
                    <input
                      type="text"
                      placeholder="Where to?"
                      className="w-full pl-12 pr-4 py-4 rounded-xl transition-all focus:outline-none focus:ring-2"
                      style={{ 
                        backgroundColor: 'var(--bg-tertiary)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-color)'
                      }}
                      value={filters.location || ''}
                      onChange={(e) => updateFilters({ location: e.target.value })}
                    />
                  </div>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: 'var(--accent-500)' }} />
                    <input
                      type="date"
                      className="w-full pl-12 pr-4 py-4 rounded-xl transition-all focus:outline-none focus:ring-2"
                      style={{ 
                        backgroundColor: 'var(--bg-tertiary)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-color)'
                      }}
                      value={filters.checkIn || ''}
                      onChange={(e) => updateFilters({ checkIn: e.target.value })}
                    />
                  </div>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: 'var(--accent-500)' }} />
                    <input
                      type="date"
                      className="w-full pl-12 pr-4 py-4 rounded-xl transition-all focus:outline-none focus:ring-2"
                      style={{ 
                        backgroundColor: 'var(--bg-tertiary)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-color)'
                      }}
                      value={filters.checkOut || ''}
                      onChange={(e) => updateFilters({ checkOut: e.target.value })}
                    />
                  </div>
                  <Button type="submit" size="lg" className="w-full md:w-auto py-4">
                    <Search className="h-5 w-5 mr-2" />
                    Search
                  </Button>
                </form>
              </div>
            </div>

            {/* Stats */}
            <div className={`grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto transition-all duration-1000 delay-500 ${animationStarted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gradient mb-1">500+</div>
                <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Premium Hotels</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gradient mb-1">50+</div>
                <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Indian Cities</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gradient mb-1">1M+</div>
                <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Happy Guests</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              Why Choose <span className="text-gradient">StayScape</span>
            </h2>
            <p className="text-xl max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Experience the best of Indian hospitality with our premium services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((feature, index) => {
              const Icon = getFeatureIcon(feature.icon);
              return (
                <div 
                  key={index} 
                  className="group p-8 rounded-2xl transition-all duration-500 border hover:-translate-y-1"
                  style={{ 
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border-color)'
                  }}
                >
                  <div 
                    className="inline-flex items-center justify-center h-16 w-16 rounded-2xl mb-6 transition-transform duration-300 group-hover:scale-110 border"
                    style={{ 
                      backgroundColor: 'rgba(34, 197, 94, 0.1)',
                      borderColor: 'rgba(34, 197, 94, 0.3)'
                    }}
                  >
                    <Icon className="h-8 w-8" style={{ color: 'var(--accent-400)' }} />
                  </div>
                  <h3 
                    className="text-xl font-bold mb-3 transition-colors"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {feature.title}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)' }}>
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Hotels Section */}
      <section className="py-24" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                Featured <span className="text-gradient">Properties</span>
              </h2>
              <p className="text-xl" style={{ color: 'var(--text-secondary)' }}>
                Handpicked luxury hotels across India
              </p>
            </div>
            <Link to="/hotels" className="mt-6 md:mt-0">
              <Button variant="secondary" rightIcon={<ArrowRight className="h-4 w-4" />}>
                View All Hotels
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
              <>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </>
            ) : (
              featuredHotels.map((hotel) => (
                <Card 
                  key={hotel.id} 
                  className="group h-full flex flex-col overflow-hidden"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={hotel.images[0]}
                      alt={hotel.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }} />
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
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center" style={{ color: 'white' }}>
                        <MapPin className="h-4 w-4 mr-1" style={{ color: 'var(--accent-400)' }} />
                        <span className="text-sm">{hotel.location.city}, {hotel.location.country}</span>
                      </div>
                    </div>
                  </div>
                  <CardHeader className="flex-grow">
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="text-xl">
                        {hotel.name}
                      </CardTitle>
                      <div 
                        className="flex items-center px-2 py-1 rounded-lg border"
                        style={{ 
                          backgroundColor: 'rgba(34, 197, 94, 0.1)',
                          borderColor: 'rgba(34, 197, 94, 0.3)'
                        }}
                      >
                        <Star className="h-4 w-4 mr-1" style={{ color: 'var(--accent-400)' }} fill="currentColor" />
                        <span className="font-bold" style={{ color: 'var(--accent-400)' }}>{hotel.rating}</span>
                      </div>
                    </div>
                    <CardDescription>
                      {hotel.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {hotel.amenities.slice(0, 3).map((amenity) => (
                        <span 
                          key={amenity} 
                          className="text-xs px-3 py-1 rounded-full border"
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
                    <div 
                      className="flex items-center justify-between pt-4"
                      style={{ borderTop: '1px solid var(--border-color)' }}
                    >
                      <div>
                        <span className="text-2xl font-bold text-gradient">
                          ₹{hotel.priceRange.min.toLocaleString('en-IN')}
                        </span>
                        <span className="text-sm ml-1" style={{ color: 'var(--text-muted)' }}>/night</span>
                      </div>
                      <Link to={`/hotels/${hotel.id}`}>
                        <Button size="sm">Book Now</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        className="py-24 relative overflow-hidden"
        style={{ backgroundColor: 'var(--bg-secondary)' }}
      >
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(34, 197, 94, 0.05)' }} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
            Ready for Your Next <span className="text-gradient">Indian Adventure</span>?
          </h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Join millions of travelers who have discovered the magic of India through StayScape. 
            Book your perfect stay today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/hotels">
              <Button size="lg" className="w-full sm:w-auto text-lg px-8">
                Explore Hotels
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto text-lg px-8">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};