import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    // Add base and build configuration for Vercel deployment
    base: "./",
    build: {
        outDir: "dist",
        assetsDir: "assets",
        sourcemap: false, // Set to true for debugging production builds
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom', 'react-router-dom']
                }
            }
        }
    }
});
