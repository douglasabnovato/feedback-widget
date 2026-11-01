/* Botão de fechar o formulário do widget */
import { useContext } from "react";
import { X } from "@phosphor-icons/react";
import { CloseWidgetContext } from "./Widget";

export function CloseButton() {
    const close = useContext(CloseWidgetContext);
    return (
        <button type="button" onClick={close} className="top-5 right-5 absolute text-zinc-300 hover:text-zinc-100" aria-label="Fechar formulário de feedback">
            <X className="w-4 h-4" weight="bold" aria-hidden="true" />
        </button>
    );
}
/* Fim de CloseButton.tsx */
