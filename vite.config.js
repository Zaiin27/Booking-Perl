import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/",
  server: {
    host: "0.0.0.0",
    port: 5181,
    allowedHosts: ["meb.senew-tech.com", "localhost"], 
    proxy: {
      "/api": {
        target: "http://localhost:8001",
        changeOrigin: true,
        secure: false,
        timeout: 10000,
        proxyTimeout: 10000,
        configure: (proxy, _options) => {
          proxy.on("error", (err, _req, _res) => {
            console.log("proxy error", err);
          });
          proxy.on("proxyReq", (proxyReq, req, _res) => {
            console.log("Sending Request to the Target:", req.method, req.url);
            console.log("Request headers:", proxyReq.getHeaders());
          });
          proxy.on("proxyRes", (proxyRes, req, _res) => {
            console.log(
              "Received Response from the Target:",
              proxyRes.statusCode,
              req.url
            );
            console.log("Response headers:", proxyRes.headers);
          });
        },
      },
    },
  },
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          router: ["react-router-dom"],
          charts: ["chart.js", "react-chartjs-2"],
        },
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]",
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    include: ["chart.js", "react", "react-dom", "react-router-dom"],
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
