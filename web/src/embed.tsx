/* Entrada do script único: monta o widget em um Shadow DOM, para não afetar os estilos do site */
import React from "react";
import ReactDOM from "react-dom/client";
import { Widget } from "./components/Widget";
import { api } from "./lib/api";
import styles from "./embed.css?inline";

const script = document.currentScript as HTMLScriptElement | null;

/* A API pode ser definida na própria tag do script, com data-api-url */
if (script?.dataset.apiUrl) api.defaults.baseURL = script.dataset.apiUrl;

/* Cria o host do widget e monta o React dentro dele */
function mount() {
  const host = document.createElement("div");
  host.id = "feedget-widget";
  document.body.appendChild(host);
  const shadow = host.attachShadow({ mode: "open" });
  const style = document.createElement("style");
  style.textContent = styles;
  const container = document.createElement("div");
  shadow.append(style, container);
  ReactDOM.createRoot(container).render(
    <React.StrictMode>
      <Widget />
    </React.StrictMode>,
  );
}

if (document.body) mount();
else document.addEventListener("DOMContentLoaded", mount);
/* Fim de embed.tsx */
