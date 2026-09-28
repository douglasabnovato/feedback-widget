/* Indicador de carregamento com texto para leitores de tela */
import { CircleNotch } from "@phosphor-icons/react";

export function Loading({ label = "Carregando" }: { label?: string }) {
    return (
        <div className="w-6 h-6 flex items-center justify-center overflow-hidden" role="status" aria-label={label}>
            <CircleNotch weight="bold" className="w-4 h-4 animate-spin" aria-hidden="true" />
        </div>
    );
}
/* Fim de Loading.tsx */
