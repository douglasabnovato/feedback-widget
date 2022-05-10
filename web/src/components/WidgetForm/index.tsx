import { useState } from "react";

import bugImageUrl from "../../assets/bug.svg";
import ideaImageUrl from "../../assets/idea.svg";
import thoughtImageUrl from "../../assets/thought.svg";

import { FeedbackContentStep } from "./Steps/FeedbackContentStep";
import { FeedbackTypeStep } from "./Steps/FeedbackTypeStep";

export const feedbackTypes = {
    BUG: {
        title: "Problem",
        image: {
            source: bugImageUrl,
            alt: "Imagem de um inseto"
        },
    },
    IDEA: {
        title: "Idea",
        image: {
            source: ideaImageUrl,
            alt: "Imagem de uma lâmpada"
        },
    },
    OTHER: {
        title: "Other",
        image: {
            source: thoughtImageUrl,
            alt: "Imagem de um balão de pensamento"
        },
    },
}

export type FeedbackType = keyof typeof feedbackTypes;

export function WidgetForm(){
    const [feedbackType, setFeedbackType] = useState<FeedbackType | null>(null)
    return (
        <div className="bg-zinc-900 p-4 relative rounded-2x1 mb-4 flex flex-col items-center shadow-lg w-[calc(100vw-2rem) md:w-auto]">                        
            {!feedbackType ? ( 
                <FeedbackTypeStep onFeedbackTypeChanged={setFeedbackType}/>
            ) : (
                <FeedbackContentStep feedbackType={feedbackType}/>
            )}            
            <footer className="text-xs text-neutral-400">
                Done with 💜 <a href="https://google.com.br" className="underline underline-offset-2">Rocketseat</a>
            </footer>            
        </div>
    )
}
