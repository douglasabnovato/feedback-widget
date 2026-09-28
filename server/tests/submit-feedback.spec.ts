/* Testes do caso de uso e da rota HTTP de feedback */
import request from "supertest";
import { SubmitFeedbackUseCase } from "../src/use-cases/submit-feedback-use-case";
import { InMemoryFeedbacksRepository } from "../src/repositories/in-memory/in-memory-feedbacks-repository";
import { createApp } from "../src/app";
import { loadConfig } from "../src/config";
import { escapeHtml } from "../src/lib/html";

const png = "data:image/png;base64,iVBORw0KGgo=";

/* Cria dublês e caso de uso */
function setup(maxBytes?: number) {
  const repo = new InMemoryFeedbacksRepository();
  const sendMail = jest.fn().mockResolvedValue(undefined);
  const useCase = new SubmitFeedbackUseCase(repo, { sendMail }, maxBytes);
  return { repo, sendMail, useCase };
}

describe("SubmitFeedbackUseCase", () => {
  it("grava e envia e-mail para feedback válido", async () => {
    const { repo, sendMail, useCase } = setup();
    await expect(useCase.execute({ type: "BUG", comment: "Botão não responde", screenshot: png })).resolves.toHaveProperty("id");
    expect(repo.items).toHaveLength(1);
    expect(sendMail).toHaveBeenCalledTimes(1);
  });

  it.each([
    [{ type: "", comment: "ok" }, "Tipo de feedback inválido."],
    [{ type: "BUG", comment: "   " }, "Escreva o comentário."],
    [{ type: "BUG", comment: "ok", screenshot: "dabn" }, "Formato de captura de tela inválido."],
  ])("recusa entrada inválida %#", async (input, message) => {
    const { repo, useCase } = setup();
    await expect(useCase.execute(input)).rejects.toThrow(message);
    expect(repo.items).toHaveLength(0);
  });

  it("recusa captura acima do limite", async () => {
    const { useCase } = setup(10);
    await expect(useCase.execute({ type: "BUG", comment: "x", screenshot: `data:image/png;base64,${"A".repeat(40)}` })).rejects.toThrow("grande demais");
  });

  it("escapa HTML do comentário no e-mail", async () => {
    const { sendMail, useCase } = setup();
    await useCase.execute({ type: "IDEA", comment: '<img src=x onerror="alert(1)">' });
    const body: string = sendMail.mock.calls[0][0].body;
    expect(body).not.toContain("<img src=x");
    expect(body).toContain("&lt;img src=x");
  });

  it("falha no e-mail não perde o feedback gravado", async () => {
    const repo = new InMemoryFeedbacksRepository();
    const useCase = new SubmitFeedbackUseCase(repo, { sendMail: jest.fn().mockRejectedValue(new Error("smtp fora")) });
    jest.spyOn(console, "error").mockImplementation(() => undefined);
    await expect(useCase.execute({ type: "OTHER", comment: "oi" })).resolves.toHaveProperty("id");
    expect(repo.items).toHaveLength(1);
  });
});

describe("POST /feedbacks", () => {
  /* App isolado */
  function build() {
    const repo = new InMemoryFeedbacksRepository();
    const config = { ...loadConfig({}), maxScreenshotBytes: 1024 };
    return { repo, app: createApp({ feedbacks: repo, mail: { sendMail: jest.fn().mockResolvedValue(undefined) }, config }) };
  }

  it("201 com id; 400 com mensagem; /health conta os últimos 7 dias", async () => {
    const { app } = build();
    const ok = await request(app).post("/feedbacks").send({ type: "BUG", comment: "Falha" }).expect(201);
    expect(ok.body.id).toBeTruthy();
    const bad = await request(app).post("/feedbacks").send({ type: "XYZ", comment: "a" }).expect(400);
    expect(bad.body.error).toBe("Tipo de feedback inválido.");
    const health = await request(app).get("/health").expect(200);
    expect(health.body.feedbacksLast7Days).toBe(1);
  });

  it("413 para corpo acima do limite e CORS só para origens autorizadas", async () => {
    const { app } = build();
    await request(app).post("/feedbacks").send({ type: "BUG", comment: "x", screenshot: `data:image/png;base64,${"A".repeat(5000)}` }).expect(413);
    const res = await request(app).get("/health").set("Origin", "https://site-estranho.com");
    expect(res.headers["access-control-allow-origin"]).toBeUndefined();
  });
});

describe("escapeHtml", () => {
  it("escapa os cinco caracteres especiais", () => {
    expect(escapeHtml(`<a href="x">'&'</a>`)).toBe("&lt;a href=&quot;x&quot;&gt;&#39;&amp;&#39;&lt;/a&gt;");
  });
});
/* Fim de submit-feedback.spec.ts */
