import { db } from '@/lib/firebase';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { sneaks } from '@/lib/sneaks'; // Use the safe singleton instance

/**
 * ดึงข้อมูลจาก Sneaks API และบันทึกลง Firestore
 */
export async function syncSneakersToFirebase(keyword: string, limit: number = 10) {
    console.log(`🚀 Starting sync for: ${keyword}`);

    return new Promise((resolve, reject) => {
        sneaks.getProducts(keyword, limit, async (err: any, products: any[]) => {
            if (err) {
                console.error('❌ Sneaks API Error:', err);
                return reject(err);
            }

            let syncCount = 0;
            const results = [];

            for (const p of products) {
                try {
                    // เตรียมข้อมูลให้ตรงกับ Firestore Schema
                    const sneakerData = {
                        styleID: p.styleID || 'UNKNOWN-' + Date.now(),
                        shoeName: p.shoeName || '',
                        brand: p.brand || '',
                        silhoutte: p.silhoutte || '',
                        colorway: p.colorway || '',
                        retailPrice: p.retailPrice || 0,
                        thumbnail: p.thumbnail || '',
                        imageLinks: p.imageLinks || [],
                        lowestResellPrice: p.lowestResellPrice || {},
                        resellLinks: p.resellLinks || {},
                        description: p.description || '',
                        urlKey: p.urlKey || '',
                        lastUpdated: serverTimestamp(), // เก็บเวลาที่อัปเดตล่าสุด
                        isActive: true
                    };

                    // ใช้ styleID เป็น Document ID เพื่อป้องกันข้อมูลซ้ำ (SKU Unique)
                    const docRef = doc(db, 'sneakers', sneakerData.styleID);
                    await setDoc(docRef, sneakerData, { merge: true });

                    syncCount++;
                    results.push({ styleID: p.styleID, name: p.shoeName });
                } catch (dbError) {
                    console.error(`❌ Error saving ${p.styleID}:`, dbError);
                }
            }

            console.log(`✅ Sync completed: ${syncCount} products updated.`);
            resolve({
                success: true,
                count: syncCount,
                items: results
            });
        });
    });
}
