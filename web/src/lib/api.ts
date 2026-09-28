/* Cliente HTTP da API do Feedget e tradução de erros para mensagens exibíveis */
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3333",
  timeout: 20000,
});

/* Mensagem amigável a partir do erro do axios */
export function errorMessage(error: unknown): string {
  const e = error as { response?: { data?: { error?: string } } };
  if (e?.response?.data?.error) return e.response.data.error;
  if (!e?.response) return "Sem conexão com o servidor. Tente novamente.";
  return "Não foi possível enviar agora. Tente novamente.";
}
/* Fim de api.ts */
