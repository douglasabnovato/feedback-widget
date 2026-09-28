/* Testes do fluxo do widget: escolher tipo, enviar, erro de rede e sucesso */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("../lib/api", async () => {
  const actual = await vi.importActual<typeof import("../lib/api")>("../lib/api");
  return { ...actual, api: { post: vi.fn() } };
});
const { api } = await import("../lib/api");
const { Widget } = await import("../components/Widget");

beforeEach(() => {
  cleanup();
  vi.clearAllMocks();
});

/* Abre o widget e escolhe "Problema" */
async function openAndChooseBug() {
  render(<Widget />);
  await userEvent.click(screen.getByRole("button", { name: "Abrir formulário de feedback" }));
  await userEvent.click(await screen.findByRole("button", { name: /Problema/ }));
}

describe("Widget", () => {
  it("envia o feedback e mostra a confirmação", async () => {
    (api.post as ReturnType<typeof vi.fn>).mockResolvedValue({ data: { id: "1" } });
    await openAndChooseBug();
    await userEvent.type(screen.getByLabelText("Descreva seu feedback"), "O botão salvar não funciona");
    await userEvent.click(screen.getByRole("button", { name: "Enviar feedback" }));
    expect(api.post).toHaveBeenCalledWith("/feedbacks", { type: "BUG", comment: "O botão salvar não funciona", screenshot: null });
    expect(await screen.findByText("Agradecemos o feedback!")).toBeTruthy();
  });

  it("mostra o erro da API e mantém o texto digitado", async () => {
    (api.post as ReturnType<typeof vi.fn>).mockRejectedValue({ response: { data: { error: "Muitos envios. Tente de novo em 1 minuto." } } });
    await openAndChooseBug();
    const field = screen.getByLabelText("Descreva seu feedback") as HTMLTextAreaElement;
    await userEvent.type(field, "Teste");
    await userEvent.click(screen.getByRole("button", { name: "Enviar feedback" }));
    expect((await screen.findByRole("alert")).textContent).toMatch(/Muitos envios/);
    expect(field.value).toBe("Teste");
  });

  it("não permite enviar comentário só com espaços", async () => {
    await openAndChooseBug();
    await userEvent.type(screen.getByLabelText("Descreva seu feedback"), "   ");
    expect((screen.getByRole("button", { name: "Enviar feedback" }) as HTMLButtonElement).disabled).toBe(true);
  });
});
/* Fim de widget.test.tsx */
