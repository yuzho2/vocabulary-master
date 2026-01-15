import { useState, useEffect } from 'react';
import type { Word } from '../types';

const STORAGE_KEY = 'vocab-master-data';

export const useVocabulary = () => {
    const [words, setWords] = useState<Word[]>(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.error("Failed to load words from storage", e);
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
        } catch (e) {
            console.error("Failed to save words to storage", e);
        }
    }, [words]);

    const addWord = (word: Word) => {
        setWords(prev => [word, ...prev]);
    };

    const removeWord = (id: string) => {
        setWords(prev => prev.filter(w => w.id !== id));
    };

    // For Import Feature
    const importWords = (newWords: Word[]) => {
        // Basic validation could go here
        const validWords = newWords.filter(w => w.id && w.term);
        // Merge strategy: Add new words, avoid exact ID duplicates? 
        // For simplicity in this MVP, we might just append distinct ones or replace.
        // Let's Replace + Append unique? Or just Replace?
        // User asked to *Import*. Usually implies merging or restoring.
        // Let's allow merging: filter out existing IDs from newWords

        setWords(prev => {
            const existingIds = new Set(prev.map(w => w.id));
            const toAdd = validWords.filter(w => !existingIds.has(w.id));
            return [...toAdd, ...prev];
        });
    };

    return { words, addWord, removeWord, importWords };
};
