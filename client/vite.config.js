import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://khalsa-multistore-backend.onrender.com',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'https://khalsa-multistore-backend.onrender.com',
        changeOrigin: true,
      },
    },
  },
});
