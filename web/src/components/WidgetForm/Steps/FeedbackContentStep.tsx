/* Passo 2: comentário, captura de tela opcional e envio com tratamento de erro */
import { FormEvent, useState } from "react";
import { ArrowLeft } from "@phosphor-icons/react";

import { FeedbackType, feedbackTypes } from "..";
import { CloseButton } from "../../CloseButton";
import { ScreenshotButton } from "../ScreenshotButton";
import { api, errorMessage } from "../../../lib/api";
import { Loading } from "../../Loading";

interface FeedbackContentStepProps {
    feedbackType: FeedbackType;
    onFeedbackRestartRequested: () => void;
    onFeedbackSent: () => void;
}

export function FeedbackContentStep({ feedbackType, onFeedbackRestartRequested, onFeedbackSent }: FeedbackContentStepProps) {
    const [screenshot, setScreenshot] = useState<string | null>(null);
    const [comment, setComment] = useState("");
    const [isSendingFeedback, setIsSendingFeedback] = useState(false);
    const [error, setError] = useState("");

    const feedbackTypeInfo = feedbackTypes[feedbackType];

    /* Envia o feedback e mostra o erro sem perder o texto digitado */
    async function handleSubmitFeedback(event: FormEvent) {
        event.preventDefault();
        setError("");
        setIsSendingFeedback(true);
        try {
            await api.post("/feedbacks", { type: feedbackType, comment, screenshot });
            onFeedbackSent();
        } catch (err) {
            setError(errorMessage(err));
        } finally {
            setIsSendingFeedback(false);
        }
    }

    return (
        <>
            <header>
                <button type="button" aria-label="Voltar para os tipos de feedback" className="top-5 left-5 absolute text-zinc-300 hover:text-zinc-100" onClick={onFeedbackRestartRequested}>
                    <ArrowLeft weight="bold" className="w-4 h-4" aria-hidden="true" />
                </button>
                <h2 className="text-xl leading-6 flex items-center gap-2">
                    <img className="h-6 w-6" src={feedbackTypeInfo.image.source} alt="" />
                    {feedbackTypeInfo.title}
                </h2>
                <CloseButton />
            </header>
            <form onSubmit={handleSubmitFeedback} className="my-4 w-full">
                <label htmlFor="feedback-comment" className="sr-only">Descreva seu feedback</label>
                <textarea
                    id="feedback-comment"
                    maxLength={1000}
                    className="min-w-[304px] w-full min-h-[112px] text-sm placeholder-zinc-400 text-zinc-100 border-zinc-600 bg-transparent rounded-md focus:border-brand-500 focus:ring-brand-500 focus:ring-1 focus:outline-none resize-none scrollbar scrollbar-thumb-zinc-700 scrollbar-track-transparent scrollbar-thin"
                    placeholder="Conte com detalhes o que está acontecendo..."
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                />
                {error && <p role="alert" className="text-sm text-red-300 mt-2">{error}</p>}
                <footer className="flex gap-2 mt-2">
                    <ScreenshotButton screenshot={screenshot} onScreenshotTook={setScreenshot} />
                    <button
                        disabled={comment.trim().length === 0 || isSendingFeedback}
                        type="submit"
                        className="p-2 bg-brand-500 rounded-md border-transparent flex-1 flex justify-center items-center text-sm hover:bg-brand-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-brand-500 transition-colors disabled:opacity-50 disabled:hover:bg-brand-500"
                    >
                        {isSendingFeedback ? <Loading label="Enviando feedback" /> : "Enviar feedback"}
                    </button>
                </footer>
            </form>
        </>
    );
}
/* Fim de FeedbackContentStep.tsx */
