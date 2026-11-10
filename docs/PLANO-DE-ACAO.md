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

## Ciclo de 09/11/2026

> Executado em 09/11/2026. Branch `feature/2026-11-09`, criada a partir da `developer/sprint-2026-11-12`, com PR para a sprint. A `main` fica com o responsável (PR #21). Nível: Vitrine (N2). Escopo: só o que o código resolve (#18 e a medição local). O status da Vercel está vermelho por configuração (#11); vale o CI do GitHub.

### Produto
- **Problema e público:** quem usa leitor de tela ou só teclado abre o widget e não ouve que um formulário apareceu; o foco fica no botão que abriu.
- **Hipótese e meta:** se o widget abrir como diálogo com nome e levar o foco para dentro, quem não usa mouse começa o envio sem procurar. Meta: `role="dialog"` com nome, foco inicial no primeiro tipo, Esc que não fecha quando o foco está na página, com teste no Vitest e no Playwright.
- **O que a pesquisa trouxe:**
  - No padrão de diálogo do WAI-ARIA, o contêiner tem `role="dialog"`, o nome vem do título visível por `aria-labelledby` e, ao abrir, o foco vai para um elemento dentro do diálogo, em geral o primeiro focável ([W3C APG, diálogo](https://www.w3.org/WAI/ARIA/apg/patterns/dialogmodal/); [exemplo da W3C](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/dialog/)).
- **Backlog (impacto × esforço):**
  1. Diálogo com nome e foco inicial em cada passo (alto × baixo). Este ciclo.
  2. Esc só com o foco no widget, pela revisão do PR #19 (médio × baixo). Este ciclo.
  3. Lighthouse local da demo (médio × baixo). Este ciclo.
  4. Deploy da Vercel (#11), API (#3), proteção da `main` (#12), meta e medição (#15). Responsável.
- **Fora do escopo:** configuração da Vercel e do Render; mudança visual.

### Engenharia
- **Mudança:** `WidgetForm` cria um id (`useId`) e o passa ao título de cada passo; o contêiner tem `role="dialog"` e `aria-labelledby`. O foco vai, por `autoFocus`, para "Problema" (passo 1), para o comentário (passo 2) e para "Quero enviar outro" (sucesso). O `keydown` do widget fecha com Esc só se o foco estiver dentro dele ou em lugar nenhum (`document.body`), o que cobre o clique no fundo do painel.
- **Riscos:** o diálogo não é modal: Tab feito na página segue a página, como antes.
- **Qualidade:** Vitest 11 de 11 e Playwright 10 de 10 (script único com Shadow DOM) em 09/11/2026; Lighthouse local de acessibilidade 100.
- **Definição de pronto:** CI do GitHub verde, PR para a sprint aberto ou mesclado, comentário no PR #21.

### Plano de ação
- **Executa:** #18; medição local do critério 7; `MVP.md`; README.
- **Vira issue:** nada novo; seguem #13 (medir o site depois da #11) e as do responsável (#3, #11, #12, #15).

## Ciclo de 07/11/2026

> Executado em 09/11/2026. Branch `feature/2026-11-07` → `developer/sprint-2026-11-12` → `main` (o merge na `main` fica com o responsável). Nível: Vitrine (N2), 12 critérios. Escopo: só o que o código resolve. O status da Vercel está vermelho desde 28/09 por configuração (#11); vale o CI do GitHub.

### Produto
- **Problema e público:** donos de site instalam o widget com uma tag `<script>`; quem visita precisa conseguir enviar feedback também sem mouse.
- **Hipótese e meta:** se o widget funcionar só com teclado, nenhum visitante fica preso nele nem sem caminho de envio. Meta: abrir, escolher o tipo, escrever e enviar só com Tab, Enter e Esc, com teste no CI (#14).
- **O que a pesquisa trouxe:**
  - No padrão de diálogo do WAI-ARIA, Tab e Shift+Tab circulam dentro do diálogo aberto, Esc fecha e o foco volta a quem abriu ([W3C APG, diálogo modal](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)).
  - Dentro de Shadow DOM, `document.activeElement` aponta o host; o foco real está em `shadowRoot.activeElement`, e muitas bibliotecas de armadilha de foco não tratam isso ([MDN, ShadowRoot.activeElement](https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot/activeElement); [Nolan Lawson, foco no Shadow DOM](https://nolanlawson.com/2021/02/13/managing-focus-in-the-shadow-dom/)).
- **Backlog (impacto × esforço):**
  1. Tab e Shift+Tab presos ao widget aberto, com o foco lido da raiz do próprio widget (alto × baixo). Este ciclo.
  2. Testes Playwright de teclado no script único (alto × baixo). Este ciclo.
  3. Mover o foco para o primeiro elemento ao abrir e anunciar o widget como diálogo (`role="dialog"`, nome) (médio × baixo). Issue.
  4. Deploy da Vercel (#11), API no Render (#3), proteção da `main` (#12), meta e medição (#15). Responsável.
- **Fora do escopo:** configuração da Vercel e do Render.

### Engenharia
- **Arquitetura:** API Express + Prisma em `server/`; widget React em `web/`, distribuído como `feedget.js`, que monta o React num Shadow DOM. O `Widget` guarda a abertura, fecha com Esc e devolve o foco ao botão.
- **Mudança:** o `keydown` do widget aberto também trata Tab: lista os focáveis do contêiner e, no último (ou fora dele), volta ao primeiro; com Shift, ao contrário. O foco atual vem de `getRootNode().activeElement`, que funciona dentro e fora do Shadow DOM.
- **Riscos:** elementos que aparecem depois (captura de tela) entram na lista porque ela é refeita a cada Tab.
- **Qualidade:** `web/e2e/teclado.spec.ts` (3 testes) roda no passo `test:widget` do CI; o teste da armadilha falha sem a mudança.
- **Definição de pronto:** CI do GitHub verde, PR para a sprint mesclado e PR para a `main` aberto com `revisao-responsavel`.

### Plano de ação
- **Executa:** armadilha de foco e testes de teclado (#14); `MVP.md` com uma tabela só; README.
- **Vira issue:** foco inicial e papel de diálogo; o restante segue com o responsável (#3, #11, #12, #15) e a medição do site (#13).

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
