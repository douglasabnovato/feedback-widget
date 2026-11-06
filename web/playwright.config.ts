/* Testa o script único em uma página HTML simples, sem servidor nem serviço externo */
import { defineConfig } from "@playwright/test";

export default defineConfig({ testDir: "e2e", timeout: 30_000 });
/* Fim de playwright.config.ts */
