import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss({
      theme: {
        extend: {
          colors: {
            "purple-650": "#6a0dad", // Define custom color
          },
        },
      },
    }),
  ],
  
  // --- ADD THIS SERVER CONFIGURATION ---
  server: {
    proxy: {
      // Any request starting with /api will be proxied
      '/api': {
        target: 'http://localhost:5000', // Your backend server
        changeOrigin: true, // Recommended for virtual hosts
      },
    },
  },
  // ------------------------------------
});