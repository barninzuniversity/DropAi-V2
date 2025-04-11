import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    server: {
      port: 3002,
      open: true
    },
    build: {
      outDir: 'dist',
      minify: 'terser',
      sourcemap: false,
      // Optimize chunks for production
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            ui: ['framer-motion', 'gsap', 'swiper'],
            utils: ['zustand', 'axios']
          }
        }
      },
      // Reduce chunk size warnings threshold
      chunkSizeWarningLimit: 1000
    },
    // Define environment variables to be replaced in the client code
    define: {
      // Ensure EmailJS environment variables are properly handled
      __EMAILJS_CONFIGURED__: 
        env.VITE_EMAILJS_SERVICE_ID !== 'service_id' && 
        env.VITE_EMAILJS_USER_ID !== 'user_id'
    }
  }
})