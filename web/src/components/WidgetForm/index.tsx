/* Formulário do widget em três passos: tipo, conteúdo e sucesso */
import { useId, useState } from "react";

import bugImageUrl from "../../assets/bug.svg";
import ideaImageUrl from "../../assets/idea.svg";
import thoughtImageUrl from "../../assets/thought.svg";

import { FeedbackContentStep } from "./Steps/FeedbackContentStep";
import { FeedbackSuccessStep } from "./Steps/FeedbackSuccessStep";
import { FeedbackTypeStep } from "./Steps/FeedbackTypeStep";

export const feedbackTypes = {
    BUG: { title: "Problema", image: { source: bugImageUrl, alt: "" } },
    IDEA: { title: "Ideia", image: { source: ideaImageUrl, alt: "" } },
    OTHER: { title: "Outro", image: { source: thoughtImageUrl, alt: "" } },
};

export type FeedbackType = keyof typeof feedbackTypes;

export function WidgetForm() {
    const [feedbackType, setFeedbackType] = useState<FeedbackType | null>(null);
    const [feedbackSent, setFeedbackSent] = useState(false);
    /* Cada passo põe este id no seu título, que dá nome ao diálogo */
    const titleId = useId();

    /* Volta ao primeiro passo */
    function handleRestartFeedback() {
        setFeedbackSent(false);
        setFeedbackType(null);
    }

    return (
        <div role="dialog" aria-labelledby={titleId} className="bg-zinc-900 p-4 relative rounded-2xl mb-4 flex flex-col items-center shadow-lg w-[calc(100vw-2rem)] md:w-auto">
            {feedbackSent ? (
                <FeedbackSuccessStep titleId={titleId} onFeedbackRestartRequested={handleRestartFeedback} />
            ) : !feedbackType ? (
                <FeedbackTypeStep titleId={titleId} onFeedbackTypeChanged={setFeedbackType} />
            ) : (
                <FeedbackContentStep
                    titleId={titleId}
                    feedbackType={feedbackType}
                    onFeedbackRestartRequested={handleRestartFeedback}
                    onFeedbackSent={() => setFeedbackSent(true)}
                />
            )}
            <footer className="text-xs text-neutral-300">
                Feito com 💜 no <a href="https://www.rocketseat.com.br" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">NLW Return da Rocketseat</a>
            </footer>
        </div>
    );
}
/* Fim de WidgetForm/index.tsx */
