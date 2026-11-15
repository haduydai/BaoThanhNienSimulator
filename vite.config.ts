import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api-tn-rss': {
        target: 'https://thanhnien.vn',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-tn-rss/, ''),
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
        }
      }
    }
  }
})
