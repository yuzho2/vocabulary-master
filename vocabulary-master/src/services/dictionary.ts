interface DictionaryResult {
    meaning: string;
    example: string;
}

export const fetchWordData = async (term: string): Promise<DictionaryResult> => {
    try {
        // 1. Fetch Translation from MyMemory
        // API: https://api.mymemory.translated.net/get?q=Hello World&langpair=en|it
        const translationResponse = await fetch(
            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(term)}&langpair=en|zh`
        );
        const translationData = await translationResponse.json();
        const meaning = translationData.responseData?.translatedText || "Translation not found";

        // 2. Fetch Example from DictionaryAPI
        // API: https://api.dictionaryapi.dev/api/v2/entries/en/<word>
        let example = "No example found.";
        try {
            const dictionaryResponse = await fetch(
                `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(term)}`
            );
            if (dictionaryResponse.ok) {
                const dictionaryData = await dictionaryResponse.json();
                // Try to find the first example in meanings
                for (const meaningData of dictionaryData[0]?.meanings || []) {
                    for (const def of meaningData.definitions || []) {
                        if (def.example) {
                            example = def.example;
                            break;
                        }
                    }
                    if (example !== "No example found.") break;
                }
            }
        } catch (e) {
            console.warn("Failed to fetch example:", e);
        }

        return { meaning, example };

    } catch (error) {
        console.error("Error fetching word data:", error);
        throw new Error("Failed to fetch dictionary data");
    }
};
