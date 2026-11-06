/* Testes da página de demonstração: estrutura acessível e aviso de API não publicada */
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import App, { semApiPublicada } from "../App";

afterEach(() => cleanup());

describe("App", () => {
  it("tem região principal, um h1 e o botão do widget", () => {
    render(<App />);
    expect(screen.getByRole("main")).toBeTruthy();
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("button", { name: "Abrir formulário de feedback" })).toBeTruthy();
  });

  it("não mostra o aviso quando a página roda no próprio computador", () => {
    render(<App />);
    expect(screen.queryByText(/não tem servidor publicado/)).toBeNull();
  });
});

describe("semApiPublicada", () => {
  it("avisa só quando a página publicada aponta para uma API local", () => {
    expect(semApiPublicada("http://localhost:3333", "nlw-8-impulse-nu.vercel.app")).toBe(true);
    expect(semApiPublicada("http://127.0.0.1:3333", "exemplo.com")).toBe(true);
    expect(semApiPublicada("http://localhost:3333", "localhost")).toBe(false);
    expect(semApiPublicada("https://feedget-api.onrender.com", "nlw-8-impulse-nu.vercel.app")).toBe(false);
    expect(semApiPublicada("https://localhost-api.exemplo.com", "exemplo.com")).toBe(false);
  });
});
/* Fim de app.test.tsx */
