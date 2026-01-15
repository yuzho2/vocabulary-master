import React, { useRef } from 'react';
import type { Word } from '../types';

interface DataManagementProps {
    words: Word[];
    onImport: (words: Word[]) => void;
}

export const DataManagement: React.FC<DataManagementProps> = ({ words, onImport }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleExport = () => {
        const dataStr = JSON.stringify(words, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        // Create a temporary link to download
        const link = document.createElement('a');
        link.href = url;
        link.download = `vocabulary_backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const json = event.target?.result as string;
                const parsedData = JSON.parse(json);
                if (Array.isArray(parsedData)) {
                    // Basic validation
                    const validData = parsedData.every((item: any) =>
                        typeof item.id === 'string' && typeof item.term === 'string'
                    );

                    if (validData) {
                        if (window.confirm(`Found ${parsedData.length} words. Import and merge?`)) {
                            onImport(parsedData);
                            alert("Import successful!");
                        }
                    } else {
                        alert("Invalid file format. Wanted array of words.");
                    }
                } else {
                    alert("Invalid JSON format. Expected an array.");
                }
            } catch (err) {
                console.error(err);
                alert("Failed to parse JSON file.");
            }
            // Reset input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="data-management">
            <h3>Data Management</h3>
            <div className="data-controls">
                <button onClick={handleExport} className="btn-secondary" title="Download your words">
                    Export JSON
                </button>
                <button onClick={handleImportClick} className="btn-secondary" title="Upload a JSON backup">
                    Import JSON
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".json"
                    style={{ display: 'none' }}
                />
            </div>
            <p className="data-info">
                Save your words to a file or restore from a backup.
            </p>
        </div>
    );
};
