# Vocabulary Master

A premium, local-first web application to help you master new English vocabulary. Built with React, TypeScript, and Vite.

## 🌟 Features

*   **Smart Add**: Enter an English word, and the app automatically fetches the Chinese meaning and example sentences.
*   **Flashcard Quiz**: Review your words in an interactive flashcard mode with flip animations.
*   **Audio Pronunciation**: Listen to words and examples with built-in Text-to-Speech (TTS).
*   **Premium Design**: Glassmorphism UI with dark mode aesthetics for a comfortable study experience.
*   **Efficient Organization**:
    *   **Filters**: Toggle between "All Words" and "Recent (24h)" to focus on what's new.
    *   **Pagination**: Lists are paginated (20 words per page) to keep the interface clean.
    *   **Stats**: View total word counts at a glance.
*   **Data Freedom**:
    *   **Local Storage**: Data stays in your browser. No server required.
    *   **Export/Import**: Backup your data to JSON or transfer it to another device easily.
*   **Safety**: Trash icon with confirmation dialog to prevent accidental deletions.

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (Version 18 or higher recommended)

### Installation

1.  **Clone or Download** this repository.
2.  Open your terminal in the project folder.
3.  Install dependencies:
    ```bash
    npm install
    ```

### Running the App

Start the development server:
```bash
npm run dev
```
Open your browser to the local URL shown (e.g., `http://localhost:5173`).

## 💻 Running on Windows / Other Machines

Since this is a client-side app using `localStorage`, you can run it on any machine with Node.js.

1.  **Install Node.js** on the target machine.
2.  **Copy this folder** to that machine.
3.  Run `npm install` and then `npm run dev`.

**To Transfer Your Data:**
1.  Click **"Export JSON"** on your old machine.
2.  Send the file to the new machine.
3.  Click **"Import JSON"** on the new machine.

## 🧪 Verification & Testing

This project includes automated test scripts using Puppeteer:

-   **`test-e2e.js`**: Verifies adding words, filtering, and quiz mode (Visible mode).
-   **`test-import.js`**: Verifies importing a 20-word JSON file.
-   **`test-pagination.js`**: Verifies pagination logic with a 25-word dataset.

To run a test:
```bash
node test-e2e.js
```

## 📄 License
Private / Personal Use
