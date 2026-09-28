# Deploy · Feedback Widget (Feedget)

Plano de ação para publicar a API e o widget em hospedagem gratuita.

## 1. Desafio

Colocar no ar, sem custo, um widget React que envia feedbacks com captura de tela para uma API Express + Prisma, que grava no PostgreSQL e avisa por e-mail (Mailtrap), sem repetir o vazamento de credenciais SMTP da versão original.

## 2. Conteúdo

### Decisão de hospedagem

| Opção | Resultado |
|---|---|
| **Render: API (Web Service) + widget (Static Site) num único Blueprint, banco no Neon (escolhida)** | Um `render.yaml` cria os dois serviços já com as URLs cruzadas (`VITE_API_URL` e `CORS_ORIGINS`) e publica ambos a cada push |
| Widget no GitHub Pages + API no Render | O front fica no Render porque o mesmo Blueprint já o publica com a URL da API fixada; no Pages seria um segundo pipeline e mais uma origem no CORS, sem ganho |
| Vercel (API) + Railway (banco), como no original | O Railway não tem mais plano gratuito permanente e a API em função serverless exigiria reescrever a entrada |
| PostgreSQL gratuito do próprio Render | Expira 30 dias após a criação; o Neon continua de graça |

### Banco no Neon: um projeto, um banco por aplicação

Use **um único projeto no Neon** (por exemplo `portfolio-ser-mvp`) com **um banco por aplicação** (`doe_sangue`, `feedback_widget`, `be_the_hero`...). Assim você não esbarra no limite de projetos do plano gratuito, administra tudo num só painel e cada aplicação fica isolada no próprio banco. Os bancos do projeto dividem a cota de armazenamento e de computação.

### O que foi ajustado para produção

| Mudança | Arquivo | Por quê |
|---|---|---|
| Serviços renomeados para `feedback-widget-api` e `feedback-widget-web` | `render.yaml` | `feedget-*` quase certamente já existe no Render (projeto da NLW); o nome do repositório tem mais chance de sair limpo na URL |
| `CORS_ORIGINS` e `VITE_API_URL` fixados com as URLs do Render | `render.yaml` | Menos variáveis para digitar; só segredos ficam com `sync: false` |
| `MAIL_HOST` e `MAIL_PORT` do Mailtrap fixados | `render.yaml` | Não são segredos; usuário, senha e destinatário continuam no painel |
| `NODE_VERSION` `"22"` nos dois serviços e `autoDeployTrigger: commit` | `render.yaml` | O Node 20 saiu de suporte em abr/2026; cada push na `main` publica sozinho |
| Node 22 no CI | `ci/github-actions-ci.yml` | Testar na mesma versão da produção |
| `.gitignore` do widget corrigido (`.env.localdist` virou `.env`, `.env.local` e `dist` em linhas separadas) | `web/.gitignore` | Do jeito que estava, `dist/` e `.env.local` iriam para o Git |
| Seção "Em produção" e hospedagem atualizada | `Readme.md` | URL, hospedagem e link para este guia |

Conferido e mantido: o build da API roda `npm ci && npm run build && npm run migrate`, e `migrate` é `prisma migrate deploy`, o comando certo para produção (aplica só as migrações pendentes, nunca apaga dados nem gera migração nova). No plano gratuito do Render não existe *pre-deploy command*, então a migração fica no build.

### Limitações do plano gratuito

- A API dorme após 15 min sem acesso e leva cerca de 1 min para acordar. O widget desiste depois de 20 s, então **o primeiro envio depois de a API dormir pode mostrar "Sem conexão com o servidor"**; o segundo funciona. Antes de uma demonstração, abra `/health` da API.
- O site estático não dorme.
- As 750 horas mensais do Render são da conta inteira. O Neon suspende o banco após 5 min parado (acorda em ~1 s) e oferece 0,5 GB por projeto (limites em neon.com/pricing).
- A captura de tela é gravada como texto base64 no banco, até 4 MB por feedback. Esses 0,5 GB são **divididos com os outros bancos do projeto no Neon**.
- O Mailtrap gratuito é uma caixa de testes com cota mensal de e-mails: serve para demonstração, não para avisar clientes reais.

### Segurança e LGPD

- O usuário e a senha antigos do Mailtrap (`6ce2083be599f7`) estão no histórico do Git: considere-os públicos e **troque-os antes de publicar**.
- As credenciais novas ficam só no `server/.env` (fora do Git) e no painel do Render.
- A captura de tela pode mostrar dados pessoais de quem está na página. O widget captura só a área visível e o texto do e-mail é escapado. Numa demonstração, apague feedbacks de teste no SQL Editor do Neon.
- CORS aceita só a origem do widget, com limite de 5 envios por minuto por IP e corpo limitado ao tamanho da captura.

## 3. Solução (passo a passo)

### Etapa 0 · Trocar as credenciais do Mailtrap

1. Entrar em **mailtrap.io → Email Testing → Inboxes**, abrir a caixa usada no projeto e, em **SMTP Settings**, clicar em **Reset Credentials**. As credenciais antigas deixam de funcionar.
2. Anotar o **Username** e a **Password** novos (vão no `server/.env` e no Render).
3. Anotar o e-mail que vai receber os avisos (`MAIL_TO`).

