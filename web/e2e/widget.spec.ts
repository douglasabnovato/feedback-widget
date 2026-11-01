/* O script único deve funcionar sozinho em outra página, sem alterar os estilos dela */
import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";

test("envia feedback a partir de uma página HTML simples", async ({ page }) => {
  let enviado: { type?: string; comment?: string } = {};
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
  await expect(page.locator("h1")).toHaveCSS("color", "rgb(255, 0, 0)");
  await expect(page.locator("h1")).toHaveCSS("font-size", "32px");

  await page.getByRole("button", { name: "Abrir formulário de feedback" }).click();
  await page.getByRole("button", { name: /Ideia/ }).click();
  await page.locator("#feedget-widget textarea").fill("Comentário de teste");
  await page.getByRole("button", { name: /Enviar/ }).click();

  await expect(page.getByText(/Agradecemos/)).toBeVisible();
  expect(enviado).toMatchObject({ type: "IDEA", comment: "Comentário de teste" });
});
/* Fim de widget.spec.ts */
