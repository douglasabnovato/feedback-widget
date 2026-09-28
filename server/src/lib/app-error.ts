/* Erro de aplicação com status HTTP e mensagem exibível */
export class AppError extends Error {
  /* Cria o erro com status e detalhes opcionais */
  constructor(public readonly status: number, message: string, public readonly details?: unknown) {
    super(message);
  }
}
/* Fim de app-error.ts */
