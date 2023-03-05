import { defineConfig } from 'vite'
import { VitePluginFonts } from 'vite-plugin-fonts'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePluginFonts({
      google: {
        families: ['Pacifico', 'Nunito'],
      },
    })
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./src/assets/scss/vars/index.scss";`,
      },
    },
  },
})
