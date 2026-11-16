/* Testes do passo do comentário: contador de caracteres e falha da captura de tela */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("../lib/api", async () => {
  const actual = await vi.importActual<typeof import("../lib/api")>("../lib/api");
  return { ...actual, api: { post: vi.fn() } };
});
vi.mock("html2canvas", () => ({ default: vi.fn() }));

const { api } = await import("../lib/api");
const html2canvas = (await import("html2canvas")).default as unknown as ReturnType<typeof vi.fn>;
const { Widget } = await import("../components/Widget");
const { ERRO_CAPTURA, textoRestante } = await import("../components/WidgetForm/Steps/FeedbackContentStep");

beforeEach(() => {
  cleanup();
  vi.clearAllMocks();
});

/* Abre o widget e escolhe "Ideia" */
async function abrirEscolherIdeia() {
  render(<Widget />);
  await userEvent.click(screen.getByRole("button", { name: "Abrir formulário de feedback" }));
  await userEvent.click(await screen.findByRole("button", { name: /Ideia/ }));
}

describe("Contador de caracteres", () => {
  it("monta o texto no singular e no plural", () => {
    expect(textoRestante(0)).toBe("Restam 1000 caracteres");
    expect(textoRestante(999)).toBe("Resta 1 caractere");
    expect(textoRestante(1000)).toBe("Restam 0 caracteres");
  });

  it("mostra quanto falta, descreve o campo e anuncia depois da pausa", async () => {
    await abrirEscolherIdeia();
    const campo = screen.getByLabelText("Descreva seu feedback");
    expect(screen.getByText("Restam 1000 caracteres")).toBeTruthy();
    expect(campo.getAttribute("aria-describedby")).toBe("feedback-contador");
    await userEvent.type(campo, "Teste");
    expect(document.getElementById("feedback-contador")?.textContent).toBe("Restam 995 caracteres");
    const anuncio = document.querySelector("[aria-live='polite']") as HTMLElement;
    expect(anuncio.textContent).toBe("");
    await vi.waitFor(() => expect(anuncio.textContent).toBe("Restam 995 caracteres"), { timeout: 2000 });
  });
});

describe("Falha da captura de tela", () => {
  it("avisa o erro, mantém o texto e ainda deixa enviar sem a captura", async () => {
    html2canvas.mockRejectedValue(new Error("canvas bloqueado"));
    (api.post as ReturnType<typeof vi.fn>).mockResolvedValue({ data: { id: "1" } });
    await abrirEscolherIdeia();
    const campo = screen.getByLabelText("Descreva seu feedback") as HTMLTextAreaElement;
    await userEvent.type(campo, "Sem captura");
    await userEvent.click(screen.getByRole("button", { name: "Capturar tela" }));
    expect((await screen.findByRole("alert")).textContent).toBe(ERRO_CAPTURA);
    expect(campo.value).toBe("Sem captura");
    expect(screen.getByRole("button", { name: "Capturar tela" })).toBeTruthy();
    await userEvent.click(screen.getByRole("button", { name: "Enviar feedback" }));
    expect(api.post).toHaveBeenCalledWith("/feedbacks", { type: "IDEA", comment: "Sem captura", screenshot: null });
  });

  it("tira o aviso quando a captura seguinte dá certo", async () => {
    html2canvas.mockRejectedValueOnce(new Error("falhou")).mockResolvedValueOnce({ toDataURL: () => "data:image/png;base64,AAAA" });
    await abrirEscolherIdeia();
    await userEvent.click(screen.getByRole("button", { name: "Capturar tela" }));
    expect(await screen.findByRole("alert")).toBeTruthy();
    await userEvent.click(screen.getByRole("button", { name: "Capturar tela" }));
    expect(await screen.findByRole("button", { name: "Remover captura de tela" })).toBeTruthy();
    expect(screen.queryByRole("alert")).toBeNull();
  });
});
/* Fim de comentario.test.tsx */
