/* API Express 5 do Feedget: recebe feedbacks do widget com validação, limites e CORS restrito */
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { AppConfig } from "./config";
import { AppError } from "./lib/app-error";
import { MailAdapter } from "./adapters/mail-adapter";
import { FeedbacksRepository } from "./repositories/feedbacks-repository";
import { SubmitFeedbackUseCase } from "./use-cases/submit-feedback-use-case";

interface Deps {
  feedbacks: FeedbacksRepository;
  mail: MailAdapter;
  config: AppConfig;
}

/* Monta a aplicação com dependências injetadas */
export function createApp({ feedbacks, mail, config }: Deps) {
  const app = express();
  app.disable("x-powered-by");
  app.set("trust proxy", 1);
  app.use(helmet());
  app.use(cors({ origin: config.corsOrigins }));
  app.use(express.json({ limit: Math.ceil(config.maxScreenshotBytes * 1.4) }));

  const limiter = rateLimit({ windowMs: 60_000, limit: 5, standardHeaders: "draft-7", legacyHeaders: false, message: { error: "Muitos envios. Tente de novo em 1 minuto." } });
  const submit = new SubmitFeedbackUseCase(feedbacks, mail, config.maxScreenshotBytes);

  app.get("/health", async (_req, res) => {
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    res.json({ status: "ok", feedbacksLast7Days: await feedbacks.countSince(since) });
  });

  app.post("/feedbacks", limiter, async (req, res) => {
    const { id } = await submit.execute(req.body ?? {});
    res.status(201).json({ id });
  });

  app.use((_req, res) => {
    res.status(404).json({ error: "Rota não encontrada." });
  });

  app.use((err: Error & { type?: string; status?: number }, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof AppError) return res.status(err.status).json({ error: err.message, details: err.details });
    if (err.type === "entity.too.large") return res.status(413).json({ error: "Captura de tela grande demais." });
    if (err.type === "entity.parse.failed") return res.status(400).json({ error: "JSON inválido." });
    console.error(err);
    return res.status(500).json({ error: "Não foi possível enviar agora. Tente novamente." });
  });

  return app;
}
/* Fim de app.ts */
