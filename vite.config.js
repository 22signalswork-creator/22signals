import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path";


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
    resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
     // Direct link to the source file to bypass the broken package.json
      'webgl-sdf-generator': path.resolve(__dirname, 'node_modules/webgl-sdf-generator/dist/webgl-sdf-generator.js')
    },
  },
 
  optimizeDeps: {
    // Remove webgl-sdf-generator from here if it was there, 
    // we want the alias to handle it instead
    exclude: ['webgl-sdf-generator'] 
  },
  build: {
    commonjsOptions: {
      include: ['webgl-sdf-generator', 'troika-three-text', 'three']
    }
  }
})
