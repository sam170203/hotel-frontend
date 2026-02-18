# StayScape - Hotel Booking Frontend

A modern, production-ready hotel booking platform built with React, TypeScript, and Tailwind CSS.

## Features

- **Beautiful UI/UX**: Modern, responsive design with smooth animations
- **Hotel Search**: Search hotels by location, dates, and guests
- **Hotel Details**: Detailed hotel information with amenities and room selection
- **Booking System**: Complete booking flow with confirmation
- **User Authentication**: Login and registration system
- **My Bookings**: View and manage all your reservations
- **Responsive Design**: Fully responsive for mobile, tablet, and desktop
- **Loading States**: Smooth loading animations and skeleton screens
- **Error Handling**: Comprehensive error handling with user-friendly messages

## Tech Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router v6** - Client-side routing
- **TanStack Query** - Server state management
- **Axios** - HTTP client for API requests
- **Lucide React** - Beautiful icons
- **date-fns** - Date formatting utilities

## Project Structure

```
src/
├── components/
│   ├── layout/          # Layout components (Navbar, Footer, Layout)
│   └── ui/              # Reusable UI components (Button, Card, Input, etc.)
├── contexts/            # React contexts (Auth, Search)
├── pages/               # Page components
├── services/            # API services
├── types/               # TypeScript types
├── lib/                 # Utility functions
└── App.tsx              # Main App component
```

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your backend API URL:
   ```
   VITE_API_URL=https://hotel-booking-backend-8a37.onrender.com/api
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open http://localhost:3000 in your browser

### Building for Production

```bash
npm run build
```

The build output will be in the `dist` directory.

## API Integration

The frontend expects a REST API with the following endpoints:

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `PUT /auth/profile` - Update user profile

### Hotels
- `GET /hotels` - List all hotels (with pagination)
- `GET /hotels/:id` - Get hotel details
- `GET /hotels/featured` - Get featured hotels
- `POST /hotels/search` - Search hotels
- `GET /hotels/:id/rooms` - Get hotel rooms
- `POST /hotels/:id/availability` - Check room availability

### Bookings
- `GET /bookings/my-bookings` - Get user's bookings
- `GET /bookings/:id` - Get booking details
- `POST /bookings` - Create new booking
- `PUT /bookings/:id/cancel` - Cancel booking

### Response Format

All API responses should follow this format:

```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

## Customization

### Colors
The primary color scheme can be customized in `tailwind.config.js`:

```javascript
colors: {
  primary: {
    50: '#eff6ff',
    // ... other shades
    600: '#2563eb',
    // ... other shades
  },
}
```

### API URL
Update the `VITE_API_URL` environment variable to point to your backend.

## Deployment

### Vercel
1. Push code to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy

### Netlify
1. Push code to GitHub
2. Connect repository in Netlify
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Add environment variables
6. Deploy

## License

MIT