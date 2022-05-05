import { CloseButton } from "./CloseButton";

export function WidgetForm(){

    return (
        <div className="bg-zinc-900 p-4 relative rounded-2x1 mb-4 flex flex-col items-center shadow-lg w-[calc(100vw-2rem) md:w-auto]">
            
            <header>
                <span className="mx-6">Deixe seu Feedback </span>
                <CloseButton/>
            </header>

            <p>Hello Word, dev!</p>
            
            <footer className="text-xs text-neutral-400">
                Feito com 💜 <a href="https://google.com.br" className="underline underline-offset-2">Rocketseat</a>
            </footer>
            
        </div>
    )

}