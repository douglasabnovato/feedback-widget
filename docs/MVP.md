# MVP — Feedback Widget

> Criado em 31/10/2026, com os critérios usados no `movies`. Situação baseada em `AVALIACAO.md` e na conferência deste ciclo.

## Problema e hipótese

**Problema e público:** Donos de site recebem feedback dos visitantes, com captura de tela, por um widget pequeno.

**Hipótese:** Quem vê o widget na demo envia um feedback em menos de 1 minuto. Proposta inicial, para o responsável confirmar ou trocar. Sem medição, a meta ainda não pode ser conferida.

## 1. Critérios

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

## 2. Tarefas

| # | Tarefa | Situação |
|---|---|---|
| 1 | Ver o log da Vercel e corrigir a raiz do projeto | Com o responsável (#3) |
| 2 | Publicar API e widget com o `render.yaml` | Com o responsável (#3) |
| 3 | Distribuir o widget como script único | Próximo ciclo |

## 3. Fora do MVP

Painel de leitura, contas e métricas por site. A lista é uma proposta e pode mudar com a decisão do responsável.

## Medições de 02/11/2026

Lighthouse falhou nas 3 execuções; o axe apontou 2 alertas moderados. Lighthouse 12.8.2 local, perfil móvel simulado, sem aparelho real.
