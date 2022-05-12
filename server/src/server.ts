import express from "express";

const app = express();

app.get("/users", (request, response) => {
    return response.send("Hello World, Dev.");
})

app.listen(3333, () => {
    console.log("HTTP server running");
})
