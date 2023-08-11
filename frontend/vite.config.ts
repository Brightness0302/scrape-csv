import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import httpProxy from "http-proxy";

const { createProxy } = httpProxy;

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        host: "0.0.0.0",
        port: 3000, 
        proxy: {
            "/api": {
                target: "http://192.168.145.62:5000",
                changeOrigin: true,
                secure: false,
                ws: true, // Add this line
            },
        },
    },
});
