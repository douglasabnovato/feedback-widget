/* Caso de uso: validar, gravar e notificar por e-mail um feedback */
import { z } from "zod";
import { MailAdapter } from "../adapters/mail-adapter";
import { FeedbacksRepository } from "../repositories/feedbacks-repository";
import { AppError } from "../lib/app-error";
import { escapeHtml } from "../lib/html";

const PNG_PREFIX = "data:image/png;base64,";

export interface SubmitFeedbackUseCaseRequest {
  type: string;
  comment: string;
  screenshot?: string | null;
}

const LABELS = { BUG: "Problema", IDEA: "Ideia", OTHER: "Outro" } as const;

export class SubmitFeedbackUseCase {
  /* Recebe repositório, e-mail e o limite de tamanho da captura */
  constructor(
    private feedbacksRepository: FeedbacksRepository,
    private mailAdapter: MailAdapter,
    private maxScreenshotBytes = 4 * 1024 * 1024,
  ) {}

  /* Executa o fluxo; falha de e-mail não descarta o feedback já gravado */
  async execute(request: SubmitFeedbackUseCaseRequest) {
    const schema = z.object({
      type: z.enum(["BUG", "IDEA", "OTHER"], { message: "Tipo de feedback inválido." }),
      comment: z.string().trim().min(1, "Escreva o comentário.").max(1000, "Use até 1000 caracteres."),
      screenshot: z
        .string()
        .nullish()
        .refine((s) => !s || /^data:image\/png;base64,[A-Za-z0-9+/=]+$/.test(s), "Formato de captura de tela inválido.")
        .refine((s) => !s || Math.floor(((s.length - PNG_PREFIX.length) * 3) / 4) <= this.maxScreenshotBytes, "Captura de tela grande demais."),
    });
    const parsed = schema.safeParse(request);
    if (!parsed.success) {
      throw new AppError(400, parsed.error.issues[0].message, parsed.error.issues.map((i) => i.message));
    }
    const { type, comment, screenshot } = parsed.data;

    const { id } = await this.feedbacksRepository.create({ type, comment, screenshot: screenshot || null });

    try {
      await this.mailAdapter.sendMail({
        subject: `Novo feedback: ${LABELS[type]}`,
        body: [
          `<div style="font-family: sans-serif; font-size: 16px; color: #111;">`,
          `<p>Tipo do feedback: ${LABELS[type]}</p>`,
          `<p>Comentário: ${escapeHtml(comment)}</p>`,
          screenshot ? `<img src="${screenshot}" alt="Captura de tela enviada" style="max-width: 100%;"/>` : ``,
          `</div>`,
        ].join("\n"),
      });
    } catch (err) {
      console.error(`[mail] falha ao notificar feedback ${id}:`, (err as Error).message);
    }
    return { id };
  }
}
/* Fim de submit-feedback-use-case.ts */
