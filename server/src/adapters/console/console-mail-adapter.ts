/* Adaptador de e-mail para desenvolvimento: registra no console quando não há SMTP configurado */
import { MailAdapter, SendMailData } from "../mail-adapter";

export class ConsoleMailAdapter implements MailAdapter {
  /* Mostra só o assunto (o corpo pode conter a captura de tela) */
  async sendMail({ subject }: SendMailData) {
    console.info(`[mail] SMTP não configurado; e-mail "${subject}" não enviado.`);
  }
}
/* Fim de console-mail-adapter.ts */
