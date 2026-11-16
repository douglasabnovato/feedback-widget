# Deploy · Feedback Widget (Feedget)

Plano de ação para publicar a API e o widget em hospedagem gratuita.

## Estado em 16/11/2026

| Peça | Endereço | `curl` em 16/11/2026 | Situação | Issue |
|---|---|---|---|---|
| Demo antiga (Vercel, projeto `nlw-8-impulse`) | https://nlw-8-impulse-nu.vercel.app/ | 200 | Build de 2022; não recebe deploy desde 16/05/2022 | #11 |
| Projeto novo da Vercel (`feedback-widget-lfke`) | status "Vercel" nos commits | — | Todo deploy falha antes do build (diagnóstico abaixo) | #11 |
| API no Render (`feedback-widget-api`) | https://feedback-widget-api.onrender.com/health | 404 | Blueprint pronto (`render.yaml`); serviço não criado | #3 |
| Demo no Render (`feedback-widget-web`) | https://feedback-widget-web.onrender.com | — | Mesmo Blueprint | #3 |
| Medição (GoatCounter) | https://douglasabnovato.goatcounter.com | — | Código pronto; conta não criada | #15 |

Tudo o que falta é conta e painel, do responsável. O código e os testes não dependem disso.

### Vercel: por que o deploy falha (diagnóstico de 16/11/2026)

O que se vê sem entrar na conta:
- O status "Vercel" do merge do PR #21 (`f8c0201`, 16/11/2026) diz "Deployment has failed" e manda rodar `npx vercel inspect dpl_ESuGBhhwKfZEas9nhqsJyu4A6Jh5 --logs`. Ficou 19 s em "pending" e foi para "failure".
- A página pública do deploy (`feedback-widget-lfke-bqy1shr8g-douglasabnovatos-projects.vercel.app`) mostra só "Deployment has failed" com estado `ERROR`, sem log de build.
- Nos deploys de 10/11/2026 a falha veio de 2 a 4 s depois do início. Um `vercel.json` com o build em `web/` não mudou nada (PR #24).
- O merge do PR #21 foi feito pelo próprio dono do repositório no GitHub. Então a causa "commit de quem não é do time" fica menos provável para esse deploy.

Pela documentação da Vercel, um deploy falha **sem log de build** quando falta uma pré-condição: `vercel.json` inválido, Ignored Build Step, commit de quem não é membro do time ou integração do Marketplace que não provisionou ([Troubleshooting Build Errors](https://vercel.com/docs/deployments/troubleshoot-a-build)). O repositório não tem `vercel.json`. Sobram três suspeitas, todas no painel: o Root Directory (o app está em `web/`), o Ignored Build Step e uma integração ligada ao projeto. A mensagem exata só aparece com login, no painel ou no `vercel inspect`.

Passo a passo para o responsável (também na #11):
1. Abrir https://vercel.com/douglasabnovatos-projects/feedback-widget-lfke → **Deployments** → o deploy mais recente da `main` (com erro). Ler a mensagem do quadro de erro e copiar para a #11 (sem segredos).
2. **Settings → Build and Deployment**: **Root Directory** = `web`; **Framework Preset** = `Vite`; **Build Command** = `npm run build`; **Output Directory** = `dist`; **Node.js Version** = `22.x`. Salvar.
3. **Settings → Git**: em **Ignored Build Step**, deixar **Automatic**. Conferir que o repositório ligado é `douglasabnovato/feedback-widget`.
4. **Settings → Integrations** (ou a aba **Integrations** do time): se houver integração ligada ao projeto, ver se o estado é de erro.
5. **Settings → Environment Variables**: `VITE_API_URL` = `https://feedback-widget-api.onrender.com` (depois da #3). Não é segredo.
6. **Deployments → ⋯ → Redeploy**, sem cache. O status "Vercel" do commit deve ficar verde.
7. Decidir o endereço: ou apontar `nlw-8-impulse-nu.vercel.app` para o projeto novo (**Settings → Domains**), ou trocar o link do README. Depois, arquivar o projeto que sobrar.

Alternativa sem a Vercel: a demo também sai pelo Render, no mesmo Blueprint da API (Etapa 4). Nesse caso, desligar o projeto `feedback-widget-lfke` (**Settings → Git → Disconnect**) tira o status vermelho dos commits.

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

- O usuário e a senha antigos do Mailtrap estão no histórico do Git: considere-os públicos e **troque-os antes de publicar** (Etapa 0).
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
3. **Branches → main → aba Roles → New role**: nome `feedback_widget_app` (um usuário por aplicação, como manda a base de engenharia; senha gerada pelo Neon, só letras e números).
4. **Branches → main → aba Databases → New database**: nome `feedback_widget`, dono `feedback_widget_app`. Assim a senha desta aplicação só abre este banco.
5. No **Project Dashboard**, botão **Connect**: Branch `main`, Database `feedback_widget`, Role `feedback_widget_app`, **Connection pooling desligado** (conexão direta: é a opção mais segura para o Prisma Migrate e sobra para o volume de uma demonstração) e copiar a string.
6. Conferir o formato: `postgresql://feedback_widget_app:SENHA@ep-xxxx.us-west-2.aws.neon.tech/feedback_widget?sslmode=require`. Se vier `&channel_binding=require` no final, remova; o `?sslmode=require` tem que ficar.

### Etapa 2 · Validar localmente (Git Bash)

1. Na pasta do clone: `cd server && npm ci && npx prisma generate`
2. `npm run typecheck && npm test` (10 testes Jest)
3. `cp .env.example .env` e preencher `DATABASE_URL` (Neon), `MAIL_USER`, `MAIL_PASS` e `MAIL_TO` (Etapa 0). Sem `DATABASE_URL`, a API guarda em memória.
4. `npm run migrate` (aplica as 2 migrações) e `npm run dev` (porta 3333)
5. Em outro terminal: `cd ../web && npm ci && npm test && npm run build` (19 testes Vitest)
6. `npm run build:widget && npx playwright install chromium && npm run test:widget` (10 testes do script único)
7. `npm run test:e2e` (3 testes: a demo e a API sobem sozinhas nas portas 4391 e 3391, com POST real e axe)
8. `cp .env.example .env && npm run dev`, abrir `http://localhost:5173`, enviar um feedback e ver o e-mail chegar no Mailtrap.

### Etapa 3 · CI e `main` protegida (feito)

O workflow `.github/workflows/ci.yml` roda os jobs `server`, `web` e `e2e` em todo push e PR para `main` e `developer/**`. A `main` tem o ruleset `principal-protegida`, que exige PR e os jobs `server` e `web` (#12). Falta incluir o `e2e` entre os obrigatórios (issue própria, do responsável).

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
