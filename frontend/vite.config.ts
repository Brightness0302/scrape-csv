import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import httpProxy from "http-proxy";

const { createProxy } = httpProxy;

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            "/api": {
                target: "http://localhost:5000",
                changeOrigin: true,
                secure: false,
                ws: true, // Add this line
            },
        },
    },
});
