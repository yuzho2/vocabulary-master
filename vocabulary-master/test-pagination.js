import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

(async () => {
    console.log('Starting Pagination Test...');
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 50,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    try {
        await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });

        // 1. Upload 25 words
        const filePath = path.join(__dirname, 'example_words_large.json');
        console.log(`Uploading file: ${filePath}`);

        page.on('dialog', async dialog => await dialog.accept());

        const inputUploadHandle = await page.$('input[type="file"]');
        await inputUploadHandle.uploadFile(filePath);
        console.log('File uploaded.');

        await page.waitForSelector('.word-card');
        await new Promise(r => setTimeout(r, 1000)); // Wait for render

        // 2. Check Count Display
        // Look for text "Total: 25 words" (approximate check)
        const bodyText = await page.evaluate(() => document.body.innerText);
        // Since we merged, it might be 25 or 45 depending on previous state.
        // Let's just check if "Total:" exists and pagination exists.

        if (!bodyText.includes('Total:')) throw new Error('Total count not displayed');
        console.log('✅ "Total:" count displayed.');

        // 3. Verify Pagination
        // Should see only 20 items on page 1
        const cardsPage1 = await page.$$('.word-card');
        console.log(`Page 1 Item Count: ${cardsPage1.length}`);
        if (cardsPage1.length !== 20) throw new Error(`Expected 20 items on page 1, found ${cardsPage1.length}`);

        // 4. Click Next
        // Find button with text "Next"
        const buttons = await page.$$('button');
        let nextBtn;
        for (const btn of buttons) {
            const text = await page.evaluate(el => el.textContent, btn);
            if (text.includes('Next')) {
                nextBtn = btn;
                break;
            }
        }

        if (nextBtn) {
            await nextBtn.click();
            console.log('Clicked Next.');
            await new Promise(r => setTimeout(r, 1000));

            const cardsPage2 = await page.$$('.word-card');
            console.log(`Page 2 Item Count: ${cardsPage2.length}`);
            if (cardsPage2.length < 1) throw new Error('Page 2 should have items');
            console.log('✅ Pagination working.');
        } else {
            throw new Error('Next button not found');
        }

    } catch (error) {
        console.error('❌ TEST FAILED:', error);
        process.exit(1);
    } finally {
        await browser.close();
    }
})();
