# ADR-006 — Aceitar os alertas de desenvolvimento do Dependabot

- **Situação:** Aceita.
- **Data:** 16/11/2026.
- **Ordem do responsável repassada pelo DG líder em 16/11/2026:** "Regra geral por ADR. alertas que nao atrapalham a producao, pode passar. os que atrapalham, entender, escolher a melhor estrategia para manter a funcionalidade"
- **Numeração:** continua a série ADR-001 a ADR-005 de [`ARQUITETURA.md`](../ARQUITETURA.md), seção 4.

## Contexto

`gh api "repos/douglasabnovato/feedback-widget/dependabot/alerts?state=open&per_page=100"`, 16/11/2026, 15:08: 10 alertas abertos, todos com escopo de desenvolvimento.

- 9 no `web/package-lock.json` já estão corrigidos na `developer/sprint-2026-11-19` (PR #33) e fecham com o merge na `main`: `vite` (5), `@vitest/mocker` (2), `source-map-js` (1) e `postcss-selector-parser` (1).
- 1 segue aberto no `server/package-lock.json`: o `deepmerge` 4.3.1, que o Jest 29 puxa. Não há versão corrigida publicada (detalhes na #32).

Prova de que esse alerta não chega à API publicada, 16/11/2026:

- `npm --prefix server ls deepmerge --package-lock-only`: `jest@29.7.0` → `@jest/core` → `jest-config@29.7.0` → `deepmerge@4.3.1`.
- `npm --prefix server ls deepmerge --package-lock-only --omit=dev`: `(empty)`.
- No `server/package-lock.json`, o `deepmerge` 4.3.1 tem `"dev": true`.
- `npm audit --omit=dev --package-lock-only` no `server` e no `web`: `found 0 vulnerabilities`.

A API publicada executa `node dist/server.js`, que não carrega o Jest. O Jest roda só nos testes, na máquina de quem programa e no CI.

## Alertas aceitos

| Alerta | Pacote (versão) | Severidade | Quem o puxa | Por que não chega à produção |
|---|---|---|---|---|
| #1 | `deepmerge` 4.3.1 (`server/package-lock.json`) | baixa | `jest` 29.7.0 → `@jest/core` → `jest-config` | Só roda nos testes do `server`; sem versão corrigida publicada |

## Decisão

Aceitar o alerta acima. Ele não atrapalha a produção: não vai para a API publicada nem para o widget. Não há dispensa de alerta pela API; o alerta segue aberto no GitHub, e esta ADR registra o motivo.

## Consequências

- O risco fica no ambiente de quem desenvolve e no CI, não no site nem na API. O Jest só lê a configuração do próprio repositório.
- O Dependabot continua mostrando o alerta até sair uma versão corrigida do `deepmerge` ou o `server` trocar o Jest.
- O critério 9 do [`MVP.md`](../MVP.md) conta este alerta como decidido.

## Quando revisar

- Se o `deepmerge` passar a ir para a API publicada (aparecer em `npm ls deepmerge --omit=dev`).
- Se sair versão corrigida do `deepmerge` que o Jest 29 aceite sem versão maior.
- Numa troca do Jest pelo Vitest no `server`, que tira o pacote.
- Se aparecer alerta novo em pacote de runtime: esse não entra aqui e vai para correção.
