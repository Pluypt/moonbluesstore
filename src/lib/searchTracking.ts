import { db } from './firebase';
import { collection, addDoc, query, orderBy, limit, getDocs, where, Timestamp, updateDoc, increment, doc } from 'firebase/firestore';

export interface SearchLog {
    keyword: string;
    timestamp: Timestamp;
    count: number;
}

// Track search keyword
export async function trackSearch(keyword: string): Promise<void> {
    if (!keyword || keyword.trim() === '') return;

    const normalizedKeyword = keyword.trim().toLowerCase();

    try {
        // Check if keyword already exists in trending searches
        const trendingRef = collection(db, 'trendingSearches');
        const q = query(trendingRef, where('keyword', '==', normalizedKeyword));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
            // Update existing keyword count
            const docRef = snapshot.docs[0].ref;
            await updateDoc(docRef, {
                count: increment(1),
                lastSearched: Timestamp.now()
            });
        } else {
            // Add new keyword
            await addDoc(trendingRef, {
                keyword: normalizedKeyword,
                count: 1,
                lastSearched: Timestamp.now()
            });
        }

        // Also log individual search for analytics
        await addDoc(collection(db, 'searchLogs'), {
            keyword: normalizedKeyword,
            timestamp: Timestamp.now()
        });
    } catch (error) {
        console.error('Error tracking search:', error);
    }
}

// Get trending searches
export async function getTrendingSearches(limitCount: number = 8): Promise<string[]> {
    try {
        const trendingRef = collection(db, 'trendingSearches');
        const q = query(
            trendingRef,
            orderBy('count', 'desc'),
            limit(limitCount)
        );
        
        const snapshot = await getDocs(q);
        const trending = snapshot.docs.map(doc => {
            const data = doc.data();
            return data.keyword as string;
        });

        // If no trending searches yet, return default popular searches
        if (trending.length === 0) {
            return [
                "jordan 1",
                "dunk low",
                "yeezy",
                "air max",
                "new balance 530",
                "samba",
                "air force 1",
                "travis scott"
            ];
        }

        return trending;
    } catch (error) {
        console.error('Error getting trending searches:', error);
        // Return default on error
        return [
            "jordan 1",
            "dunk low",
            "yeezy",
            "air max",
            "new balance 530",
            "samba",
            "air force 1",
            "travis scott"
        ];
    }
}
