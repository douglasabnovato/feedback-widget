import express from "express";
import nodemailer from "nodemailer";
import { prisma } from "./prisma";

export const routes = express.Router()

const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "6ce2083be599f7",
        pass: "a2f66446be125d"
    }
});

routes.post("/feedbacks", async (request, response) => {

    const { type, comment, screenshot } = request.body;

    const feedback = await prisma.feedback.create({
        data: {
            type,
            comment,
            screenshot,
        }
    })

    await transport.sendMail({
        from: "Equipe Feedget <oi@feedget.com>",
        to: "Douglas A B Novato <douglasabnovato@gmail.com>",
        subject: "Novo Feedback",
        html: [
            `<div style="font-family: sans-serif; font-size: 16px; color:#111;">`,
            `<p>Tipo do Feedback: ${type}</p>`,
            `<p>Comentário: ${comment}</p>`,
            `</div>`
        ].join("\n")
    })

    return response.status(201).json({ data: feedback });
})