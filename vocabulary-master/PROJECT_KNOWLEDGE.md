# Vocabulary Master - Project Knowledge

## 1. Project Overview
**Vocabulary Master** is a local-first, React-based web application designed to help users master English vocabulary. It focuses on a premium user experience with features like "Smart Add" (using external dictionary APIs), Flashcard Quizzes, and Text-to-Speech (TTS) pronunciation.

### 1.1 Tech Stack
- **Frontend Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Vanilla CSS (with CSS Variables for theming)
- **State/Persistence**: React State Hooks + `localStorage`
- **Speech Synthesis**: Web Speech API

## 2. Key Features
### 2.1 Core Functionality
- **Smart Add**: Automatically fetches meaning and examples for entered words.
- **Word List**: Displays saved words with options to listen or delete. Supports pagination (20 items/page).
- **Filtering**: Toggle between "All Words" and "Recent" (added in the last 24h).
- **Import/Export**: JSON-based backup and restore.

### 2.2 Study Modes
- **Flashcard Quiz**: An interactive mode to test memory.
    - **Front**: Word term.
    - **Back**: Meaning and Example.
    - **Features**: Flip animation, Navigation (Prev/Next), Shuffle on start.

### 2.3 Audio/TTS
- Integrated using the `useSpeech` hook.
- **Word List**: "Listen" button (speaker icon) next to each word.
- **Flashcard**:
    - Front: Reads the word.
    - Back: Reads the word followed by its example sentence.

## 3. Architecture & Code Structure

### 3.1 Directory Structure
- `src/components`: UI Components (WordList, WordForm, FlashcardQuiz, etc.)
- `src/hooks`: Custom React hooks (`useVocabulary`, `useSpeech`)
- `src/services`: External API handlers (`dictionaryService.ts`)
- `src/assets`: Static assets

### 3.2 Key Components
- **`App.tsx`**: Main entry point. Handles routing (view switching between List and Quiz), global state orchestration, and layout.
- **`WordForm.tsx`**: Input form for adding words.
- **`WordList.tsx`**: Displays the list of words using cards. Implements TTS trigger.
- **`FlashcardQuiz.tsx`**: Handles the quiz logic, card flipping, and TTS.
- **`DataManagement.tsx`**: Handles JSON export/import actions.

### 3.3 Custom Hooks
- **`useVocabulary`**: Manages the word list state, CRUD operations, and `localStorage` synchronization.
- **`useSpeech`**: Wrapper around `window.speechSynthesis`. Provides `speak(text, lang)` and `cancel()` functions, and tracks speaking state.

### 3.4 Data Model (`types.ts`)
```typescript
interface Word {
  id: string;
  term: string;
  meaning: string;
  example: string;
  createdAt: number;
}
```

## 4. Development Workflow
- **Run Locally**: `npm run dev`
- **Testing**: End-to-end tests using Puppeteer (`test-e2e.js`, `test-import.js`).

## 5. Future Improvements (Potential)
- **Spaced Repetition System (SRS)**: Implement an algorithm like SM-2 for more efficient study scheduling.
- **Backend Sync**: Optional cloud sync for cross-device usage.
- **Mobile App**: PWA features or React Native port.
