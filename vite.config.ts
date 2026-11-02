import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: false,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          phaser: ['phaser'],
          vendor: ['react', 'react-dom', 'gsap', 'canvas-confetti', 'lucide-react'],
        },
      },
    },
    chunkSizeWarningLimit: 2000,
  },
});
