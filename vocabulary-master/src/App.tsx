import { useState } from 'react';
import { WordForm } from './components/WordForm';
import { WordList } from './components/WordList';
import { FlashcardQuiz } from './components/FlashcardQuiz';
import { DataManagement } from './components/DataManagement';
import { useVocabulary } from './hooks/useVocabulary';

function App() {
  const { words, addWord, removeWord, importWords } = useVocabulary();
  const [mode, setMode] = useState<'list' | 'quiz'>('list');
  const [filter, setFilter] = useState<'all' | 'recent'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 20;

  const filteredWords = words.filter(word => {
    if (filter === 'all') return true;
    const oneDayMs = 24 * 60 * 60 * 1000;
    return Date.now() - word.createdAt < oneDayMs;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredWords.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentWords = filteredWords.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Reset page when filter changes
  const handleFilterChange = (newFilter: 'all' | 'recent') => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1>Vocabulary Master</h1>
        <p style={{ marginTop: '0.5rem', opacity: 0.8 }}>
          Expand your english vocabulary with ease.
        </p>
      </header>

      {mode === 'list' && (
        <>
          <div className="card-container">
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button
                className="start-quiz-btn"
                onClick={() => setMode('quiz')}
                disabled={words.length === 0}
                style={{ flex: 1, minWidth: '200px', margin: 0 }}
              >
                {words.length > 0 ? 'Start Flashcard Quiz' : 'Add words to start quiz'}
              </button>

              <div className="filter-controls" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '0.5rem', borderRadius: '0.75rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9rem', color: '#ccc', marginRight: '0.5rem' }}>Show:</span>
                  <button
                    onClick={() => handleFilterChange('all')}
                    style={{
                      padding: '0.5rem 1rem',
                      background: filter === 'all' ? 'var(--primary)' : 'transparent',
                      fontSize: '0.9rem'
                    }}
                  >
                    All
                  </button>
                  <button
                    onClick={() => handleFilterChange('recent')}
                    style={{
                      padding: '0.5rem 1rem',
                      background: filter === 'recent' ? 'var(--primary)' : 'transparent',
                      fontSize: '0.9rem'
                    }}
                  >
                    Recent (24h)
                  </button>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Total: {filteredWords.length} words
                </div>
              </div>
            </div>
          </div>

          <WordForm onAdd={addWord} />

          <WordList words={currentWords} onDelete={removeWord} />

          {totalPages > 1 && (
            <div className="pagination-controls" style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem', alignItems: 'center' }}>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="btn-secondary"
                style={{ padding: '0.5rem 1rem' }}
              >
                &larr; Prev
              </button>
              <span style={{ color: 'var(--text-muted)' }}>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="btn-secondary"
                style={{ padding: '0.5rem 1rem' }}
              >
                Next &rarr;
              </button>
            </div>
          )}

          <DataManagement words={words} onImport={importWords} />
        </>
      )}

      {mode === 'quiz' && (
        <FlashcardQuiz
          words={words}
          onExit={() => setMode('list')}
        />
      )}
    </div>
  );
}

export default App;
