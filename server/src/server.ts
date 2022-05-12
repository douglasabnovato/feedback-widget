import express from "express";

const app = express();

app.post("/users", (request, response) => {
    return response.send("Hello World, Dev.");
})

app.post("/feedbacks", (request, response) => {
    return response.send("Hello World, Dev!!");
})

app.listen(3333, () => {
    console.log("HTTP server running");
})
