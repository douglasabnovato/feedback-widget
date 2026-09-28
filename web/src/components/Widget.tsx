/* Botão flutuante que abre o formulário de feedback */
import { ChatTeardropDots } from "@phosphor-icons/react";
import { Popover } from "@headlessui/react"

import { WidgetForm } from "./WidgetForm";

export function Widget(){

    return (
        <Popover className="absolute bottom-4 right-4 md:bottom-8 md:right-8 flex flex-col items-end">
            <Popover.Panel className="text-white">
                <WidgetForm/>
            </Popover.Panel>
            <Popover.Button className="bg-brand-500 rounded-full px-3 h-12 text-white flex items-center group" aria-label="Abrir formulário de feedback">                
                <ChatTeardropDots className="w-6 h-6" aria-hidden="true"/>                
                <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-linear">
                    <span className="pl-2"></span>
                    Feedback
                </span>
            </Popover.Button>
        </Popover>
    )
}
/* Fim de Widget.tsx */
