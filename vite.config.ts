import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    VitePWA({ 
      registerType: 'prompt',
      injectRegister: 'auto',
      manifest: {
        name: 'Book Tracker',
        short_name: 'BT',
        description: 'A simple app to help track books',
        theme_color: '#528593',
        icons: [
          {
            src: '192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*, {js,css,html,ico,png,svg}']
      }
    })
  ],
})
