import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2022',
    assetsInlineLimit: 2048,
    chunkSizeWarningLimit: 900,
    // Vite emits <link rel=modulepreload> for every dynamic-import chunk, which
    // downloads three.js during the hero paint and defeats the lazy split.
    modulePreload: { polyfill: false, resolveDependencies: () => [] },
  },
})
