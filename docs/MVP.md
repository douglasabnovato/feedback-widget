# MVP — Feedback Widget

**Nível:** Vitrine (N2), 12 critérios. Estado em 09/11/2026 (ciclo de 09/11/2026).

**Resumo:** 7 de 12 aplicáveis atendidos

**Finalizado:** sim

| # | Critério | Situação em 09/11/2026 | Evidência ou o que falta | Issue |
|---|---|---|---|---|
| 1 | Problema e público claros | Atende | Donos de site recebem feedback dos visitantes, com captura de tela, por um widget pequeno | — |
| 2 | Hipótese a validar | Parcial | Meta proposta, sem decisão do responsável | #15 (responsável) |
| 3 | Fluxo principal completo | Parcial | O envio pelo script único passa no CI, inclusive só com teclado (`web/e2e/teclado.spec.ts`); a API não está publicada | #3 (responsável) |
| 4 | Escopo enxuto | Atende | Widget e API, sem painel (seção "Fora do MVP" no Histórico) | — |
| 5 | Medição de uso | Não atende | Nada coleta uso | #15 (responsável) |
| 6 | Falhas tratadas | Atende | O widget mostra erro de envio e aviso sem API, com testes em `web/src/__tests__` (`npx vitest run`: 11 de 11 em 09/11/2026) | — |
| 7 | Desempenho aceitável | Parcial | Lighthouse 12.8.2 móvel local (`vite preview` do build), 09/11/2026: LCP 1,69 / 1,65 / 1,58 / 1,61 s (mediana 1,63 s), TBT 4 a 8 ms, elemento `main > p.mt-2`. No site, só depois que a Vercel voltar a publicar | #11 (responsável), #13 |
| 8 | Acessibilidade básica | Atende | Formulário é um diálogo com nome do passo e foco inicial no primeiro tipo; Esc só fecha com o foco no widget (ou sem foco); Tab circula dentro dele (#18, #14). `npx playwright test` em 09/11/2026: 10 de 10. Lighthouse local: acessibilidade 100 nas 4 execuções | #13 (site) |
| 9 | Segurança e conformidade | Atende | zod, escape no e-mail, CORS por lista e limite de envios, com testes da API | — |
| 10 | Entrega confiável | Não atende | Status da Vercel vermelho desde 28/09 por configuração; `main` sem proteção | #11, #12 (responsável) |
| 11 | Testes dos fluxos críticos | Atende | CI do GitHub: 10 testes da API, 11 do web e 10 Playwright do script único | — |
| 12 | Documentação honesta | Atende | README e este arquivo dizem que a demo publicada é antiga e que a API não está no ar | — |

**Atendidos:** 1, 4, 6, 8, 9, 11 e 12. **Parciais:** 2, 3 e 7. **Não atendidos:** 5 e 10.

**Por que "Finalizado: sim":** tudo o que o código resolve está feito. Os critérios 2, 3, 5, 7 e 10 dependem do responsável (#15, #3, #11, #12), com o rótulo `depende-do-responsavel`. A medição no site (#13) vem depois da #11.

**CI:** vale o do GitHub. O status da Vercel nos PRs está vermelho desde 28/09 por configuração do projeto na Vercel (#11), não pelo código.

## Histórico

Tabelas e revisões anteriores, mantidas como registro. O estado vale só na tabela do topo.

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
