import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' — относительные пути, чтобы демо открывалось и на GitHub Pages,
// и в любой подпапке на сервере
export default defineConfig({
  plugins: [react()],
  base: './',
})
