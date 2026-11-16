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

describe("Widget como diálogo (#18)", () => {
  it("abre um diálogo com o nome do passo e leva o foco ao primeiro tipo", async () => {
    render(<Widget />);
    await userEvent.click(screen.getByRole("button", { name: "Abrir formulário de feedback" }));
    expect(await screen.findByRole("dialog", { name: "Deixe seu feedback" })).toBeTruthy();
    expect(document.activeElement).toBe(screen.getByRole("button", { name: /Problema/ }));
  });

  it("troca o nome do diálogo a cada passo e leva o foco ao comentário", async () => {
    (api.post as ReturnType<typeof vi.fn>).mockResolvedValue({ data: { id: "1" } });
    await openAndChooseBug();
    expect(screen.getByRole("dialog", { name: "Problema" })).toBeTruthy();
    expect(document.activeElement).toBe(screen.getByLabelText("Descreva seu feedback"));
    await userEvent.type(screen.getByLabelText("Descreva seu feedback"), "Texto");
    await userEvent.click(screen.getByRole("button", { name: "Enviar feedback" }));
    expect(await screen.findByRole("dialog", { name: "Agradecemos o feedback!" })).toBeTruthy();
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Quero enviar outro" }));
  });

  it("fechar pelo botão devolve o foco ao botão que abriu", async () => {
    render(<Widget />);
    const abrir = screen.getByRole("button", { name: "Abrir formulário de feedback" });
    await userEvent.click(abrir);
    await userEvent.click(screen.getByRole("button", { name: "Fechar formulário de feedback" }));
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement).toBe(abrir);
  });

  it("Esc com o foco fora do widget não fecha o diálogo", async () => {
    render(
      <>
        <a href="#fora">Link da página</a>
        <Widget />
      </>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Abrir formulário de feedback" }));
    screen.getByRole("link", { name: "Link da página" }).focus();
    await userEvent.keyboard("{Escape}");
    expect(screen.getByRole("dialog")).toBeTruthy();
    screen.getByRole("button", { name: /Problema/ }).focus();
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("Esc fecha quando o foco caiu no corpo da página (clique no fundo do painel)", async () => {
    render(<Widget />);
    await userEvent.click(screen.getByRole("button", { name: "Abrir formulário de feedback" }));
    (document.activeElement as HTMLElement).blur();
    expect(document.activeElement).toBe(document.body);
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
/* Fim de widget.test.tsx */
