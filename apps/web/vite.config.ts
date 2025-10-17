import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      // Proxy all /api requests to the Hono backend
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          // Log proxy requests for debugging
          proxy.on("proxyReq", (proxyReq, req, res) => {
            console.log(
              `🔄 Proxying ${req.method} ${req.url} → ${options.target}${req.url}`
            );
          });
          proxy.on("error", (err, req, res) => {
            console.log("❌ Proxy error:", err.message);
          });
        },
      },
    },
  },
});
