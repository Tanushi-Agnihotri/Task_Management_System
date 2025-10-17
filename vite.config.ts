import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// ✅ Vite configuration for React + Spring Boot backend
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // ✅ @ → src/
    },
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      // ✅ Proxy API requests to Spring Boot backend (localhost:8080)
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
});
