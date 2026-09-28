/* Contrato do envio de e-mail (permite trocar Nodemailer por outro provedor ou por um dublê nos testes) */
export interface SendMailData {
  subject: string;
  body: string;
}

export interface MailAdapter {
  sendMail: (data: SendMailData) => Promise<void>;
}
/* Fim de mail-adapter.ts */
