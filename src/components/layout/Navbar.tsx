import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, Calendar, Hotel } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { getInitials } from '../../lib/utils';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsUserMenuOpen(false);
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Hotels', href: '/hotels' },
  ];

  return (
    <nav 
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{ 
        backgroundColor: scrolled ? 'var(--bg-secondary)' : 'transparent',
        borderBottom: scrolled ? '1px solid var(--border-color)' : 'none',
        backdropFilter: scrolled ? 'blur(10px)' : 'none'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div 
                className="p-2.5 rounded-xl transition-all duration-300 transform group-hover:scale-110"
                style={{ 
                  backgroundColor: 'var(--accent-600)',
                  boxShadow: '0 4px 14px rgba(34, 197, 94, 0.4)'
                }}
              >
                <Hotel className="h-7 w-7 text-white" />
              </div>
              <span 
                className="text-2xl font-bold transition-colors"
                style={{ color: 'var(--text-primary)' }}
              >
                StayScape
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="relative font-medium transition-all duration-300 group py-2"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-400)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
              >
                {link.name}
                <span 
                  className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
                  style={{ backgroundColor: 'var(--accent-500)' }}
                />
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-3 focus:outline-none group"
                >
                  <div 
                    className="h-11 w-11 rounded-full flex items-center justify-center transition-all duration-300"
                    style={{ 
                      backgroundColor: 'var(--accent-600)',
                      boxShadow: '0 4px 14px rgba(34, 197, 94, 0.4)'
                    }}
                  >
                    <span className="text-white font-bold text-sm">
                      {user ? getInitials(user.name) : 'U'}
                    </span>
                  </div>
                  <span 
                    className="font-medium transition-colors"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {user?.name}
                  </span>
                </button>

                {isUserMenuOpen && (
                  <div 
                    className="absolute right-0 mt-3 w-56 rounded-2xl shadow-2xl py-2 z-50 border"
                    style={{ 
                      backgroundColor: 'var(--bg-card)',
                      borderColor: 'var(--border-color)'
                    }}
                  >
                    <div 
                      className="px-4 py-3 border-b"
                      style={{ borderColor: 'var(--border-color)' }}
                    >
                      <p style={{ color: 'var(--text-muted)' }}>Signed in as</p>
                      <p className="font-medium truncate" style={{ color: 'var(--text-primary)' }}>{user?.email}</p>
                    </div>
                    <Link
                      to="/my-bookings"
                      className="flex items-center px-4 py-3 text-sm transition-colors"
                      style={{ color: 'var(--text-secondary)' }}
                      onClick={() => setIsUserMenuOpen(false)}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-400)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                    >
                      <Calendar className="h-4 w-4 mr-3" />
                      My Bookings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-3 text-sm transition-colors"
                      style={{ color: '#ef4444' }}
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <Button variant="ghost">Sign in</Button>
                </Link>
                <Link to="/register">
                  <Button>Get Started</Button>
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center md:hidden space-x-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="transition-colors"
              style={{ color: 'var(--text-secondary)' }}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div 
          className="md:hidden border-t"
          style={{ 
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)'
          }}
        >
          <div className="px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="block px-4 py-3 text-base font-medium rounded-xl transition-all"
                style={{ color: 'var(--text-secondary)' }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            
            {isAuthenticated ? (
              <div 
                className="border-t pt-4 space-y-2"
                style={{ borderColor: 'var(--border-color)' }}
              >
                <div className="flex items-center px-4 py-3">
                  <div 
                    className="h-10 w-10 rounded-full flex items-center justify-center mr-3"
                    style={{ backgroundColor: 'var(--accent-600)' }}
                  >
                    <span className="text-white font-bold text-sm">
                      {user ? getInitials(user.name) : 'U'}
                    </span>
                  </div>
                  <div>
                    <p style={{ color: 'var(--text-primary)' }}>{user?.name}</p>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{user?.email}</p>
                  </div>
                </div>
                <Link
                  to="/my-bookings"
                  className="flex items-center px-4 py-3 text-base font-medium rounded-xl transition-all"
                  style={{ color: 'var(--text-secondary)' }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Calendar className="h-5 w-5 mr-3" />
                  My Bookings
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-3 text-base font-medium rounded-xl transition-all"
                  style={{ color: '#ef4444' }}
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Sign out
                </button>
              </div>
            ) : (
              <div 
                className="border-t pt-4 space-y-3"
                style={{ borderColor: 'var(--border-color)' }}
              >
                <Link
                  to="/login"
                  className="block w-full"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button variant="ghost" className="w-full">Sign in</Button>
                </Link>
                <Link
                  to="/register"
                  className="block w-full"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button className="w-full">Get Started</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};