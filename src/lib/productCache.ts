import { db } from './firebase';
import { collection, doc, setDoc, getDoc, getDocs, query, where, orderBy, limit as firestoreLimit } from 'firebase/firestore';
import { Sneaker } from '@/types/sneaker';

const PRODUCTS_COLLECTION = 'products';
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

// Save products to Firebase
export async function cacheProducts(products: Sneaker[]): Promise<void> {
    try {
        const batch = products.map(async (product) => {
            const docRef = doc(db, PRODUCTS_COLLECTION, product.styleID);
            await setDoc(docRef, {
                ...product,
                cachedAt: Date.now()
            }, { merge: true });
        });

        await Promise.all(batch);
        console.log(`[CACHE] Saved ${products.length} products to Firebase`);
    } catch (error) {
        console.error('[CACHE ERROR] Failed to save products:', error);
    }
}

// Get product by styleID from Firebase
export async function getCachedProduct(styleID: string): Promise<Sneaker | null> {
    try {
        const docRef = doc(db, PRODUCTS_COLLECTION, styleID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            
            // Check if cache is still valid
            if (data.cachedAt && (Date.now() - data.cachedAt) < CACHE_DURATION) {
                console.log(`[CACHE HIT] Found product ${styleID} in Firebase`);
                return data as Sneaker;
            }
        }

        return null;
    } catch (error) {
        console.error('[CACHE ERROR] Failed to get product:', error);
        return null;
    }
}

// Search products in Firebase
export async function searchCachedProducts(keyword: string, limit: number = 20): Promise<Sneaker[]> {
    try {
        const productsRef = collection(db, PRODUCTS_COLLECTION);
        const snapshot = await getDocs(productsRef);
        
        if (snapshot.empty) {
            console.log('[CACHE] No products in Firebase');
            return [];
        }

        const searchTerm = keyword.toLowerCase().trim();
        const products: Sneaker[] = [];

        snapshot.forEach((doc) => {
            const product = doc.data() as Sneaker;
            
            // Simple text search
            if (
                product.shoeName?.toLowerCase().includes(searchTerm) ||
                product.brand?.toLowerCase().includes(searchTerm) ||
                product.silhoutte?.toLowerCase().includes(searchTerm) ||
                product.styleID?.toLowerCase().includes(searchTerm)
            ) {
                products.push(product);
            }
        });

        console.log(`[CACHE] Found ${products.length} products in Firebase for "${keyword}"`);
        return products.slice(0, limit);
    } catch (error) {
        console.error('[CACHE ERROR] Failed to search products:', error);
        return [];
    }
}

// Get all cached products
export async function getAllCachedProducts(limit: number = 100): Promise<Sneaker[]> {
    try {
        const productsRef = collection(db, PRODUCTS_COLLECTION);
        const q = query(productsRef, firestoreLimit(limit));
        const snapshot = await getDocs(q);

        const products: Sneaker[] = [];
        snapshot.forEach((doc) => {
            products.push(doc.data() as Sneaker);
        });

        console.log(`[CACHE] Retrieved ${products.length} products from Firebase`);
        return products;
    } catch (error) {
        console.error('[CACHE ERROR] Failed to get all products:', error);
        return [];
    }
}
