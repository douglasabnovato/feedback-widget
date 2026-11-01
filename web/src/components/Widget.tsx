/* Botão flutuante que abre o formulário de feedback; funciona também dentro de um Shadow DOM */
import { createContext, useEffect, useRef, useState } from "react";
import { ChatTeardropDots } from "@phosphor-icons/react";

import { WidgetForm } from "./WidgetForm";

/* Fecha o formulário e devolve o foco ao botão */
export const CloseWidgetContext = createContext<() => void>(() => undefined);

export function Widget(){
    const [isOpen, setIsOpen] = useState(false);
    const toggleButton = useRef<HTMLButtonElement>(null);

    const close = () => {
        setIsOpen(false);
        toggleButton.current?.focus();
    };

    /* Esc fecha o formulário */
    useEffect(() => {
        if (!isOpen) return undefined;
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") close();
        };
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [isOpen]);

    return (
        <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8 flex flex-col items-end">
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
