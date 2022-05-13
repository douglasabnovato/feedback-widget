import { MailAdapter, SendMailData } from "../mail-adapter";
import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "6ce2083be599f7",
        pass: "a2f66446be125d"
    }
});

export class NodemailerMailAdapter implements MailAdapter {

    async sendMail({subject, body}: SendMailData) {
        await transport.sendMail({
            from: "Equipe Feedget <oi@feedget.com>",
            to: "Douglas A B Novato <douglasabnovato@gmail.com>",
            subject,
            html: body,
        })
    }
}