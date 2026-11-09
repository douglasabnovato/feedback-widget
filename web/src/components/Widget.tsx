/* Botão flutuante que abre o formulário de feedback; funciona também dentro de um Shadow DOM */
import { createContext, useEffect, useRef, useState } from "react";
import { ChatTeardropDots } from "@phosphor-icons/react";

import { WidgetForm } from "./WidgetForm";

/* Elementos que recebem foco por Tab dentro do widget */
const FOCAVEIS = 'button:not([disabled]), [href], textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/* Fecha o formulário e devolve o foco ao botão */
export const CloseWidgetContext = createContext<() => void>(() => undefined);

export function Widget(){
    const [isOpen, setIsOpen] = useState(false);
    const toggleButton = useRef<HTMLButtonElement>(null);
    const container = useRef<HTMLDivElement>(null);

    const close = () => {
        setIsOpen(false);
        toggleButton.current?.focus();
    };

    /* Com o foco no widget aberto, Esc fecha e Tab e Shift+Tab circulam dentro dele.
       O widget não é modal: tecla feita fora dele segue a página (inclusive o Esc).
       Dentro de Shadow DOM, document.activeElement aponta o host, então o foco
       atual vem da raiz do próprio widget (getRootNode). */
    useEffect(() => {
        if (!isOpen) return undefined;
        const onKeyDown = (event: KeyboardEvent) => {
            if ((event.key !== "Escape" && event.key !== "Tab") || !container.current) return;
            const raiz = container.current.getRootNode() as Document | ShadowRoot;
            const atual = raiz.activeElement;
            if (!(atual instanceof HTMLElement) || !container.current.contains(atual)) return;
            if (event.key === "Escape") {
                close();
                return;
            }
            const focaveis = Array.from(container.current.querySelectorAll<HTMLElement>(FOCAVEIS))
                .filter((el) => el.tabIndex >= 0 && el.getClientRects().length > 0);
            if (focaveis.length === 0) return;
            const primeiro = focaveis[0];
            const ultimo = focaveis[focaveis.length - 1];
            if (event.shiftKey && atual === primeiro) {
                event.preventDefault();
                ultimo.focus();
            } else if (!event.shiftKey && atual === ultimo) {
                event.preventDefault();
                primeiro.focus();
            }
        };
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [isOpen]);

    return (
        <div ref={container} className="absolute bottom-4 right-4 md:bottom-8 md:right-8 flex flex-col items-end">
            {isOpen && (
                <div className="text-white">
                    <CloseWidgetContext.Provider value={close}>
                        <WidgetForm/>
                    </CloseWidgetContext.Provider>
                </div>
            )}
            <button ref={toggleButton} type="button" onClick={() => setIsOpen(!isOpen)} aria-expanded={isOpen} className="bg-brand-500 rounded-full px-3 h-12 text-white flex items-center group" aria-label="Abrir formulário de feedback">
                <ChatTeardropDots className="w-6 h-6" aria-hidden="true"/>
                <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-linear">
                    <span className="pl-2"></span>
                    Feedback
                </span>
            </button>
        </div>
    )
}
/* Fim de Widget.tsx */
