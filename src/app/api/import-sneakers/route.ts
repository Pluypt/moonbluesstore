
import { NextResponse } from 'next/server';
import { getNiceKicksSneakerData } from '@/lib/scrapers/nicekicks';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs, updateDoc, doc, setDoc } from 'firebase/firestore';

export async function GET() {
    try {
        const data = await getNiceKicksSneakerData();
        return NextResponse.json({ success: true, count: data.length, data });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to scrape data' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const data = await getNiceKicksSneakerData();
        const batchResults = { success: 0, failed: 0, skipped: 0 };

        // Determine target collection
        const collectionName = 'sneakers';
        const sneakersRef = collection(db, collectionName);

        // Filter out empty or invalid data
        const validData = data.filter(item => item.name && item.name.length > 0);

        for (const item of validData) {
            const name = item.name || '';
            const date = item.date || '';

            // Generate a pseudo-styleID since we don't have one from NiceKicks
            // Use "RELEASE-" + sanitized name + date
            const safeName = name.replace(/[^a-z0-9]/gi, '-').toLowerCase();
            const safeDate = date.replace(/[^a-z0-9]/gi, '-').toLowerCase();
            const styleID = `RELEASE-${safeName}-${safeDate}`;

            // Parse price
            let price = 0;
            if (item.price) {
                const priceStr = item.price.replace(/[^0-9.]/g, '');
                price = parseFloat(priceStr) || 0;
            }

            const sneakerData = {
                styleID: styleID,
                shoeName: name,
                brand: item.brand || 'Jordan',
                colorway: item.color || '',
                retailPrice: price,
                releaseDate: date,
                description: `Upcoming release: ${name} (${date})`,
                isUpcoming: true,
                source: 'nicekicks',
                createdAt: new Date(),
                updatedAt: new Date(),
                isActive: true,
                thumbnail: '', // Needs image scraping logic if available
                imageLinks: []
            };

            const docRef = doc(db, 'sneakers', styleID);
            // Use setDoc with merge 
            await setDoc(docRef, sneakerData, { merge: true });

            batchResults.success++;
        }

        return NextResponse.json({
            success: true,
            message: `Processed ${validData.length} items. Added: ${batchResults.success}, Updated/Skipped: ${batchResults.skipped}`
        });
    } catch (error) {
        console.error("Error saving to DB:", error);
        return NextResponse.json({ success: false, error: 'Failed to save data' }, { status: 500 });
    }
}
