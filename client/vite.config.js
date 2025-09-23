import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
<<<<<<< HEAD
    port: 3000,
=======
    port: 5173,
>>>>>>> 813ac5d80d63e82081cce6d7cd26398bfed8c8c4
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
