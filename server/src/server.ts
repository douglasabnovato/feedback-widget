import express from "express";
import { prisma } from "./prisma";

const app = express();

app.use(express.json());

app.post("/feedbacks", (request, response) => {
    prisma.feedback.create({
        data: {
            type: request.body.type,
            comment: request.body.comment,
            screenshot: request.body.screenshot,
        }
    })

    return response.send("Hello World, Dev!!");
})

app.listen(3333, () => {
    console.log("HTTP server running");
})
