import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      }
    }
  },
  define: {
    __API_URL__: JSON.stringify(process.env.NODE_ENV === 'production'
      ? process.env.VITE_API_URL || 'https://your-backend-url.railway.app/api'
      : 'http://localhost:5000/api')
  }
})
