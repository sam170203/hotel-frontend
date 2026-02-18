import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/hotel-frontend/',
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/api': {
        target: 'https://hotel-booking-backend-8a37.onrender.com',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@tanstack/react-query', 'lucide-react', 'date-fns'],
        },
      },
    },
  },
})