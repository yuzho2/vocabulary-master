import React from 'react';
import type { Word } from '../types';

interface WordListProps {
    words: Word[];
    onDelete: (id: string) => void;
}

export const WordList: React.FC<WordListProps> = ({ words, onDelete }) => {
    if (words.length === 0) {
        return <div className="empty-state">No words added yet. Start by adding some!</div>;
    }

    return (
        <div className="word-list">
            {words.map((word) => (
                <div key={word.id} className="word-card">
                    <div className="word-header">
                        <h3 className="word-term">{word.term}</h3>
                        <button
                            className="delete-btn"
                            onClick={() => {
                                if (window.confirm("Are you sure you want to delete this word?")) {
                                    onDelete(word.id);
                                }
                            }}
                            aria-label="Delete word"
                            title="Delete word"
                        >
                            🗑️
                        </button>
                    </div>
                    <p className="word-meaning">{word.meaning}</p>
                    <p className="word-example"><em>"{word.example}"</em></p>
                </div>
            ))}
        </div>
    );
};
