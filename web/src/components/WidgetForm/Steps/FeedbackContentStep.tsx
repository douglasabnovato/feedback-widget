import { FeedbackType, feedbackTypes } from "..";
import { CloseButton } from "../../CloseButton";

interface FeedbackContentStepProps{
    feedbackType: FeedbackType;
}

export function FeedbackContentStep({feedbackType}:FeedbackContentStepProps){

    const feedbackTypeInfo = feedbackTypes[feedbackType];

    return (
        <>
            <header className="inline-flex items-baseline">
                <img className="h-6 w-4" src={feedbackTypeInfo.image.source} alt={feedbackTypeInfo.image.alt} />
                <span className="mx-6">{feedbackTypeInfo.title}</span>
                <CloseButton/>
            </header>

            <div className="flex py-8 gap-2 w-full">                
            </div>
        </> 
    )
}
