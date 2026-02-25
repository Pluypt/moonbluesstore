
import getRedisClient from './redis';
import { Sneaker } from '@/types/sneaker';
import { searchMockData } from './mockData';
import { cacheProducts, searchCachedProducts } from './productCache';

// Singleton Logic to prevent Mongoose OverwriteModelError in Next.js Dev (HMR)
// The error "Cannot overwrite Sneaker model" happens because sneaks-api defines a model on import.
// We must avoid re-importing (re-requiring) 'sneaks-api' if it's already loaded in the process.

// We need to access mongoose directly to clear the model if it exists
const mongoose = require('mongoose');

declare global {
    var SneaksAPIClass: any;
    var sneaksInstance: any;
}

let SneaksAPI;

if (global.SneaksAPIClass) {
    SneaksAPI = global.SneaksAPIClass;
} else {
    // CRITICAL: Before requiring sneaks-api, check if 'Sneaker' model exists in Mongoose and delete it!
    // sneaks-api attempts to define 'Sneaker' model on load. If it exists, it throws OverwriteModelError.
    if (mongoose.models && mongoose.models.Sneaker) {
        delete mongoose.models.Sneaker;
    }

    // Only require if not globally cached
    SneaksAPI = require('sneaks-api');
    global.SneaksAPIClass = SneaksAPI;
}

export const sneaks = global.sneaksInstance || new SneaksAPI();
if (!global.sneaksInstance) global.sneaksInstance = sneaks;
const CACHE_EXPIRATION = 3600; // 1 hour

export interface ProductFilters {
    brand?: string | null;
    priceRange?: string | null;
    sortBy?: string;
}

export const getProducts = async (
    keyword: string,
    limit: number = 20,
    page: number = 1,
    filters?: ProductFilters
): Promise<Sneaker[]> => {
    console.log(`[GETPRODUCTS] Searching for: "${keyword}"`);
    
    // Strategy:
    // 1. Try sneaks-api first
    // 2. If fails, try Firebase cache
    // 3. If no cache, use mock data
    
    const searchKeyword = keyword && keyword.trim() !== '' ? keyword : 'jordan';
    
    // Try sneaks-api first
    try {
        console.log(`[SNEAKS] Attempting to fetch from sneaks-api...`);
        const apiResults = await fetchFromSneaksAPI(searchKeyword, limit);
        
        if (apiResults && apiResults.length > 0) {
            console.log(`[SNEAKS SUCCESS] Got ${apiResults.length} products from API`);
            
            // Cache to Firebase for future use (async, don't wait)
            cacheProducts(apiResults).catch(err => 
                console.error('[CACHE] Failed to save to Firebase:', err)
            );
            
            // Apply filters and return
            return applyFilters(apiResults, filters, limit);
        }
    } catch (error) {
        console.error('[SNEAKS ERROR] API failed:', error);
    }
    
    // Fallback to Firebase cache
    console.log(`[FIREBASE] Trying Firebase cache...`);
    const cachedResults = await searchCachedProducts(searchKeyword, limit * 2);
    
    if (cachedResults && cachedResults.length > 0) {
        console.log(`[FIREBASE SUCCESS] Got ${cachedResults.length} products from cache`);
        return applyFilters(cachedResults, filters, limit);
    }
    
    // Final fallback to mock data
    console.log(`[MOCK] Using mock data as final fallback`);
    const mockResults = searchMockData(searchKeyword, limit * 2);
    return applyFilters(mockResults, filters, limit);
};

