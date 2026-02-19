import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SearchProvider } from './contexts/SearchContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Layout } from './components/layout/Layout';
import { Home, Hotels, HotelDetail, Booking, Login, Register, MyBookings } from './pages';
import { OwnerDashboard, AddHotel, AddRoom } from './pages/Owner';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

const ProtectedRoute: React.FC<{ children: React.ReactNode; requireOwner?: boolean }> = ({ 
  children, 
  requireOwner = false 
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireOwner && user?.role !== 'owner') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <SearchProvider>
            <Router>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/signup" element={<Register />} />

                <Route
                  path="/"
                  element={
                    <Layout>
                      <Home />
                    </Layout>
                  }
                />
                <Route
                  path="/hotels"
                  element={
                    <Layout>
                      <Hotels />
                    </Layout>
                  }
                />
                <Route
                  path="/hotels/:id"
                  element={
                    <Layout>
                      <HotelDetail />
                    </Layout>
                  }
                />
                <Route
                  path="/booking/:hotelId/:roomId"
                  element={
                    <Layout>
                      <Booking />
                    </Layout>
                  }
                />
                <Route
                  path="/my-bookings"
                  element={
                    <Layout>
                      <ProtectedRoute>
                        <MyBookings />
                      </ProtectedRoute>
                    </Layout>
                  }
                />

                <Route
                  path="/owner"
                  element={
                    <Layout>
                      <ProtectedRoute requireOwner>
                        <OwnerDashboard />
                      </ProtectedRoute>
                    </Layout>
                  }
                />
                <Route
                  path="/owner/add-hotel"
                  element={
                    <Layout>
                      <ProtectedRoute requireOwner>
                        <AddHotel />
                      </ProtectedRoute>
                    </Layout>
                  }
                />
                <Route
                  path="/owner/add-room/:hotelId"
                  element={
                    <Layout>
                      <ProtectedRoute requireOwner>
                        <AddRoom />
                      </ProtectedRoute>
                    </Layout>
                  }
                />

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Router>
          </SearchProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
