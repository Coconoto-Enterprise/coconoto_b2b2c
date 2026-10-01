import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react()],
  base: '/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    outDir: 'dist',
    // Vite normally wipes outDir before writing. In this environment a bulk
    // delete of >50 files is blocked by the tooling guard, which aborts the
    // build. Filenames are content-hashed, so leaving old chunks behind is
    // harmless — index.html always points at the fresh ones.
    emptyOutDir: false
  },
  server: {
    host: true,
    allowedHosts: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false
      }
    }
  },
  preview: {
    host: true,
    allowedHosts: true
  }
})
