/* Configuração lida do ambiente (12-Factor III) */
export interface AppConfig {
  port: number;
  corsOrigins: string[];
  maxScreenshotBytes: number;
  mail: { host?: string; port: number; user?: string; pass?: string; from: string; to?: string };
}

/* Monta a configuração a partir de process.env (ou de um objeto nos testes) */
export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  return {
    port: Number(env.PORT) || 3333,
    corsOrigins: (env.CORS_ORIGINS || "http://localhost:5173").split(",").map((s) => s.trim()).filter(Boolean),
    maxScreenshotBytes: Number(env.MAX_SCREENSHOT_MB || 4) * 1024 * 1024,
    mail: {
      host: env.MAIL_HOST,
      port: Number(env.MAIL_PORT) || 2525,
      user: env.MAIL_USER,
      pass: env.MAIL_PASS,
      from: env.MAIL_FROM || "Equipe Feedget <oi@feedget.com>",
      to: env.MAIL_TO,
    },
  };
}
/* Fim de config.ts */
