import { defineConfig } from 'vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import checker from 'vite-plugin-checker'
import react from '@vitejs/plugin-react'
import tsConfigPaths from 'vite-tsconfig-paths'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig(({ command }) => ({
  server: {
    port: 3000,
  },
  base: command === 'serve' ? '/' : '/benefits-calculator/',
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
}))
