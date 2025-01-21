import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import type { ResolverObject } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      strict: true
    }
  },
  resolve: {
    dedupe: ['three', '@react-three/fiber', '@react-three/drei'],
  },
  optimizeDeps: {
    include: ['three', '@react-three/fiber', '@react-three/drei'],
    exclude: ['@google/*'],
    esbuildOptions: {
      target: 'esnext'
    }
  },
  build: {
    target: 'esnext',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom'],
          'three-core': ['three'],
          'three-extras': ['@react-three/fiber', '@react-three/drei']
        }
      }
    },
    commonjsOptions: {
      include: [],
      extensions: ['.js', '.cjs']
    }
  }
});
