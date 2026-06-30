import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('katex')) return 'katex'
          if (id.includes('app.js')) return 'app'
          if (id.includes('store.js')) return 'store'
          if (id.includes('/modules/')) return 'modules'
          if (id.includes('/data/')) return 'data'
          if (id.includes('utils.js') || id.includes('ebbinghaus.js')) return 'utils'
        }
      }
    }
  },
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'UniExamWeb',
        short_name: 'UniExam',
        description: '四学科考研冲刺复习平台',
        theme_color: '#6366f1',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait-primary',
        icons: [
          {
            src: 'assets/icons/app-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'assets/icons/app-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ],
        start_url: '/',
        scope: '/'
      },
      workbox: {
        globPatterns: ['**/*.{html,js,css,json,png,jpg,jpeg,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts'
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-static'
            }
          }
        ]
      }
    })
  ],
  server: {
    port: 5173,
    open: true
  }
})