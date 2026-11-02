import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    open: false,
    cors: true,
    watch: {
      ignored: [
        '**/public/**',
        '**/*.mp4',
        '**/*.mp3',
        '**/*.mpeg',
        '**/*.wav',
        '**/.git/**',
      ],
    },
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
