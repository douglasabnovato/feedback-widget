/* Envio de e-mail via SMTP (Mailtrap, Gmail etc.) com credenciais vindas do ambiente */
import nodemailer, { Transporter } from "nodemailer";
import { MailAdapter, SendMailData } from "../mail-adapter";
import { AppConfig } from "../../config";

export class NodemailerMailAdapter implements MailAdapter {
  private transport: Transporter;

  /* Cria o transporte SMTP a partir da configuração */
  constructor(private readonly config: AppConfig["mail"]) {
    this.transport = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      auth: { user: config.user, pass: config.pass },
    });
  }

  /* Envia a mensagem para o destinatário configurado */
  async sendMail({ subject, body }: SendMailData) {
    await this.transport.sendMail({ from: this.config.from, to: this.config.to, subject, html: body });
  }
}
/* Fim de nodemailer-mail-adapter.ts */
