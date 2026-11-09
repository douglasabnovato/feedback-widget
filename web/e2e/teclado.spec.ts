/* O script único deve funcionar só com teclado, dentro do Shadow DOM (#14) */
import { readFileSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";

/* Serve a página simples e o script; guarda o que foi enviado à API */
async function prepararPagina(page: Page) {
  const enviado: { type?: string; comment?: string } = {};
  await page.route("http://site.test/**", async (rota) => {
    const url = rota.request().url();
    if (url.endsWith("/api/feedbacks")) {
      Object.assign(enviado, rota.request().postDataJSON());
      await rota.fulfill({ status: 201, json: {} });
    } else if (url.endsWith("/feedget.js")) {
      await rota.fulfill({ contentType: "text/javascript", body: readFileSync("dist-widget/feedget.js") });
    } else {
      await rota.fulfill({ contentType: "text/html", body: readFileSync("e2e/pagina.html") });
    }
  });
  await page.goto("http://site.test/");
  await expect(page.getByRole("button", { name: "Abrir formulário de feedback" })).toBeVisible();
  return enviado;
}

/* Nome do elemento focado dentro do widget, ou "fora" se o foco saiu dele */
function focado(page: Page) {
  return page.evaluate(() => {
    const host = document.getElementById("feedget-widget");
    if (document.activeElement !== host || !host?.shadowRoot) return "fora";
    const el = host.shadowRoot.activeElement as HTMLElement | null;
    if (!el) return "fora";
    return (el.getAttribute("aria-label") ?? el.textContent ?? el.tagName).trim() || el.tagName;
  });
}

/* Aperta Tab até o foco chegar ao elemento cujo nome contém o texto */
async function tabAte(page: Page, texto: string) {
  for (let i = 0; i < 12; i += 1) {
    if ((await focado(page)).includes(texto)) return;
    await page.keyboard.press("Tab");
  }
  throw new Error(`Foco não chegou a "${texto}"; parou em "${await focado(page)}"`);
}

test("abre, escolhe o tipo e envia só com teclado", async ({ page }) => {
  const enviado = await prepararPagina(page);
  await tabAte(page, "Abrir formulário de feedback");
  await page.keyboard.press("Enter");
  await tabAte(page, "Ideia");
  await page.keyboard.press("Enter");
  await tabAte(page, "TEXTAREA");
  await page.keyboard.type("Enviado pelo teclado");
  await tabAte(page, "Enviar");
  await page.keyboard.press("Enter");
  await expect(page.getByText(/Agradecemos/)).toBeVisible();
  expect(enviado).toMatchObject({ type: "IDEA", comment: "Enviado pelo teclado" });
});

test("Tab e Shift+Tab não saem do widget aberto", async ({ page }) => {
  await prepararPagina(page);
  await tabAte(page, "Abrir formulário de feedback");
  await page.keyboard.press("Enter");
  for (let i = 0; i < 10; i += 1) {
    await page.keyboard.press("Tab");
    expect(await focado(page)).not.toBe("fora");
  }
  for (let i = 0; i < 10; i += 1) {
    await page.keyboard.press("Shift+Tab");
    expect(await focado(page)).not.toBe("fora");
  }
});

test("Esc fecha e devolve o foco ao botão que abriu", async ({ page }) => {
  await prepararPagina(page);
  await tabAte(page, "Abrir formulário de feedback");
  await page.keyboard.press("Enter");
  await tabAte(page, "Problema");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Fechar formulário de feedback" })).toHaveCount(0);
  expect(await focado(page)).toBe("Abrir formulário de feedback");
  await expect(page.getByRole("button", { name: "Abrir formulário de feedback" })).toHaveAttribute("aria-expanded", "false");
});
/* Fim de teclado.spec.ts */
