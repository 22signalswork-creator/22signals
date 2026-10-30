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
    exclude: ['webgl-sdf-generator'] ,
    include: ['react', 'react-dom', 'react-router'],
  },
  build: {
    // Long-lived vendor chunks: they change rarely, so browsers keep them
    // cached across deploys while page code updates.
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (/[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/.test(id)) return "react";
          if (id.includes("framer-motion") || id.includes("motion-dom") || id.includes("motion-utils")) return "motion";
          if (id.includes("@supabase")) return "supabase";
          if (id.includes("gsap")) return "gsap";
          if (id.includes("react-slick") || id.includes("slick-carousel")) return "slick";
          if (id.includes("@react-spring")) return "spring";
        },
      },
    },
    commonjsOptions: {
       transformMixedEsModules: true,
      include: ['webgl-sdf-generator', 'troika-three-text', 'three', /node_modules/ ]
    }
  }

  
})
