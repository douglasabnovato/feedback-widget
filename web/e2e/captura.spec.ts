/* Captura de tela, contador e falha da captura no script único, com o widget dentro do Shadow DOM (#29) */
import { readFileSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";

type Envio = { type?: string; comment?: string; screenshot?: string | null };

/* Serve a página simples e o script único em http://site.test e guarda o corpo do POST */
async function abrirPagina(page: Page): Promise<{ envio: () => Envio }> {
  let enviado: Envio = {};
  await page.route("http://site.test/**", async (rota) => {
    const url = rota.request().url();
    if (url.endsWith("/api/feedbacks")) {
      enviado = rota.request().postDataJSON();
      await rota.fulfill({ status: 201, json: {} });
    } else if (url.endsWith("/feedget.js")) {
      await rota.fulfill({ contentType: "text/javascript", body: readFileSync("dist-widget/feedget.js") });
    } else {
      await rota.fulfill({ contentType: "text/html", body: readFileSync("e2e/pagina.html") });
    }
  });
  await page.goto("http://site.test/");
  return { envio: () => enviado };
}

/* Abre o widget, escolhe "Problema" e escreve o comentário */
async function escrever(page: Page, texto: string) {
  await page.getByRole("button", { name: "Abrir formulário de feedback" }).click();
  await page.getByRole("button", { name: /Problema/ }).click();
  await page.locator("#feedget-widget textarea").fill(texto);
}

test("tira a captura dentro do Shadow DOM e envia um PNG", async ({ page }) => {
  const { envio } = await abrirPagina(page);
  await escrever(page, "Botão quebrado");

  /* O contador fica dentro da raiz sombra do widget: 1000 - 14 = 986 */
  const contador = page.locator("#feedget-widget #feedback-contador");
  await expect(contador).toHaveText("Restam 986 caracteres");

  await page.getByRole("button", { name: "Capturar tela" }).click();
  await expect(page.getByRole("button", { name: "Remover captura de tela" })).toBeVisible();
  await page.getByRole("button", { name: /Enviar/ }).click();

  await expect(page.getByText(/Agradecemos/)).toBeVisible();
  expect(envio()).toMatchObject({ type: "BUG", comment: "Botão quebrado" });
  expect(envio().screenshot).toMatch(/^data:image\/png;base64,.{100,}/);
});

test("avisa quando a página bloqueia o canvas e envia sem a captura", async ({ page }) => {
  /* Canvas "contaminado": o navegador recusa ler os pixels, como numa página com imagem de outra origem */
  await page.addInitScript(() => {
    HTMLCanvasElement.prototype.toDataURL = () => {
      throw new DOMException("Canvas bloqueado", "SecurityError");
    };
  });
  const { envio } = await abrirPagina(page);
  await escrever(page, "Sem captura");

  await page.getByRole("button", { name: "Capturar tela" }).click();
  await expect(page.locator("#feedget-widget").getByRole("alert")).toHaveText(/Não foi possível capturar a tela/);
  await expect(page.getByRole("button", { name: "Capturar tela" })).toBeVisible();

  await page.getByRole("button", { name: /Enviar/ }).click();
  await expect(page.getByText(/Agradecemos/)).toBeVisible();
  expect(envio()).toMatchObject({ type: "BUG", comment: "Sem captura", screenshot: null });
});
/* Fim de captura.spec.ts */
