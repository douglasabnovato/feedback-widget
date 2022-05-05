import { CloseButton } from "./CloseButton";

import bugImageUrl from "../assets/bug.svg";
import ideaImageUrl from "../assets/idea.svg";
import thoughtImageUrl from "../assets/thought.svg";

const feedbackTypes = {
    BUG: {
        title: "Problema",
        image: {
            source: bugImageUrl,
            alt: "Imagem de um inseto"
        },
    },
    IDEA: {
        title: "Ideia",
        image: {
            source: ideaImageUrl,
            alt: "Imagem de uma lâmpada"
        },
    },
    OTHER: {
        title: "Outro",
        image: {
            source: thoughtImageUrl,
            alt: "Imagem de um balão de pensamento"
        },
    }
}

export function WidgetForm(){

    return (
        <div className="bg-zinc-900 p-4 relative rounded-2x1 mb-4 flex flex-col items-center shadow-lg w-[calc(100vw-2rem) md:w-auto]">
            
            <header>
                <span className="mx-6">Deixe seu Feedback </span>
                <CloseButton/>
            </header>

            <div className="flex py-8 gap-2 w-full">
                <button>
                    Problema
                </button>
                <button>
                    Ideia
                </button>
                <button>
                    Outro
                </button>
            </div>
            
            <footer className="text-xs text-neutral-400">
                Feito com 💜 <a href="https://google.com.br" className="underline underline-offset-2">Rocketseat</a>
            </footer>
            
        </div>
    )

}