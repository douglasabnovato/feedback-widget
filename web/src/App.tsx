/* Página de demonstração: título, instrução de uso, aviso quando não há API publicada e o widget */
import { Widget } from "./components/Widget";
import { api } from "./lib/api";

/* Verdadeiro quando a página publicada aponta para uma API local, que o visitante não alcança */
export function semApiPublicada(baseURL: string = api.defaults.baseURL ?? "", host: string = window.location.hostname): boolean {
  const apiLocal = /\/\/(localhost|127\.0\.0\.1)(:|\/|$)/.test(baseURL);
  const paginaLocal = host === "localhost" || host === "127.0.0.1";
  return apiLocal && !paginaLocal;
}

export default function App() {
  return (
    <>
      <main className="mx-auto max-w-2xl p-6">
        <h1 className="text-2xl font-bold">Feedget</h1>
        <p className="mt-2 text-zinc-300">
          Widget para receber feedback com captura de tela. Use o botão no canto inferior direito para testar.
        </p>
        {semApiPublicada() && (
          <p role="status" className="mt-4 rounded-md border border-amber-400 p-3 text-sm text-amber-200">
            Esta demonstração ainda não tem servidor publicado. O envio vai mostrar erro de conexão.
          </p>
        )}
      </main>
      <Widget />
    </>
  );
}
/* Fim de App.tsx */
