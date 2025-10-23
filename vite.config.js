import { defineConfig } from 'vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import checker from 'vite-plugin-checker'
import react from '@vitejs/plugin-react'
import tsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    checker({
      typescript: true,
    }),
    tsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tanstackRouter({ target: 'react', autoCodeSplitting: true }),
    react(),
  ],
})
