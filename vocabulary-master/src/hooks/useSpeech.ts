import { useCallback, useEffect, useState } from 'react';

interface UseSpeechReturn {
    speak: (text: string, lang?: string) => void;
    cancel: () => void;
    isSpeaking: boolean;
    hasSupport: boolean;
}

export const useSpeech = (): UseSpeechReturn => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [hasSupport, setHasSupport] = useState(false);

    useEffect(() => {
        setHasSupport('speechSynthesis' in window);
    }, []);

    const speak = useCallback((text: string, lang = 'en-US') => {
        if (!('speechSynthesis' in window)) return;

        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.rate = 0.9; // Slightly slower for better clarity

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
    }, []);

    const cancel = useCallback(() => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    return { speak, cancel, isSpeaking, hasSupport };
};
