<h3 align="center"> 
	🚧 Feedback Widget 🚀
</h3> 

<h1 align="center">
    <img alt="Um widget para deixar feedback" title="#Feedback Widget" src="./.github/template-1-completo.jpg" />
</h1>

Desafios da trilha Impulse 💜 da NLW 8 Return da Rocketseat.

## Estado e próximos passos (ciclo de 09/11/2026)

**No ar:** https://nlw-8-impulse-nu.vercel.app/ respondeu 200 em 09/11/2026, mas é um build antigo: o deploy da Vercel falha desde 28/09 por configuração (#11). A API não está publicada (#3), então o envio pela demo falha.

**O que foi feito neste ciclo**
- O formulário abre como diálogo com o nome do passo, e o foco vai para dentro dele em cada passo; o Esc só fecha com o foco no widget (#18).
- Medição local da demo: LCP mediano de 1,63 s e acessibilidade 100 no Lighthouse móvel.
- Antes (ciclo de 07/11): Tab e Shift+Tab presos ao widget aberto, inclusive no script único com Shadow DOM (#14).

**O que queremos fazer**
- #3 Publicar a API e o banco no Render e no Neon (responsável).
- #11 Corrigir o deploy da Vercel (responsável).
- #12 Proteger a `main` com PR e CI obrigatórios (responsável).
- #13 Medir LCP e acessibilidade da demo publicada, depois da #11.
- #15 Confirmar a meta e ligar a medição de uso (responsável).

**Onde está a documentação**
- Estado dos critérios: [`docs/MVP.md`](docs/MVP.md)
- Plano do ciclo: [`docs/PLANO-DE-ACAO.md`](docs/PLANO-DE-ACAO.md)

### ✅ Estado atual (v2)

- Widget em português, acessível (axe 0 violações), com mensagens de erro e captura só da área visível.
- API Express 5 + TypeScript: validação com zod, escape do HTML do e-mail, CORS por lista, limite de 5 envios/min e de 4 MB por captura.
- Credenciais SMTP e banco via `.env` (veja `server/.env.example`); sem SMTP a API registra no console, sem banco usa memória.
- 17 testes (10 Jest na API, 6 Vitest no web e 1 Playwright do script único).

```sh
cd server && cp .env.example .env && npm install && npx prisma generate && npm run dev   # :3333
cd web && cp .env.example .env && npm install && npm run dev                           # :5173
```

### 🧩 Instalar o widget em outro site

`cd web && npm run build:widget` gera um único arquivo, `web/dist-widget/feedget.js`. Hospede esse arquivo e adicione ao site:

```html
<script src="https://seu-dominio/feedget.js" data-api-url="https://sua-api"></script>
```

O widget roda em um Shadow DOM, sem alterar os estilos da página. O domínio do site precisa estar na lista de CORS da API.

### 🌐 Em produção

- Site: https://nlw-8-impulse-nu.vercel.app/ (build antigo; o deploy da Vercel falha desde 28/09, #11)
- API e widget no Render: ainda não publicados; o `render.yaml` está pronto.
- Hospedagem gratuita: Render (API + site estático no mesmo `render.yaml`) com PostgreSQL no Neon, publicada a cada push na `main`.
- Passo a passo completo (Mailtrap, Neon, Render, CI e conferência): [docs/DEPLOY.md](docs/DEPLOY.md).

Documentação: [docs/ANALISE.md](docs/ANALISE.md) · [docs/ARQUITETURA.md](docs/ARQUITETURA.md) · [docs/PLANO-DE-ACAO.md](docs/PLANO-DE-ACAO.md) · [docs/DEPLOY.md](docs/DEPLOY.md)

### 💻 Sobre o projeto

---

- Inspiração do projeto desenvolvido no Bootcamp NLW-8 Return na trilha Impulse da Rocketseat.
<p align="center" style="display: flex; align-items: flex-start; justify-content: center;">
  <img alt="Um widget para deixar feedback" title="#Feedback Widget" src="./.github/NLW-return-bootcamp.jpg" width="400px"/>
  <img alt="Um widget para deixar feedback" title="#Feedback Widget" src="./.github/NLW-return-desktop.png"  width="400px"/>
  <img alt="Um widget para deixar feedback" title="#Feedback Widget" src="./.github/NLW-return-mobile.png"  height="400px"/>
</p>
- Desenvolver um widget para capturar feedback.
<p align="center" style="display: flex; align-items: flex-start; justify-content: center;">
  <img alt="Um widget para deixar feedback" title="#Feedback Widget" src="./.github/template-2-feedback-widget.jpg"  width="400px"/>
</p>
- Utilizar o template do layout a seguir para construir.
<p align="center" style="display: flex; align-items: flex-start; justify-content: center;">
  <img alt="Um widget para deixar feedback" title="#Feedback Widget" src="./.github/template-1-completo.jpg" width="400px"/>
</p>
- Seguir o paradigma mobile first para desenvolver o layout.

### 🚀 Layout

---

- Consultar e atender o layout do projeto no [Figma](https://www.figma.com/community/file/1102912516166573468). Utilizar os assets exportando do figma. 
- Mais detalhes estão no [Notion](https://efficient-sloth-d85.notion.site/NLW-Return-4e1cf60ece8f42d08254810f7bb14401)

### 🚀 Techs

---

- html, css, javascript
- reactjs
- typescript
- tailwind
- acessibilidade com headless

### 🚀 Ferramentas

---

- A seguir temos as ferramentas que compõem essa aplicação. O mailtrap responsável por enviar por e-mail as informações do feedback. Na versão original, o vercel hospedava o front e o railway, o banco de dados e o backend; hoje tudo roda no Render com o banco no Neon (veja [docs/DEPLOY.md](docs/DEPLOY.md)).
<p align="center" style="display: flex; align-items: flex-start; justify-content: center;">
  <img alt="Um widget para deixar feedback" title="#Feedback Widget" src="./.github/tools-1-mailtrap.jpg" width="400px"/>
  <img alt="Um widget para deixar feedback" title="#Feedback Widget" src="./.github/tools-2-vercel.jpg"  width="400px"/>
  <img alt="Um widget para deixar feedback" title="#Feedback Widget" src="./.github/tools-3-railway.jpg"  height="400px"/>
  <img alt="Um widget para deixar feedback" title="#Feedback Widget" src="./.github/tools-4-vercel.jpg"  height="400px"/>
</p>

### 🛠 Construindo
 
---

#### back
- setup da aplicação
- rota
- prisma para banco de dados
- estrutura do banco de dados: tabela feedback
- enviar email com a mailtrap
- teste unitário com  jest

#### front
- Componentização
- Propriedades
- Comunicação entre os componentes no reactjs
- pixel perfect
- navegação pelo teclado
- ux

### 😯 Finalizado 

---

- Construindo a aplicação em versões.
- versão 2
<p align="center" style="display: flex; align-items: flex-start; justify-content: center;">
  <img alt="Um widget para deixar feedback" title="#Feedback Widget" src="./.github/modo-2-1.jpg" width="400px"/>
  <img alt="Hover no widget mostra o texto feedback" title="#Feedback Widget" src="./.github/modo-2-2.jpg" width="400px"/>
  <img alt="O widget mostra os tipos de feedback possíveis" title="#Feedback Widget" src="./.github/modo-2-3.jpg" width="400px"/>
  <img alt="Dentro do widget para escrever e printar tela" title="#Feedback Widget" src="./.github/modo-2-4.jpg" width="400px"/>
</p>
- versão 0, versão 1
<p align="center" style="display: flex; align-items: flex-start; justify-content: center;">
  <img alt="Um widget para deixar feedback" title="#Feedback Widget" src="./.github/modo-0.jpg" width="400px"/>
  <img alt="Um widget para deixar feedback" title="#Feedback Widget" src="./.github/modo-1.png" width="400px"/>
</p>

### 🧭 Adicionado

---

- texto da aplicação em inglês

### 💻 Próximo passo

- fazer o translate da aplicação: português inglês
- responsividade de forma fluída
- tema dark e light
- melhorar o html do e-mail
- dashboard dos feedbacks com autenticação usando firebase/oAuth
- validação de campos e erros

---  

Feito com ❤️ por Douglas A B Novato 👋🏽 [Entre em contato!](https://www.linkedin.com/in/douglasabnovato/)

## Próximos passos do responsável

- Ver o log da Vercel e conferir o Root Directory, que pode precisar ser `web`.
- Publicar a API e o widget com o `render.yaml`.

Acompanhamento nas issues #3, #11, #12 e #15.
