import React, { useState } from 'react';
import { fetchWordData } from '../services/dictionary';
import type { Word } from '../types';

// Simple ID generator if we don't want to add uuid dependency yet
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

interface WordFormProps {
    onAdd: (word: Word) => void;
}

export const WordForm: React.FC<WordFormProps> = ({ onAdd }) => {
    const [term, setTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!term.trim()) return;

        setLoading(true);
        setError(null);

        try {
            const { meaning, example } = await fetchWordData(term);

            const newWord: Word = {
                id: generateId(),
                term: term.trim(),
                meaning,
                example,
                createdAt: Date.now(),
            };

            onAdd(newWord);
            setTerm('');
        } catch (err) {
            setError("Failed to fetch word data. Please try again or check your connection.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="word-form">
            <div className="input-group">
                <input
                    type="text"
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    placeholder="Enter an English word..."
                    disabled={loading}
                    className="word-input"
                />
                <button type="submit" disabled={loading || !term.trim()} className="add-btn">
                    {loading ? 'Adding...' : 'Add Word'}
                </button>
            </div>
            {error && <p className="error-msg">{error}</p>}
        </form>
    );
};
