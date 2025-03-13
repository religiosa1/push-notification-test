import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    minify: false,
    terserOptions: {
      compress: false,
      mangle: false,
    },
    // Setting up a separate entrypoint for the service-worker and ensuring
    // a static output name for it (so it can be registered)
    rollupOptions: {
      input: {
        main: "index.html",
        sw: "sw.ts",
      },
      output: {
        entryFileNames: (chunk) => {
          return chunk.name === "sw" ? "sw.js" : "[name].[hash].js";
        },
      },
    },
  },
  plugins: [react()],
});
