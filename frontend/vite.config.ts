import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const apiBaseUrl = process.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  define: {
    'import.meta.env.VITE_API_BASE_URL': JSON.stringify(apiBaseUrl),
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}'],
  },
})
