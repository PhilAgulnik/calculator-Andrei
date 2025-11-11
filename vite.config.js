import { defineConfig } from 'vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import checker from 'vite-plugin-checker'
import react from '@vitejs/plugin-react'
import tsConfigPaths from 'vite-tsconfig-paths'
import path from 'path'
import { fileURLToPath } from 'url'

import { APP_BASE_PATH } from './constants.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  server: {
    port: 3000,
  },
  base: APP_BASE_PATH,
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './src'),
    },
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
