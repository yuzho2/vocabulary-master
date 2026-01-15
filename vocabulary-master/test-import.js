import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

(async () => {
    console.log('Starting Import Test...');
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 50,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    try {
        // 1. Navigate
        await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
        console.log('Navigated to app.');

        // 2. Prepare file upload
        const filePath = path.join(__dirname, 'example_words.json');
        console.log(`Uploading file: ${filePath}`);

        // 3. Handle Dialogs (Confirmations)
        page.on('dialog', async dialog => {
            console.log(`Dialog message: ${dialog.message()}`);
            await dialog.accept(); // Click OK
        });

        // 4. Find Input and Upload
        // The input is hidden via display:none, but Puppeteer can still upload to it handle
        const inputUploadHandle = await page.$('input[type="file"]');
        if (!inputUploadHandle) throw new Error("File input not found");

        await inputUploadHandle.uploadFile(filePath);
        console.log('File uploaded.');

        // Manual trigger of change event might be needed if uploadFile doesn't trigger React's onChange fully
        // But usually uploadFile is enough.
        // Wait for a UI update. Check word count.

        // Wait for at least some words to appear
        await page.waitForSelector('.word-card');

        // Count words
        // We added 20. If there were existing words, it might be 20 + existing.
        // Let's just verify we have >= 20.
        const wordCount = await page.$$eval('.word-card', els => els.length);
        console.log(`Total words found: ${wordCount}`);

        if (wordCount >= 20) {
            console.log('✅ Import Successful: >20 words visible.');
        } else {
            throw new Error('❌ Import Failed: Less than 20 words found.');
        }

        // Verify specific word
        const startWord = await page.evaluate(() => {
            return document.body.innerText.includes('Epiphany');
        });
        if (startWord) console.log('✅ Found "Epiphany" in the list.');

        // Keep browser open for a few seconds to see
        await new Promise(r => setTimeout(r, 5000));

    } catch (error) {
        console.error('❌ TEST FAILED:', error);
        process.exit(1);
    } finally {
        await browser.close();
    }
})();
