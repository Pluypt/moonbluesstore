
import * as cheerio from 'cheerio';

export interface SneakerData {
    date?: string;
    name?: string;
    color?: string;
    price?: string;
    brand?: string;
}

export async function getNiceKicksSneakerData(): Promise<SneakerData[]> {
    const siteUrl = 'https://www.nicekicks.com/air-jordan-release-dates/';

    try {
        const response = await fetch(siteUrl);
        const html = await response.text();
        const $ = cheerio.load(html);

        const eleSelector = '#main-content > div > main > article';

        // The structure expected by the original code:
        // It assumes children follow a pattern of keys.
        // However, the original code used hardcoded keys array which loops:
        /*
          keys = [
          'date', 'date', 'name', 'name', 'color', 'price', ...
          ]
        */
        // This looks very brittle. Let's see if we can improve it or just port it.
        // If the site structure changed, this will fail.

        // Let's implement robust scraping instead if possible?
        // But the user asked to "connect" the *specific API*. So I should try to honor its logic unless broken.
        // The original logic iterates children and assigns keys cyclically?
        // Actually, `keyIdx` increments for each child.
        // So child 0 -> date, child 1 -> date, child 2 -> name, etc.

        const keys = [
            'date',
            'date',
            'name',
            'name',
            'color',
            'price',
            'brand',
            'name', // Extra names?
            'name',
            'color',
            'price',
            'brand'
        ];

        const sneakerArr: SneakerData[] = [];

        $(eleSelector).each((parentIdx, parentElem) => {
            let keyIdx = 0;
            const sneakerObj: any = {};

            $(parentElem).children().each((childrenIdx, childElem) => {
                const articleValue = $(childElem).text().trim();

                if (articleValue) {
                    // Only assign if we have a key for this index
                    if (keyIdx < keys.length) {
                        sneakerObj[keys[keyIdx]] = articleValue;
                    }
                    keyIdx++;
                }
            });

            if (Object.keys(sneakerObj).length > 0) {
                sneakerArr.push(sneakerObj);
            }
        });

        return sneakerArr;

    } catch (err) {
        console.error("Error scraping NiceKicks:", err);
        return [];
    }
}
