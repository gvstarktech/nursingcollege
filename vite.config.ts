import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    emptyOutDir: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router') || id.includes('react-helmet')) {
              return 'vendor-react';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            if (id.includes('@supabase')) {
              return 'vendor-supabase';
            }
            return 'vendor';
          }
        }
      }
    }
  },
  server: {
    watch: {
      usePolling: false,
    },
    proxy: {
      '/api': {
        target: 'https://mahalakshmicollegeofalliedhealthscience.com',
        changeOrigin: true,
      }
    }
  }
});
