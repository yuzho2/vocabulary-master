import puppeteer from 'puppeteer';

(async () => {
    console.log('Starting visible automated test...');
    const browser = await puppeteer.launch({
        headless: false, // Show the browser
        slowMo: 100, // Check operations by slowing down by 100ms
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    try {
        // 1. Navigate to the app
        console.log('Navigating to http://localhost:5173...');
        await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });

        // 2. Add a Word
        console.log('Adding word "Serendipity"...');
        await page.type('input.word-input', 'Serendipity');
        await page.click('button.add-btn');

        // Wait for word to appear
        await page.waitForSelector('.word-term');
        const term = await page.$eval('.word-term', el => el.textContent);
        console.log(`Verified added word: "${term}"`);

        if (term !== 'Serendipity') throw new Error('Word adding failed');

        // 3. Test Filter
        console.log('Testing Filter...');
        // Click 'Recent'
        const buttons = await page.$$('.filter-controls button');
        await buttons[1].click(); // Assuming 2nd button is Recent
        await new Promise(r => setTimeout(r, 500)); // wait a bit
        const countAfterFilter = await page.$$eval('.word-card', els => els.length);
        console.log(`Words visible after filtering: ${countAfterFilter}`);
        if (countAfterFilter !== 1) throw new Error('Filter check failed');

        // 4. Test Quiz Mode
        console.log('Testing Quiz Mode...');
        await page.click('.start-quiz-btn');
        await page.waitForSelector('.flashcard');
        console.log('Quiz started successfully.');

        // Flip card
        await page.click('.flashcard'); // Flip
        await new Promise(r => setTimeout(r, 500));
        // Verify back is visible (by class check usually, but relying on no error for now)
        console.log('Card flipped.');

        // Exit Quiz
        await page.click('.quiz-header .btn-secondary'); // Exit button
        console.log('Exited quiz.');

        console.log('✅ ALL TESTS PASSED!');

    } catch (error) {
        console.error('❌ TEST FAILED:', error);
        process.exit(1);
    } finally {
        await browser.close();
    }
})();
