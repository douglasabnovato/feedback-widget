# MVP — Feedback Widget

**Nível:** Vitrine (N2), 12 critérios. Estado em 16/11/2026 (ciclo de 16/11/2026, PR feature → sprint #30). Revisto em 16/11/2026, 12h38 (alertas do Dependabot, PR #33).

**Resumo:** 8 de 12 aplicáveis atendidos

**Finalizado:** não — 3 dos 4 parciais (3, 5 e 7) dependem do responsável e têm issue `depende-do-responsavel`: API no Render (#3), Vercel (#11) e GoatCounter (#15); depois, medir no site (#13). O 9 não: 9 alertas corrigidos esperam o merge na `main`, e 1 resta sem versão corrigida (#32)

**Hipótese:** acreditamos que quem vê o widget na demo envia um feedback sozinho em menos de 1 minuto (meta decidida no ciclo de 10/11/2026, D1, revisável pelo responsável na #15). **Saberemos quando** a pessoa de fora da #25 concluir o envio na demo publicada em menos de 1 minuto e o painel do GoatCounter (#15) mostrar, na primeira semana, visitas à demo e eventos `enviar-feedback`.

| # | Critério | Situação em 16/11/2026 | Evidência ou o que falta | Issue |
|---|---|---|---|---|
| 1 | Problema e público claros | Atende | Donos de site recebem feedback dos visitantes, com captura de tela, por um widget pequeno | — |
| 2 | Hipótese a validar | Atende | Hipótese acima, com meta (menos de 1 minuto) e "saberemos quando" | #15, #25 |
| 3 | Fluxo principal completo | Parcial | No navegador, contra a API real: `web/e2e-fluxo/fluxo.spec.ts` abre a demo, escolhe "Problema", escreve, tira a captura, envia (POST com CORS de verdade, resposta 201) e confere a gravação no `/health`. `npm run test:e2e`, 16/11/2026: 3 de 3; no CI, job `e2e` do run 43815752153 (commit `c01cc82`, 16/11/2026: 3 de 3). Falta o site: `curl https://feedback-widget-api.onrender.com/health`, 16/11/2026: 404 (API não publicada) e a demo da Vercel é um build de 2022 (decisão D2: o 3 vale com o fluxo no site) | #3, #11 (responsável); #25 |
| 4 | Escopo enxuto | Atende | Widget e API, sem painel (seção "Fora do MVP" no Histórico) | — |
| 5 | Medição de uso | Parcial | Código pronto: GoatCounter sem cookie (`web/src/lib/medicao.ts`), só no build de produção fora de localhost, com o evento `enviar-feedback` (`medicao.test.ts`). Falta a conta, e o painel não mostra visitas | #15 (responsável) |
| 6 | Falhas tratadas | Atende | `npx vitest run`, 16/11/2026: 20 de 20 (erro da API, comentário vazio, falha da captura de tela em `comentario.test.tsx`, sem apagar o erro de envio). No navegador, `fluxo.spec.ts`: erro de validação da API e falta de rede mostram aviso e mantêm o texto (3 de 3). Sem API publicada, a demo avisa (`app.test.tsx`) | — |
| 7 | Desempenho aceitável | Parcial | Só medição local: Lighthouse 12.8.2 móvel (`vite preview`), 09/11/2026, LCP mediano 1,63 s, TBT 4 a 8 ms, elemento `main > p.mt-2`. No site publicado não há o que medir: a demo é o build de 2022 | #11 (responsável), #13 |
| 8 | Acessibilidade básica | Atende | axe (`@axe-core/playwright`, WCAG 2 A e AA) dentro do `fluxo.spec.ts`, em largura de desktop (1280 px) e com a API real: página, diálogo aberto, hover do envio, confirmação e erro de rede, 0 violações (`npm run test:e2e`, 16/11/2026, e job `e2e` do run 43815752153, 16/11/2026). O teste achou contraste de 3,5:1 no hover de "Enviar feedback", corrigido para 6:1. Teclado: `web/e2e/teclado.spec.ts` (Tab, Shift+Tab, Esc, foco devolvido), `npm run test:widget`, 16/11/2026: 10 de 10. O app não tem tema escuro próprio (nenhum `prefers-color-scheme` no CSS), então o axe roda só no claro | #13 (site) |
| 9 | Segurança e conformidade | Parcial | Alertas do Dependabot ligados em 16/11/2026: `gh api "repos/douglasabnovato/feedback-widget/dependabot/alerts?state=open&per_page=100"` às 12h38 deu 10 abertos, todos de desenvolvimento. 9 alertas corrigidos na sprint-19 (PR #33): `npm audit fix` no `web`, sem versão maior (`vite` 7.3.8, `vitest` 5.1.0, `source-map-js` 1.2.2, `postcss-selector-parser` 6.1.6; `npm audit` no `web`: 5 → 0); fecham com o merge na principal. 1 resta (#32): `deepmerge` 4.3.1 (baixa), do `jest` 29 no `server`, sem versão corrigida publicada. `npm audit --omit=dev`, 16/11/2026: 0 vulnerabilidades em `server` e `web`. No código: zod, escape no e-mail, CORS por lista, limite de envios, nenhum segredo; medição sem cookie e sem dado pessoal | #32 |
| 10 | Entrega confiável | Atende | `gh api repos/douglasabnovato/feedback-widget/rules/branches/main`, 16/11/2026: `deletion`, `non_fast_forward`, `pull_request` e `required_status_checks` (`server` e `web`). O job novo `e2e` ainda não é obrigatório | #27 (responsável) |
| 11 | Testes dos fluxos críticos | Atende | CI do GitHub, run 43815752153 (commit `c01cc82`, 16/11/2026): `server` 10 de 10 (Jest), `web` 20 de 20 (Vitest) e 10 de 10 (Playwright do script único), `e2e` 3 de 3, sem `skipped` | — |
| 12 | Documentação honesta | Atende | README com os comandos de `server/package.json` e `web/package.json` (inclusive `test:e2e`), conferidos em 16/11/2026. README e `docs/DEPLOY.md` dizem que a demo publicada é antiga e que a API não está no ar | — |

**Atendidos:** 1, 2, 4, 6, 8, 10, 11 e 12. **Parciais:** 3, 5, 7 e 9.

**Por que "Finalizado: não":** os critérios 3, 5 e 7 dependem do responsável (#3, #11, #15), com o rótulo `depende-do-responsavel`; a medição no site (#13) vem depois da #11. O 9 não depende só dele: os 9 alertas corrigidos fecham com o merge na `main`, e o do `deepmerge` (#32) sai trocando o Jest pelo Vitest ou com risco aceito em ADR pelo responsável.

**Vercel:** diagnóstico de 16/11/2026 e passo a passo em `docs/DEPLOY.md` e na #11. Todo deploy do projeto `feedback-widget-lfke` falha antes do build, sem log público; pela documentação da Vercel, isso é pré-condição de configuração, não código.

## Histórico

Tabelas e revisões anteriores, mantidas como registro. O estado vale só na tabela do topo.

### Revisão de 16/11/2026, 12h38 (alertas do Dependabot)

Antes: **Resumo** 8 de 12, **Finalizado:** sim, com o 9 em "Parcial" por alertas desligados (403, #26). Depois: alertas ligados, 10 abertos; 9 corrigidos na sprint-19 (PR #33), 1 resta (#32). O 9 segue "Parcial" e o Finalizado cai para "não". Resumo segue 8 de 12.

### Estado de 10/11/2026, ciclo da faixa de 90%

**Resumo declarado:** 9 de 12 (1, 2, 4, 6, 8, 9, 10, 11 e 12). **Finalizado:** sim. Revisto em 16/11/2026: o 9 estava "Atende" só pelo `npm audit`, com os alertas do Dependabot desligados (regra em decisão na engenharia#33), e o 8 citava axe sem teste de axe no repositório (só Lighthouse local e teclado). Com a régua, o estado real era 8 de 12.

### Estado de 10/11/2026, antes do ciclo da faixa de 90%

**Resumo:** 7 de 12 aplicáveis atendidos (1, 4, 6, 8, 9, 11 e 12). **Finalizado:** sim. Diferenças para a tabela atual: o 2 estava "Parcial" (meta sem decisão), o 5 "Não atende" (nada coletava uso) e o 10 "Parcial" (a principal não exigia os jobs do CI).

### Estado de 09/11/2026 (ciclo de 07/11/2026)

**Resumo:** 6 de 12 aplicáveis atendidos (1, 4, 6, 9, 11 e 12). **Finalizado:** não. Diferenças para a tabela atual: o 7 estava "Não medido" (o site serve build antigo) e o 8 "Parcial" (faltavam o papel de diálogo, #18, e o Lighthouse).

### Criação de 31/10/2026
> Criado em 31/10/2026, com os critérios usados no `movies`. Situação baseada em `AVALIACAO.md` e na conferência deste ciclo.

### Problema e hipótese

**Problema e público:** Donos de site recebem feedback dos visitantes, com captura de tela, por um widget pequeno.

**Hipótese:** Quem vê o widget na demo envia um feedback em menos de 1 minuto. Proposta inicial, para o responsável confirmar ou trocar. Sem medição, a meta ainda não pode ser conferida.

### 1. Critérios

| # | Critério | Como verificar | Situação em 31/10/2026 |
|---|---|---|---|
| 1 | Problema e público claros | Dá para explicar em uma frase | Atende |
| 2 | Hipótese a validar | Existe uma aposta escrita, com meta | Parcial: meta proposta |
| 3 | Fluxo principal completo | Uma pessoa conclui sem ajuda | Parcial: fluxo testado localmente; a API não está publicada (#3) |
| 4 | Escopo enxuto | O que não entra está registrado | Atende: widget e API, sem painel |
| 5 | Medição de uso | A métrica principal é coletada | Não atende: nada coleta uso |
| 6 | Falhas tratadas | Erro, vazio e carregamento têm resposta clara | Atende: o widget mostra erros, segundo os testes e o README |
| 7 | Desempenho aceitável | LCP de até 2,5 s no celular | Não medido: o Lighthouse falhou nas 3 execuções na página da Vercel |
| 8 | Acessibilidade básica | Lighthouse e teclado | Parcial: axe aponta a falta de região principal e de título h1 na página publicada; widget testado no PR #9, ainda sem merge |
| 9 | Segurança e conformidade | Riscos decididos; termos de terceiros cumpridos | Atende no código: zod, escape, CORS e limite de envios |
| 10 | Entrega confiável | Publicação só depois de CI verde | Não atende: **o deploy da Vercel falha na `main`**, e o Render não existe (#3) |
| 11 | Testes dos fluxos críticos | Testes automatizados no CI | Atende: 10 testes da API e 3 do widget |
| 12 | Documentação honesta | Qualquer pessoa roda o projeto, e os números estão certos | Atende |

**Resultado:** 6 de 12 critérios atendidos por inteiro. É um julgamento técnico.

### 2. Tarefas

| # | Tarefa | Situação |
|---|---|---|
| 1 | Ver o log da Vercel e corrigir a raiz do projeto | Com o responsável (#3) |
| 2 | Publicar API e widget com o `render.yaml` | Com o responsável (#3) |
| 3 | Distribuir o widget como script único | Feito no ciclo de 03/11/2026 (#6) |

### 3. Fora do MVP

Painel de leitura, contas e métricas por site. A lista é uma proposta e pode mudar com a decisão do responsável.

### Medições de 02/11/2026

Lighthouse falhou nas 3 execuções; o axe apontou 2 alertas moderados. Lighthouse 12.8.2 local, perfil móvel simulado, sem aparelho real.

### Revisão de 06/11/2026 (ciclo de 03/11/2026)

**Nível:** Vitrine (N2), 12 critérios. **Resumo:** 6 de 12 atendidos (1, 4, 6, 9, 11 e 12), 3 parciais (2, 3 e 8), 2 não atendidos (5 e 10) e 1 não medido (7). **Finalizado:** não.

| # | Situação em 06/11/2026 | Evidência ou o que falta | Issue |
|---|---|---|---|
| 2 | Parcial | Meta proposta, sem decisão do responsável | #15 |
| 3 | Parcial | Fluxo testado no CI, inclusive pelo script único numa página HTML simples; a API não está publicada | #3 |
| 5 | Não atende | Nada coleta uso | #15 |
| 7 | Não medido | A Vercel ainda serve um build antigo | #11, #13 |
| 8 | Parcial | A demo ganhou `main` e `h1` (teste em `web/src/__tests__/app.test.tsx`), mas o site publicado é antigo; teclado no script único sem teste | #11, #14 |
| 10 | Não atende | Deploy da Vercel falha na `main`; `main` sem proteção | #11, #12 |
| 11 | Atende | 10 testes da API, 6 do web e 1 Playwright do script único, no CI | — |
| 12 | Atende | README e este arquivo dizem que a demo publicada é antiga e que a API não está no ar | — |

**Resolvido neste ciclo:** #6 (widget em script único, trazido do antigo PR #9).

**Para "Finalizado":** atender 3, 7 e 8 depois das #11 e #3, e ter issue `depende-do-responsavel` aberta para 2, 5 e 10 (#15, #12, #11).
