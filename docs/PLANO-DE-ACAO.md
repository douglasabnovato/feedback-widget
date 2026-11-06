# Plano de ação — Feedget

Timebox: 60 min.

| MoSCoW | Item | Ganho | Esforço | Status |
|---|---|---|---|---|
| Must | Credenciais SMTP fora do código (D1) | Alto | Baixo | ✅ |
| Must | Escape no e-mail (D2) | Alto | Baixo | ✅ |
| Must | Limite de corpo e captura coerentes (D3) | Alto | Baixo | ✅ |
| Must | Tratamento de erro front e back (D4) | Alto | Baixo | ✅ |
| Should | CORS por lista + rate limit (D5) | Médio | Baixo | ✅ |
| Should | Testes corrigidos e ampliados (D6) | Médio | Médio | ✅ 13 |
| Should | Acessibilidade e pt-BR (D7) | Médio | Baixo | ✅ axe 0 |
| Could | Painel de leitura dos feedbacks | Alto | Médio | Próximo ciclo |

## Ciclo de 03/11/2026

> Executado em 06/11/2026. Branch `feature/2026-11-06` → `developer/sprint-2026-11-12` → `main`. Nível: Vitrine (N2), 12 critérios. Antes do ciclo, o PR #8 (`developer/sprint-2026-11-05`, só documentação) foi integrado na `main`.

### Produto

**Problema e público.** Donos de site querem receber feedback dos visitantes, com captura de tela, por um widget pequeno que se instala com uma tag.

**Hipótese e meta.** Quem vê o widget na demo envia um feedback em menos de 1 minuto. Meta proposta; confirmar e medir é do responsável (#15).

**O que a pesquisa trouxe.**

| Ideia | O que levamos para o projeto | Fonte |
|---|---|---|
| Armadilhas de foco costumam falhar dentro de Shadow DOM, e o foco deve voltar ao botão que abriu o diálogo | O widget em script único (antigo PR #9) já controla a abertura, o Esc e a volta do foco. Falta o teste só com teclado: virou a #14 | [Nolan Lawson: diálogos e Shadow DOM](https://nolanlawson.com/2022/06/14/dialogs-and-shadow-dom-can-we-make-it-accessible/), [a11y-dialog: problemas conhecidos](https://a11y-dialog.netlify.app/7.0.0/further-reading/known-issues), [Visa Design: diálogo acessível](https://design.visa.com/components/dialog/accessibility/) |
| Em monorepo, a Vercel falha quando a pasta raiz do projeto não bate com a pasta do app | Reforça a hipótese da raiz `web` para o deploy que falha desde 28/09. Virou a #11, do responsável | [Vercel Community: projeto em subpasta](https://community.vercel.com/t/failed-to-deploy-functions-if-project-is-located-in-subdirectory-with-minimal-example-to-reproduce/1695), [Vercel Community: caminho duplicado](https://community.vercel.com/t/vercel-cli-path-doubling-error-during-prebuilt-deployment-in-turborepo-monorepo/33492) |

**Backlog priorizado (impacto × esforço).**

| Prioridade | Item | Impacto | Esforço | Destino |
|---|---|---|---|---|
| 1 | Integrar o widget em script único (#6, antigo PR #9) | Alto | Baixo | Este ciclo |
| 2 | Demo com `main`, `h1` e aviso de API não publicada | Alto | Baixo | Este ciclo |
| 3 | CI também nos PRs para a `developer`; Playwright 1.65.0 | Alto | Baixo | Este ciclo |
| 4 | Tirar `server/prisma/dev.db` do Git | Médio | Baixo | Este ciclo |
| 5 | Corrigir o deploy da Vercel | Alto | Baixo | Responsável (#11) |
| 6 | Publicar API e banco | Alto | Médio | Responsável (#3) |
| 7 | Proteger a `main` | Alto | Baixo | Responsável (#12) |
| 8 | Medir LCP e acessibilidade no ar | Médio | Baixo | Depois da #11 (#13) |
| 9 | Teclado no script único | Médio | Baixo | Issue (#14) |
| 10 | Meta e medição de uso | Médio | Baixo | Responsável (#15) |

**Fora do escopo.** Painel de leitura, contas e métricas por site.

### Engenharia

**Arquitetura.** `web/`: React + Vite + Tailwind, com dois builds (a demo e o script único `feedget.js` em Shadow DOM). `server/`: Express 5 + TypeScript, Prisma com PostgreSQL (sem `DATABASE_URL`, memória), e-mail por SMTP. Demo na Vercel; API e banco pensados para Render e Neon (`render.yaml`).

**Riscos.**
- O deploy da Vercel falha desde 28/09; o site mostra um build antigo, sem as mudanças deste ciclo (#11).
- A API não está publicada; a demo aponta para `localhost:3333`, e o envio falha para quem visita (#3). A demo agora avisa isso.
- `server/prisma/dev.db` saiu do Git, mas segue no histórico (16 feedbacks de teste, sem dado pessoal).
- Sem proteção na `main`, um push direto publica sem CI (#12).

**Qualidade.**
- Testes: 10 Jest na API; 6 Vitest no web (3 novos da página de demonstração); 1 Playwright do script único.
- CI: agora também em PR e push para `developer/**`, que antes passavam sem verificação.
- Acessibilidade: a demo ganhou `main` e `h1`, que o axe apontava em 02/11/2026.
- Segurança: nada de dado pessoal novo; o banco SQLite antigo saiu do Git.

**Definição de pronto.** `server`: `npm ci`, `prisma generate`, `typecheck`, `npm test`. `web`: `npm test`, `npm run build`, `npm run build:widget`, `npm run test:widget`. CI verde; `MVP.md` e README atualizados.

### Plano de ação

**Este ciclo executa.**
1. Integrar o widget em script único (#6), com Playwright 1.65.0.
2. Demo com região principal, título e aviso de API não publicada, com 3 testes.
3. CI nos PRs para a `developer`; `dev.db` fora do Git.
4. `MVP.md` e README com estado e próximos passos.

**Vira issue.** #3, #11, #12, #15 (responsável); #13, #14 (agente).
