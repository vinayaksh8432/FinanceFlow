import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
            "@components": path.resolve(__dirname, "./src/components"),
            "@loan": path.resolve(__dirname, "./src/components/Loan"),
            "@loanComponents": path.resolve(
                __dirname,
                "./src/components/Loan/components"
            ),
        },
        extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
    },
    base: "./",
    build: {
        outDir: "dist",
        assetsDir: "assets",
        sourcemap: false, // Set to true for debugging production builds
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ["react", "react-dom", "react-router-dom"],
                },
            },
        },
    },
});
