/* Captura a área visível da página (html2canvas) ou remove a captura já feita */
import { useState } from "react";
import { Camera, Trash } from "@phosphor-icons/react";
import html2canvas from "html2canvas";
import { Loading } from "../Loading";

interface ScreenshotButtonProps {
    screenshot: string | null;
    onScreenshotTook: (screenshot: string | null) => void;
}

export function ScreenshotButton({ screenshot, onScreenshotTook }: ScreenshotButtonProps) {
    const [isTakingScreenshot, setIsTakingScreenshot] = useState(false);

    /* Gera PNG só da janela visível, em escala 1, para caber no limite da API */
    async function handleTakeScreenshot() {
        setIsTakingScreenshot(true);
        try {
            const canvas = await html2canvas(document.documentElement, {
                scale: 1,
                x: window.scrollX,
                y: window.scrollY,
                width: window.innerWidth,
                height: window.innerHeight,
            });
            onScreenshotTook(canvas.toDataURL("image/png"));
        } finally {
            setIsTakingScreenshot(false);
        }
    }

    if (screenshot) {
        return (
            <button
                className="p-1 w-10 rounded-md border-transparent flex justify-end items-end text-zinc-300 hover:text-zinc-100 transition-colors"
                type="button"
                aria-label="Remover captura de tela"
                style={{ backgroundImage: `url(${screenshot})`, backgroundPosition: "right bottom", backgroundSize: 180 }}
                onClick={() => onScreenshotTook(null)}
            >
                <Trash weight="fill" aria-hidden="true" />
            </button>
        );
    }

    return (
        <button
            type="button"
            aria-label="Capturar tela"
            onClick={handleTakeScreenshot}
            className="p-2 bg-zinc-800 rounded-md border-transparent hover:bg-zinc-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-brand-500"
        >
            {isTakingScreenshot ? <Loading label="Capturando tela" /> : <Camera className="w-6 h-6" aria-hidden="true" />}
        </button>
    );
}
/* Fim de ScreenshotButton.tsx */
