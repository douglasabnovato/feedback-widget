/* Botão de fechar o popover do widget */
import { Popover } from "@headlessui/react";
import { X } from "@phosphor-icons/react";

export function CloseButton() {
    return (
        <Popover.Button className="top-5 right-5 absolute text-zinc-300 hover:text-zinc-100" aria-label="Fechar formulário de feedback">
            <X className="w-4 h-4" weight="bold" aria-hidden="true" />
        </Popover.Button>
    );
}
/* Fim de CloseButton.tsx */
