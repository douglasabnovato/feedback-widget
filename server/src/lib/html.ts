/* Escape de HTML para conteúdo enviado por usuários (evita injeção no e-mail) */
const MAP: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

/* Substitui caracteres especiais por entidades */
export function escapeHtml(value: string): string {
  return String(value).replace(/[&<>"']/g, (c) => MAP[c]);
}
/* Fim de html.ts */