// Helper function to fetch from sneaks-api
async function fetchFromSneaksAPI(keyword: string, limit: number): Promise<Sneaker[]> {
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            reject(new Error('API timeout after 10 seconds'));
        }, 10000);

        sneaks.getProducts(keyword, limit, (err: any, products: any[]) => {
            clearTimeout(timeout);
            
            if (err) {
                reject(err);
                return;
            }

            if (!products || !Array.isArray(products) || products.length === 0) {
                reject(new Error('No products returned'));
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

// Helper function to apply filters
function applyFilters(products: Sneaker[], filters?: ProductFilters, limit: number = 20): Sneaker[] {
    let results = [...products];
    
    if (filters) {
        // Brand filter
        if (filters.brand && filters.brand !== "All") {
            results = results.filter(p =>
                p.brand?.toLowerCase().includes(filters.brand!.toLowerCase())
            );
        }

        // Price range filter
        if (filters.priceRange && filters.priceRange !== 'all') {
            results = results.filter(p => {
                const price = p.lowestResellPrice?.stockX || p.retailPrice || 0;
                if (filters.priceRange === 'low') return price < 100;
                if (filters.priceRange === 'mid') return price >= 100 && price <= 200;
                if (filters.priceRange === 'high') return price > 200;
                return true;
            });
        }

        // Sorting
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


export const getProductByStyleID = async (styleID: string): Promise<Sneaker | null> => {
    const redis = await getRedisClient();
    const cacheKey = `product:${styleID}`;
    /* ORIGINAL CODE - Temporarily disabled
    const redis = await getRedisClient();
    // Include filters in cache key for unique caching
    const filterKey = filters ? `${filters.brand || 'all'}:${filters.priceRange || 'all'}:${filters.sortBy || 'newest'}` : 'default';
    const cacheKey = `search:${keyword}:${limit}:${page}:${filterKey}`;

    try {
        if (redis) {
            const cached = await redis.get(cacheKey);
            if (cached) {
                console.log(`Cache hit for keyword: ${keyword} page: ${page}`);
                return JSON.parse(cached);
            }
        }
    } catch (error) {
        console.error('Redis error:', error);
    }

    // We strictly follow the API documentation example to ensure stability
    // sneaks.getProducts(keyword, limit, callback)
    // For pagination, we try to fetch more and slice, but cap it to 80
    const fetchCount = limit; // Default limit for stability - user reported paging issues
    // If page > 1, we try to fetch more
    // const fetchCount = Math.min(page * limit + 20, 80);

    console.log(`Calling sneaks.getProducts("${keyword}", ${fetchCount})`);

    // If keyword is empty, use a popular default search term to show products
    const searchKeyword = keyword && keyword.trim() !== '' ? keyword : 'jordan';

    return new Promise((resolve, reject) => {
        console.log(`[SNEAKS] Searching for: "${searchKeyword}" with limit: ${fetchCount}`);
        
        sneaks.getProducts(searchKeyword, fetchCount, async function (err: any, products: any[]) {
            if (err) {
                console.error(`[SNEAKS ERROR] Failed to fetch products for "${searchKeyword}":`, err);
                console.log(`[SNEAKS] Using mock data as fallback`);
                
                // Use mock data as fallback
                const mockResults = searchMockData(searchKeyword, limit);
                resolve(mockResults);
                return;
            }

            // Check if products is valid
            if (!products || !Array.isArray(products)) {
                console.warn(`[SNEAKS WARNING] No products array returned for "${searchKeyword}"`);
                console.log(`[SNEAKS] Using mock data as fallback`);
                
                // Use mock data as fallback
                const mockResults = searchMockData(searchKeyword, limit);
                resolve(mockResults);
                return;
            }

            console.log(`[SNEAKS SUCCESS] Returned ${products.length} products for "${searchKeyword}"`);

            // If no results from API, use mock data
            if (products.length === 0) {
                console.warn(`[SNEAKS] Zero results for "${searchKeyword}" - using mock data`);
                const mockResults = searchMockData(searchKeyword, limit);
                resolve(mockResults);
                return;
            }

            try {
                let formattedProducts: Sneaker[] = products.map(p => ({
                    styleID: p.styleID,
                    shoeName: p.shoeName,
                    brand: p.brand,
                    silhoutte: p.silhoutte,
                    colorway: p.colorway || 'N/A', // Ensure fallback
                    retailPrice: p.retailPrice,
                    thumbnail: p.thumbnail,
                    imageLinks: p.imageLinks || [],
                    lowestResellPrice: p.lowestResellPrice || {},
                    resellLinks: p.resellLinks || {},
                    description: p.description,
                    urlKey: p.urlKey
                }));

                // Apply filters if provided
                if (filters) {
                    // Brand filter
                    if (filters.brand && filters.brand !== "All") {
                        formattedProducts = formattedProducts.filter(p =>
                            p.brand?.toLowerCase().includes(filters.brand!.toLowerCase())
                        );
                    }

                    // Price range filter (Convert THB to USD approximately: 1 USD = 35 THB)
                    if (filters.priceRange && filters.priceRange !== 'all') {
                        formattedProducts = formattedProducts.filter(p => {
                            const price = p.lowestResellPrice?.stockX || p.retailPrice || 0;
                            // Convert price ranges from THB to USD
                            // ต่ำกว่า ฿3,500 = < $100
                            // ฿3,500 - ฿7,000 = $100 - $200
                            // มากกว่า ฿7,000 = > $200
                            if (filters.priceRange === 'low') return price < 100;
                            if (filters.priceRange === 'mid') return price >= 100 && price <= 200;
                            if (filters.priceRange === 'high') return price > 200;
                            return true;
                        });
                    }

                    // Sorting
                    if (filters.sortBy) {
                        if (filters.sortBy === 'price_asc') {
                            formattedProducts.sort((a, b) =>
                                (a.lowestResellPrice?.stockX || 0) - (b.lowestResellPrice?.stockX || 0)
                            );
                        } else if (filters.sortBy === 'price_desc') {
                            formattedProducts.sort((a, b) =>
                                (b.lowestResellPrice?.stockX || 0) - (a.lowestResellPrice?.stockX || 0)
                            );
                        }
                    }
                }

                // Pagination Logic
                // If we fetched more than limit, we should slice.
                // But currently we forced fetchCount = limit for stability.
                // So we just return what we got.
                const paginatedProducts = formattedProducts;

                try {
                    if (redis) {
                        await redis.set(cacheKey, JSON.stringify(paginatedProducts), { EX: CACHE_EXPIRATION });
                    }
                } catch (error) {
                    console.error('Redis set error:', error);
                }

                resolve(paginatedProducts);
            } catch (innerError) {
                console.error("Error processing products:", innerError);
                resolve([]);
            }
        });
    });
    */
};


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

    return new Promise((resolve, reject) => {
        sneaks.getProductPrices(styleID, async (err: any, product: any) => {
            if (err) {
                console.error(`Error fetching product details for ${styleID}:`, err);
                resolve(null);
            } else {
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
            }
        });
    });
};
