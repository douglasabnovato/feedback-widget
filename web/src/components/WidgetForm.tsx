import { useState } from "react";

import { CloseButton } from "./CloseButton";

import bugImageUrl from "../assets/bug.svg";
import ideaImageUrl from "../assets/idea.svg";
import thoughtImageUrl from "../assets/thought.svg";

const feedbackTypes = {
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

type FeedbackType = keyof typeof feedbackTypes;

export function WidgetForm(){

    const [feedbackType, setFeedbackType] = useState<FeedbackType | null>(null)

    return (
        <div className="bg-zinc-900 p-4 relative rounded-2x1 mb-4 flex flex-col items-center shadow-lg w-[calc(100vw-2rem) md:w-auto]">
            
            <header>
                <span className="mx-6">Leave yours Feedback</span>
                <CloseButton/>
            </header>

            {!feedbackType ? ( 
                <div className="flex py-8 gap-2 w-full">
                    { Object.entries(feedbackTypes).map(([key, value]) => {
                        return (
                            <button 
                                key={key}
                                className="bg-zinc-800 rounded-lg py-5 w-24 flex-1 flex flex-col items-center gap-2 border-2 border-transparent hover:border-brand-500 focus:border-brand-500 focus:outline-none"
                                type="button"
                                onClick={() => setFeedbackType(key as FeedbackType)}
                            >
                                <img src={value.image.source} alt={value.image.alt} />
                                <span>{value.title}</span>
                            </button>
                        );
                    }) }
                </div> 
            ) : (
                <p>Hello World.</p>
            )}
            
            <footer className="text-xs text-neutral-400">
                Done with 💜 <a href="https://google.com.br" className="underline underline-offset-2">Rocketseat</a>
            </footer>
            
        </div>
    )
}
