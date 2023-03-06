import { defineConfig } from 'vite'
import { VitePluginFonts } from 'vite-plugin-fonts'
import { VitePWA } from 'vite-plugin-pwa'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePluginFonts({
      google: {
        families: ['Pacifico', 'Nunito'],
      },
    },
    ),
    VitePWA({ registerType: 'autoUpdate' })
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./src/assets/scss/vars/index.scss";`,
      },
    },
  },
})
