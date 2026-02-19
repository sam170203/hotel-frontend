import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Star, ArrowRight, Hotel as HotelIcon, Shield, Clock, Tag } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { SkeletonCard } from '../components/ui/LoadingSpinner';
import { useSearch } from '../contexts/SearchContext';
import { hotelsApi } from '../services/hotels';
import type { Hotel } from '../types';

const FEATURES = [
  {
    icon: Shield,
    title: '100% Secure Booking',
    description: 'Your data is protected with military-grade encryption. Book with complete confidence.',
  },
  {
    icon: Clock,
    title: '24/7 Concierge',
    description: 'Our dedicated team is always available to assist you, anytime, anywhere in India.',
  },
  {
    icon: Tag,
    title: 'Best Price Guarantee',
    description: 'Find a lower price? We will match it and give you an additional 10% off.',
  },
  {
    icon: HotelIcon,
    title: 'Handpicked Hotels',
    description: 'Every property is personally verified by our team for quality and authenticity.',
  },
  {
    icon: Star,
    title: 'Premium Experiences',
    description: 'Access exclusive experiences and VIP treatment at partner hotels.',
  },
  {
    icon: MapPin,
    title: 'Pan India Coverage',
    description: 'From Kashmir to Kanyakumari, discover stays in every corner of India.',
  },
];

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { filters, updateFilters } = useSearch();
  const [isLoading, setIsLoading] = useState(true);
  const [featuredHotels, setFeaturedHotels] = useState<Hotel[]>([]);
  const [animationStarted, setAnimationStarted] = useState(false);

  useEffect(() => {
    setAnimationStarted(true);
    
    const fetchFeaturedHotels = async () => {
      try {
        setIsLoading(true);
        const response = await hotelsApi.getAll({ limit: 6 });
        const hotels = response?.data || [];
        setFeaturedHotels(Array.isArray(hotels) ? hotels.slice(0, 6) : []);
      } catch (error) {
        console.error('Failed to fetch featured hotels:', error);
        setFeaturedHotels([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedHotels();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/hotels');
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
      <section 
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: 'var(--bg-primary)' }}
      >
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
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-400" />
                    <input
                      type="text"
                      placeholder="Where to?"
                      className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                      value={filters.location || ''}
                      onChange={(e) => updateFilters({ location: e.target.value })}
                    />
                  </div>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-400" />
                    <input
                      type="date"
                      min={today}
                      className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                      value={filters.checkIn || ''}
                      onChange={(e) => updateFilters({ checkIn: e.target.value })}
                    />
                  </div>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-400" />
                    <input
                      type="date"
                      min={filters.checkIn || today}
                      className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
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

            <div className={`grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto transition-all duration-1000 delay-500 ${animationStarted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-emerald-400 mb-1">500+</div>
                <div className="text-sm text-gray-500">Premium Hotels</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-emerald-400 mb-1">50+</div>
                <div className="text-sm text-gray-500">Indian Cities</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-emerald-400 mb-1">1M+</div>
                <div className="text-sm text-gray-500">Happy Guests</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Why Choose <span className="text-emerald-400">StayScape</span>
            </h2>
            <p className="text-xl max-w-2xl mx-auto text-gray-400">
              Experience the best of Indian hospitality with our premium services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index} 
                  className="group p-8 rounded-2xl transition-all duration-500 border border-gray-700 bg-gray-800/50 hover:-translate-y-1"
                >
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl mb-6 transition-transform duration-300 group-hover:scale-110 bg-emerald-900/30 border border-emerald-700/50">
                    <Icon className="h-8 w-8 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                Featured <span className="text-emerald-400">Properties</span>
              </h2>
              <p className="text-xl text-gray-400">
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
            ) : featuredHotels.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-400">No featured hotels available at the moment.</p>
              </div>
            ) : (
              featuredHotels.map((hotel) => (
                <Card 
                  key={hotel.id} 
                  className="group h-full flex flex-col overflow-hidden border border-gray-700 bg-gray-800/50"
                  hover={false}
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={hotel.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'}
                      alt={hotel.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
                    <div className="absolute top-4 left-4">
                      <Badge 
                        size="md"
                        variant="success"
                      >
                        {hotel.starRating} Star
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center text-white">
                        <MapPin className="h-4 w-4 mr-1 text-emerald-400" />
                        <span className="text-sm">{hotel.location?.city || 'Unknown'}, {hotel.location?.country || 'India'}</span>
                      </div>
                    </div>
                  </div>
                  <CardHeader className="flex-grow">
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="text-xl text-white">
                        {hotel.name}
                      </CardTitle>
                      <div className="flex items-center px-2 py-1 rounded-lg bg-emerald-900/30 border border-emerald-700/50">
                        <Star className="h-4 w-4 mr-1 text-yellow-400" fill="currentColor" />
                        <span className="font-bold text-emerald-300">{hotel.rating || 'N/A'}</span>
                      </div>
                    </div>
                    <CardDescription className="text-gray-400">
                      {hotel.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {hotel.amenities && hotel.amenities.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {hotel.amenities.slice(0, 3).map((amenity: string) => (
                          <span 
                            key={amenity} 
                            className="text-xs px-3 py-1 rounded-full bg-gray-700 text-gray-300"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                      <div>
                        <span className="text-2xl font-bold text-emerald-400">
                          ₹{(hotel.priceRange?.min || 0).toLocaleString('en-IN')}
                        </span>
                        <span className="text-sm ml-1 text-gray-500">/night</span>
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

      <section className="py-24 relative overflow-hidden bg-gray-800/30">
        <div className="absolute inset-0 bg-emerald-900/5" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Ready for Your Next <span className="text-emerald-400">Indian Adventure</span>?
          </h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto text-gray-400">
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
