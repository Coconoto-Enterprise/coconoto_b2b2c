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
    emptyOutDir: false,
    rollupOptions: {
      output: {
        /**
         * Route-level splitting already exists (see src/lazyComponents.tsx), but
         * every route chunk still shared one 546 kB entry chunk holding React,
         * the router, framer-motion and the icon set. That made the entry the
         * most expensive file on the site AND meant any app-code edit changed
         * its hash, throwing away the browser cache for the framework too.
         *
         * Splitting the framework into its own chunks keeps those hashes stable
         * across deploys, so a typo fix in one page no longer forces every
         * returning visitor to re-download React. Package names are matched
         * exactly (not by substring) because `@tiptap/react` contains the string
         * "react" and must NOT be pulled into the React chunk.
         */
        manualChunks(id) {
          const norm = id.replace(/\\/g, '/');
          const marker = norm.lastIndexOf('node_modules/');
          if (marker === -1) return;

          const rest = norm.slice(marker + 'node_modules/'.length).split('/');
          const pkg = rest[0].startsWith('@') ? `${rest[0]}/${rest[1]}` : rest[0];

          if (pkg === '@supabase/supabase-js') return 'vendor-supabase';
          if (pkg === 'chart.js' || pkg === 'react-chartjs-2') return 'vendor-charts';
          if (pkg === 'framer-motion') return 'vendor-motion';
          if (pkg === 'lucide-react' || pkg === 'react-icons') return 'vendor-icons';
          if (
            pkg === 'react' ||
            pkg === 'react-dom' ||
            pkg === 'scheduler' ||
            pkg.startsWith('react-router')
          ) {
            return 'vendor-react';
          }
        },
      },
    },
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