### Etapa 1 · Criar o banco no Neon

1. Entrar em **neon.com** com a conta do GitHub.
2. Se ainda não existir, **New Project**: nome `portfolio-ser-mvp`, região **AWS US West 2 (Oregon)** (a mesma região padrão do Render). Os outros projetos do portfólio usam este mesmo projeto.
3. **Branches → main → aba Databases → New database**: nome `feedback_widget`, dono `neondb_owner`.
4. No **Project Dashboard**, botão **Connect**: Branch `main`, Database `feedback_widget`, Role `neondb_owner`, **Connection pooling desligado** (conexão direta: é a opção mais segura para o Prisma Migrate e sobra para o volume de uma demonstração) e copiar a string.
5. Conferir o formato: `postgresql://neondb_owner:SENHA@ep-xxxx.us-west-2.aws.neon.tech/feedback_widget?sslmode=require`. Se vier `&channel_binding=require` no final, remova; o `?sslmode=require` tem que ficar.

### Etapa 2 · Validar localmente (Git Bash)

1. `cd /c/ambiente-projeto/ser-mvp/feedback-widget/server`
2. `npm ci` (baixa os binários do Prisma)
3. `npm run build` (roda `prisma generate` e compila; se falhar por causa do `deepmerge-ts`, remova o bloco `"overrides"` do `package.json` e rode `npm install`)
4. `npm run typecheck && npm test` (10 testes)
5. `cp .env.example .env` e preencher `DATABASE_URL` (Neon), `MAIL_USER`, `MAIL_PASS` e `MAIL_TO` (Etapa 0)
6. `npm run migrate` (deve listar as 2 migrações aplicadas) e `npm run dev`
7. Em outro terminal: `cd ../web && npm ci && npm test && npm run build` (3 testes)
8. `cp .env.example .env && npm run dev`, abrir `http://localhost:5173`, enviar um feedback e ver o e-mail chegar no Mailtrap.

### Etapa 3 · Subir para o GitHub (branch `main`)

1. Voltar à raiz: `cd /c/ambiente-projeto/ser-mvp/feedback-widget`
2. Remover os arquivos substituídos:
   `git rm -r server/coverage server/prisma/dev.db server/jest.config.ts server/src/prisma.ts server/src/routes.ts server/src/use-cases/submit-feedback-se-case.spec.ts web/src/.env.local.example`
3. Ativar o CI (a pasta `.github` é protegida para a ferramenta que preparou o projeto):
   `mkdir -p .github/workflows && mv ci/github-actions-ci.yml .github/workflows/ci.yml && rmdir ci`
4. `git status` (não podem aparecer `.env`, `dist/`, `coverage/` nem `node_modules/`)
5. `git add -A`
6. `git commit -m "feat(deploy): Blueprint do Render com URLs cruzadas, Node 22, guia de deploy com Neon"`
7. `git push origin main`
8. No GitHub, aba **Actions**: o CI precisa ficar verde (API e widget).

### Etapa 4 · Criar os serviços no Render

1. Entrar em **render.com** com a conta do GitHub e autorizar o repositório `feedback-widget`.
2. **New → Blueprint** e escolher `douglasabnovato/feedback-widget`, branch `main`.
3. O Render pede 4 variáveis da API:
   - `DATABASE_URL` = string do Neon (Etapa 1)
   - `MAIL_USER` e `MAIL_PASS` = credenciais novas do Mailtrap (Etapa 0)
   - `MAIL_TO` = e-mail que recebe os avisos
4. Conferir `feedback-widget-api` (Free) e `feedback-widget-web` (Static) e clicar em **Apply**.
5. Nos **Logs** da API, esperar `All migrations have been successfully applied` (ou `No pending migrations to apply`) no build e `HTTP server running on port 10000` na subida (4 a 7 min).

### Etapa 5 · Conferir no ar

1. `https://feedback-widget-api.onrender.com/health` responde `{"status":"ok","feedbacksLast7Days":0}`.
2. `https://feedback-widget-web.onrender.com` abre com o botão do widget no canto inferior direito.
3. Escolher **Problema**, escrever um comentário, tirar a captura e enviar: aparece a tela de agradecimento.
4. `/health` da API passa a mostrar `"feedbacksLast7Days":1`.
5. O e-mail "Novo feedback: Problema" chega na caixa do Mailtrap.
6. No **SQL Editor** do Neon (banco `feedback_widget`): `SELECT type, comment, "createdAt", length(screenshot) FROM feedbacks;` mostra o registro.
7. Apagar o teste: `DELETE FROM feedbacks;`.

### Etapa 6 · Fechar

1. Se o Render acrescentar um sufixo a alguma URL (nome já usado), corrigir `CORS_ORIGINS` e `VITE_API_URL` no `render.yaml` e a URL no `Readme.md`, commit e push (o Render republica os dois).
2. No GitHub, **About → Website**: colar `https://feedback-widget-web.onrender.com`.
