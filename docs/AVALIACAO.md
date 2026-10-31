# Avaliação — Feedback Widget

> Data: 30/10/2026 · Base: `main`.

## Evidências

| Item | Resultado |
|---|---|
| Testes da API na `main` | **Não iniciam**: `jest.config.js` e `jest.config.ts` existem ao mesmo tempo |
| Testes do widget, tipos e build | Passam (3 testes) |
| Dependências de produção | 4 alertas na API e 1 no widget, tratados no PR do CI |
| CI | Não rodava: o arquivo estava em `ci/` |
| Site na Vercel | Responde 200 |
| Render | Widget e API respondem 404, embora o README os cite |

**Não testado:** envio de feedback no ambiente publicado, para não disparar e-mails.

## Achados

| # | Severidade | Achado | Encaminhamento |
|---|---|---|---|
| A1 | Alta | Testes da API não iniciam | PR do CI |
| A2 | Alta | Os endereços do Render no README respondem 404 | README corrigido; publicar é com o responsável |
| A3 | Média | CI inativo | PR do CI |

## Nota

Nota anterior do portfólio: 5,5. **Nota atual: 6,0 com o PR do CI.** É um julgamento técnico.
