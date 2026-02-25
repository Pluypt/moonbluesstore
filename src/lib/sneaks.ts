import getRedisClient from './redis';
import { Sneaker } from '@/types/sneaker';
import { searchMockData } from './mockData';
import { cacheProducts, searchCachedProducts } from './productCache';

// Singleton Logic
const mongoose = require('mongoose');

declare global {
    var SneaksAPIClass: any;
    var sneaksInstance: any;
}

let SneaksAPI;

if (global.SneaksAPIClass) {
    SneaksAPI = global.SneaksAPIClass;
} else {
    if (mongoose.models && mongoose.models.Sneaker) {
        delete mongoose.models.Sneaker;
    }
    SneaksAPI = require('sneaks-api');
    global.SneaksAPIClass = SneaksAPI;
}

export const sneaks = global.sneaksInstance || new SneaksAPI();
if (!global.sneaksInstance) global.sneaksInstance = sneaks;

const CACHE_EXPIRATION = 3600;

export interface ProductFilters {
    brand?: string | null;
    priceRange?: string | null;
    sortBy?: string;
}

// Main function to get products with 3-tier fallback
export const getProducts = async (
    keyword: string,
    limit: number = 20,
    page: number = 1,
    filters?: ProductFilters
): Promise<Sneaker[]> => {
    console.log(`[GETPRODUCTS] Searching for: "${keyword}"`);
    
    const searchKeyword = keyword && keyword.trim() !== '' ? keyword : 'jordan';
    
    // 1. Try sneaks-api
    try {
        console.log(`[SNEAKS] Attempting API...`);
        const apiResults = await fetchFromSneaksAPI(searchKeyword, limit);
        
        if (apiResults && apiResults.length > 0) {
            console.log(`[SNEAKS SUCCESS] Got ${apiResults.length} products`);
            cacheProducts(apiResults).catch(err => console.error('[CACHE ERROR]:', err));
            return applyFilters(apiResults, filters, limit);
        }
    } catch (error) {
        console.error('[SNEAKS ERROR]:', error);
    }
    
    // 2. Try Firebase cache
    console.log(`[FIREBASE] Trying cache...`);
    const cachedResults = await searchCachedProducts(searchKeyword, limit * 2);
    
    if (cachedResults && cachedResults.length > 0) {
        console.log(`[FIREBASE SUCCESS] Got ${cachedResults.length} products`);
        return applyFilters(cachedResults, filters, limit);
    }
    
    // 3. Use mock data
    console.log(`[MOCK] Using mock data`);
    const mockResults = searchMockData(searchKeyword, limit * 2);
    return applyFilters(mockResults, filters, limit);
};

// Helper: Fetch from sneaks-api
async function fetchFromSneaksAPI(keyword: string, limit: number): Promise<Sneaker[]> {
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('Timeout')), 10000);

        sneaks.getProducts(keyword, limit, (err: any, products: any[]) => {
            clearTimeout(timeout);
            
            if (err || !products || !Array.isArray(products) || products.length === 0) {
                reject(err || new Error('No products'));
                return;
            }

            const formatted: Sneaker[] = products.map(p => ({
                styleID: p.styleID,
                shoeName: p.shoeName,
                brand: p.brand,
                silhoutte: p.silhoutte,
                colorway: p.colorway || 'N/A',
                retailPrice: p.retailPrice,
                thumbnail: p.thumbnail,
                imageLinks: p.imageLinks || [],
                lowestResellPrice: p.lowestResellPrice || {},
                resellLinks: p.resellLinks || {},
                description: p.description,
                urlKey: p.urlKey
            }));

            resolve(formatted);
        });
    });
}

// Helper: Apply filters
function applyFilters(products: Sneaker[], filters?: ProductFilters, limit: number = 20): Sneaker[] {
    let results = [...products];
    
    if (filters) {
        if (filters.brand && filters.brand !== "All") {
            results = results.filter(p =>
                p.brand?.toLowerCase().includes(filters.brand!.toLowerCase())
            );
        }

        if (filters.priceRange && filters.priceRange !== 'all') {
            results = results.filter(p => {
                const price = p.lowestResellPrice?.stockX || p.retailPrice || 0;
                if (filters.priceRange === 'low') return price < 100;
                if (filters.priceRange === 'mid') return price >= 100 && price <= 200;
                if (filters.priceRange === 'high') return price > 200;
                return true;
            });
        }

        if (filters.sortBy) {
            if (filters.sortBy === 'price_asc') {
                results.sort((a, b) =>
                    (a.lowestResellPrice?.stockX || 0) - (b.lowestResellPrice?.stockX || 0)
                );
            } else if (filters.sortBy === 'price_desc') {
                results.sort((a, b) =>
                    (b.lowestResellPrice?.stockX || 0) - (a.lowestResellPrice?.stockX || 0)
                );
            }
        }
    }

    return results.slice(0, limit);
}

// Get product by styleID
export const getProductByStyleID = async (styleID: string): Promise<Sneaker | null> => {
    const redis = await getRedisClient();
    const cacheKey = `product:${styleID}`;

    try {
        if (redis) {
            const cached = await redis.get(cacheKey);
            if (cached) {
                console.log(`Cache hit for product: ${styleID}`);
                return JSON.parse(cached);
            }
        }
    } catch (error) {
        console.error('Redis error:', error);
    }

    return new Promise((resolve) => {
        sneaks.getProductPrices(styleID, async (err: any, product: any) => {
            if (err || !product) {
                console.error(`Error fetching product ${styleID}:`, err);
                resolve(null);
                return;
            }

            const formattedProduct: Sneaker = {
                styleID: product.styleID,
                shoeName: product.shoeName,
                brand: product.brand,
                silhoutte: product.silhoutte,
                colorway: product.colorway || 'N/A',
                retailPrice: product.retailPrice,
                thumbnail: product.thumbnail,
                imageLinks: product.imageLinks || [],
                lowestResellPrice: product.lowestResellPrice || {},
                resellLinks: product.resellLinks || {},
                description: product.description,
                urlKey: product.urlKey
            };

            try {
                if (redis) {
                    await redis.set(cacheKey, JSON.stringify(formattedProduct), { EX: CACHE_EXPIRATION });
                }
            } catch (error) {
                console.error('Redis set error:', error);
            }

            resolve(formattedProduct);
        });
    });
};
