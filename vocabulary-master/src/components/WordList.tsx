import React from 'react';
import type { Word } from '../types';
import { useSpeech } from '../hooks/useSpeech';

interface WordListProps {
    words: Word[];
    onDelete: (id: string) => void;
}

export const WordList: React.FC<WordListProps> = ({ words, onDelete }) => {
    const { speak } = useSpeech();

    if (words.length === 0) {
        return <div className="empty-state">No words added yet. Start by adding some!</div>;
    }

    return (
        <div className="word-list">
            {words.map((word) => (
                <div key={word.id} className="word-card">
                    <div className="word-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <h3 className="word-term" style={{ margin: 0 }}>{word.term}</h3>
                            <button
                                onClick={() => speak(word.term)}
                                className="volume-btn-small"
                                title="Listen"
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '1.2rem',
                                    padding: '0.2rem',
                                    marginTop: '0.2rem'
                                }}
                            >
                                🔊
                            </button>
                        </div>
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
