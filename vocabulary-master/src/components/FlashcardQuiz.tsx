import React, { useState, useEffect } from 'react';
import type { Word } from '../types';

interface FlashcardQuizProps {
    words: Word[];
    onExit: () => void;
}

export const FlashcardQuiz: React.FC<FlashcardQuizProps> = ({ words, onExit }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [shuffledWords, setShuffledWords] = useState<Word[]>([]);

    useEffect(() => {
        // Shuffle words on mount
        const shuffled = [...words].sort(() => Math.random() - 0.5);
        setShuffledWords(shuffled);
    }, [words]);

    if (words.length === 0) {
        return (
            <div className="quiz-empty">
                <p>No words to study yet!</p>
                <button className="btn-secondary" onClick={onExit}>Back</button>
            </div>
        );
    }

    const currentWord = shuffledWords[currentIndex];

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsFlipped(false);
        setCurrentIndex((prev) => (prev + 1) % shuffledWords.length);
    };

    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsFlipped(false);
        setCurrentIndex((prev) => (prev - 1 + shuffledWords.length) % shuffledWords.length);
    };

    if (!currentWord) return <div>Loading...</div>;

    return (
        <div className="quiz-container">
            <div className="quiz-header">
                <button className="btn-secondary" onClick={onExit}>Exit Quiz</button>
                <span className="quiz-progress">
                    {currentIndex + 1} / {shuffledWords.length}
                </span>
            </div>

            <div
                className={`flashcard ${isFlipped ? 'flipped' : ''}`}
                onClick={() => setIsFlipped(!isFlipped)}
            >
                <div className="flashcard-inner">
                    <div className="flashcard-front">
                        <h2>{currentWord.term}</h2>
                        <p className="tap-hint">(Tap to reveal)</p>
                    </div>
                    <div className="flashcard-back">
                        <h2>{currentWord.term}</h2>
                        <p className="card-meaning">{currentWord.meaning}</p>
                        <p className="card-example">"{currentWord.example}"</p>
                    </div>
                </div>
            </div>

            <div className="quiz-controls">
                <button className="nav-btn" onClick={handlePrev}>&larr; Prev</button>
                <button className="nav-btn" onClick={handleNext}>Next &rarr;</button>
            </div>
        </div>
    );
};
