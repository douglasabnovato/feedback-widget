/* Build do widget como script único (IIFE), com JavaScript e CSS no mesmo arquivo */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  define: { "process.env.NODE_ENV": JSON.stringify("production") },
  build: {
    outDir: "dist-widget",
    emptyOutDir: true,
    lib: { entry: "src/embed.tsx", name: "Feedget", formats: ["iife"], fileName: () => "feedget.js" },
  },
});
/* Fim de vite.widget.config.ts */
