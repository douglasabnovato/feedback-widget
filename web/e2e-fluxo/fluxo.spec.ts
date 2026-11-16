/* Fluxo principal da demo no navegador, com POST real à API (CORS de verdade) e axe.
   O app não tem tema escuro próprio (nenhum prefers-color-scheme no CSS), então o axe roda só no claro. */
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { URL_API } from "../playwright.fluxo.config";

const REGRAS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

/* Violações do axe na página toda, no estado atual */
async function violacoes(page: Page) {
  const { violations } = await new AxeBuilder({ page }).withTags(REGRAS).analyze();
  return violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`);
}

test.beforeEach(async ({ context }) => {
  // Nada sai para fora da máquina: só a demo e a API locais respondem.
  await context.route(/^https?:\/\/(?!127\.0\.0\.1)/, (rota) => rota.abort());
});

test("envia um feedback com captura de tela pela demo e a API grava", async ({ page, request }) => {
  const antes = (await (await request.get(`${URL_API}/health`)).json()).feedbacksLast7Days as number;

  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "Feedget" })).toBeVisible();
  // Página e API no próprio computador: o aviso de "sem servidor" não aparece.
  await expect(page.getByRole("status")).toHaveCount(0);
  expect(await violacoes(page)).toEqual([]);

  await page.getByRole("button", { name: "Abrir formulário de feedback" }).click();
  await expect(page.getByRole("dialog", { name: "Deixe seu feedback" })).toBeVisible();
  expect(await violacoes(page)).toEqual([]);

  await page.getByRole("button", { name: /Problema/ }).click();
  await page.getByLabel("Descreva seu feedback").fill("O botão salvar não responde");
  await expect(page.getByText("Restam 973 caracteres")).toBeVisible();
  await page.getByRole("button", { name: "Capturar tela" }).click();
  await expect(page.getByRole("button", { name: "Remover captura de tela" })).toBeVisible({ timeout: 20_000 });
  // Com o mouse sobre o envio: o hover antigo (brand-300) tinha contraste de 3,5:1.
  await page.getByRole("button", { name: "Enviar feedback" }).hover();
  expect(await violacoes(page)).toEqual([]);

  const resposta = page.waitForResponse((r) => r.url() === `${URL_API}/feedbacks` && r.request().method() === "POST");
  await page.getByRole("button", { name: "Enviar feedback" }).click();
  expect((await resposta).status()).toBe(201);

  await expect(page.getByRole("dialog", { name: "Agradecemos o feedback!" })).toBeVisible();
  expect(await violacoes(page)).toEqual([]);

  const depois = (await (await request.get(`${URL_API}/health`)).json()).feedbacksLast7Days as number;
  expect(depois).toBe(antes + 1);
});

test("mostra o erro de validação da API sem perder o texto", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Abrir formulário de feedback" }).click();
  await page.getByRole("button", { name: /Outro/ }).click();
  const campo = page.getByLabel("Descreva seu feedback");
  await campo.fill("Texto válido");
  // Simula um cliente antigo que manda tipo inválido: a validação é só do servidor (zod).
  await page.route(`${URL_API}/feedbacks`, async (rota) => {
    await rota.continue({ postData: JSON.stringify({ ...rota.request().postDataJSON(), type: "SPAM" }) });
  });
  await page.getByRole("button", { name: "Enviar feedback" }).click();
  await expect(page.getByRole("alert")).toHaveText("Tipo de feedback inválido.");
  await expect(campo).toHaveValue("Texto válido");
});

test("sem conexão com a API, avisa e deixa tentar de novo", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Abrir formulário de feedback" }).click();
  await page.getByRole("button", { name: /Ideia/ }).click();
  await page.getByLabel("Descreva seu feedback").fill("Ideia sem rede");
  await page.route(`${URL_API}/feedbacks`, (rota) => rota.abort("connectionrefused"));
  await page.getByRole("button", { name: "Enviar feedback" }).click();
  await expect(page.getByRole("alert")).toHaveText("Sem conexão com o servidor. Tente novamente.");
  await expect(page.getByRole("button", { name: "Enviar feedback" })).toBeEnabled();
  expect(await violacoes(page)).toEqual([]);
});
/* Fim de fluxo.spec.ts */
