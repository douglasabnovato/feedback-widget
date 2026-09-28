# Análise — Feedget (Feedback Widget)

## 1. Especificação

Widget flutuante que qualquer site pode embutir para receber feedback (problema, ideia, outro) com comentário e captura de tela opcional. A API grava no PostgreSQL e avisa a equipe por e-mail.

| Ator | Objetivo |
|---|---|
| Visitante do site | Relatar um problema ou ideia sem sair da página |
| Equipe do produto | Receber feedback com contexto visual e agir rápido |

### Requisitos funcionais

| ID | Requisito | Critério de aceite | Antes |
|---|---|---|---|
| RF01 | Escolher tipo | 3 opções em português | ⚠️ inglês |
| RF02 | Enviar comentário + captura | Envio com captura da tela visível chega à API | ❌ excede 100 kB |
| RF03 | Informar falha | Erro aparece no widget e o texto é mantido | ❌ spinner infinito |
| RF04 | Notificar equipe | E-mail com tipo, comentário (escapado) e imagem | ⚠️ HTML injetável |

## 2. Defeitos encontrados

| # | Severidade | Defeito | Referência |
|---|---|---|---|
| D1 | Crítica | Usuário e senha SMTP do Mailtrap versionados no código | OWASP A02/A07:2025 |
| D2 | Alta | Comentário interpolado sem escape no HTML do e-mail | OWASP A05:2025 |
| D3 | Alta | `express.json()` com limite padrão (100 kB) recusa a captura de tela | — |
| D4 | Alta | Sem tratamento de erro no front e no back (Express 4 + async) | OWASP A10:2025 |
| D5 | Média | CORS aberto e sem limite de envio (spam de e-mails) | OWASP A06:2025 |
| D6 | Média | Testes com asserções que sempre passam; mensagem de erro de comentário diz "Type is required." | — |
| D7 | Média | Ícones sem nome acessível; `lang="en"`; textos misturados | WCAG 4.1.2, 3.1.1 |
| D8 | Baixa | `coverage/` e `prisma/dev.db` versionados | — |

## Rubrica v2 (grupo fullstack)

Aprovação: média ponderada ≥ 7,0 **e** C1 e C4 (eliminatórios) ≥ 5. Regras: nota sem evidência vale no máximo 6; C1 limitado a 7 para parte não executada de ponta a ponta; C9 ≥ 8 só com URL publicada e CI verde.

| # | Critério | Referência | Peso | Antes | Depois | Evidência | Justificativa |
|---|---|---|---|---|---|---|---|
| C1 | Núcleo de valor | MVP (Ries); SWEBOK Requirements | 16% | 5 | 8 | E2E Playwright: abrir → Problema → comentário → captura de tela → enviado (API real, repositório em memória) | Captura em base64 passa de 100 kB (limite padrão do express.json): envio com imagem falha |
| C2 | Estados e condições excepcionais | Nielsen; OWASP A10:2025 | 8% | 2 | 8 | Testes 400/413; erro de API exibido no widget (Vitest) | Sem try/catch: erro deixa o botão girando e a requisição pendurada |
| C3 | Acessibilidade | WCAG 2.2 AA (axe-core) | 7% | 3 | 8 | axe-core: 0 violações no fluxo completo | Botões só com ícone, sem nome acessível; textos em inglês e português |
| C4 | Segurança e privacidade | OWASP Top 10:2025 / ASVS 5.0 N1 | 14% | 2 | 8 | Testes: escape de HTML no e-mail, CORS por lista, limite de captura; credenciais fora do código | Usuário/senha do Mailtrap no código; comentário vai sem escape para o HTML do e-mail; CORS aberto; sem limite de envio |
| C5 | Dados | 3FN / ACID / fonte única | 10% | 5 | 7 | Migration `createdAt` escrita; `prisma migrate` não executado (binários do Prisma bloqueados no ambiente) | Schema Prisma ok, mas `dev.db` (SQLite) versionado sem uso |
| C6 | Testes | Pirâmide de testes; SWEBOK Testing | 9% | 3 | 8 | 10 testes Jest (use case + HTTP) + 3 Vitest | 4 testes com asserções invertidas (`rejects.not.toThrow`) |
| C7 | Qualidade de código | SOLID / camadas; SWEBOK Construction | 7% | 7 | 8 | Clean Architecture preservada (use case, adapters, repositórios) + DIP no cliente Prisma | Boa separação em camadas desde o original |
| C8 | Desempenho | Complexidade; Core Web Vitals | 5% | 5 | 7 | Captura só da área visível em escala 1; índice por data | Captura da página inteira em alta resolução |
| C9 | Operação | 12-Factor; DORA | 7% | 4 | 7 | `/health`; render.yaml; CI em `ci/` (não executado) | Coverage versionado; sem healthcheck |
| C10 | Documentação | README como contrato | 5% | 5 | 8 | README + docs/ | README de trilha |
| C11 | Produto e evidência | Cagan (4 riscos); Torres | 7% | 5 | 6 | `/health` mostra feedbacks dos últimos 7 dias | Propósito claro, sem métrica |
| C12 | Sustentabilidade técnica | OWASP A03:2025; SWEBOK Maintenance | 5% | 3 | 7 | `npm audit`: 0 (server e web); override de deepmerge-ts não testado com a CLI do Prisma | Vite 2, Prisma 3, axios 0.27 com vulnerabilidades |

**Média ponderada:** antes **3,99** (REPROVADO) → depois **7,59** (APROVADO).

