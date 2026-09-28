/* Build do widget com Vite e testes com Vitest (jsdom) */
/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: { environment: "jsdom" },
});
/* Fim de vite.config.ts */
