/* Fluxo da demo de ponta a ponta: a API real (repositório em memória, e-mail no console) e o build da demo.
   Portas próprias para não colidir com outros projetos na mesma máquina. */
import { defineConfig } from "@playwright/test";

const PORTA_API = 3391;
const PORTA_WEB = 4391;
export const URL_API = `http://127.0.0.1:${PORTA_API}`;
export const URL_WEB = `http://127.0.0.1:${PORTA_WEB}`;

export default defineConfig({
  testDir: "e2e-fluxo",
  timeout: 60_000,
  workers: 1,
  use: { baseURL: URL_WEB, reducedMotion: "reduce" },
  webServer: [
    {
      command: "npx tsx src/server.ts",
      cwd: "../server",
      url: `${URL_API}/health`,
      reuseExistingServer: false,
      timeout: 120_000,
      env: { PORT: String(PORTA_API), CORS_ORIGINS: URL_WEB, DATABASE_URL: "", MAIL_HOST: "" },
    },
    {
      command: `npx vite build --outDir dist-e2e && npx vite preview --outDir dist-e2e --host 127.0.0.1 --port ${PORTA_WEB} --strictPort`,
      url: URL_WEB,
      reuseExistingServer: false,
      timeout: 180_000,
      env: { VITE_API_URL: URL_API },
    },
  ],
});
/* Fim de playwright.fluxo.config.ts */
