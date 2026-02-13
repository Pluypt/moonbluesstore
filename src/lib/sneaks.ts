
const SneaksAPI = require('sneaks-api');
import getRedisClient from './redis';
import { Sneaker } from '@/types/sneaker';

const sneaks = new SneaksAPI();
const CACHE_EXPIRATION = 3600; // 1 hour

export interface ProductFilters {
    brand?: string | null;
    priceRange?: string | null;
    sortBy?: string;
}

export const getProducts = async (
    keyword: string,
    limit: number = 10,
    filters?: ProductFilters
): Promise<Sneaker[]> => {
    const redis = await getRedisClient();
    // Include filters in cache key for unique caching
    const filterKey = filters ? `${filters.brand || 'all'}:${filters.priceRange || 'all'}:${filters.sortBy || 'newest'}` : 'default';
    const cacheKey = `search:${keyword}:${limit}:${filterKey}`;

    try {
        if (redis) {
            const cached = await redis.get(cacheKey);
            if (cached) {
                console.log(`Cache hit for keyword: ${keyword} with filters`);
                return JSON.parse(cached);
            }
        }
    } catch (error) {
        console.error('Redis error:', error);
    }

    return new Promise((resolve, reject) => {
        sneaks.getProducts(keyword, limit * 2, async (err: any, products: any[]) => {
            if (err) {
                console.error(`Error fetching products for ${keyword}:`, err);
                resolve([]);
            } else {
                let formattedProducts: Sneaker[] = products.map(p => ({
                    styleID: p.styleID,
                    shoeName: p.shoeName,
                    brand: p.brand,
                    silhoutte: p.silhoutte,
                    colorway: p.colorway,
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

                    // Price range filter
                    if (filters.priceRange && filters.priceRange !== 'all') {
                        formattedProducts = formattedProducts.filter(p => {
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
                            formattedProducts.sort((a, b) =>
                                (a.lowestResellPrice?.stockX || 0) - (b.lowestResellPrice?.stockX || 0)
                            );
                        } else if (filters.sortBy === 'price_desc') {
                            formattedProducts.sort((a, b) =>
                                (b.lowestResellPrice?.stockX || 0) - (a.lowestResellPrice?.stockX || 0)
                            );
                        }
                        // 'newest' is default order from API
                    }
                }

                // Limit results
                formattedProducts = formattedProducts.slice(0, limit);

                try {
                    if (redis) {
                        await redis.set(cacheKey, JSON.stringify(formattedProducts), { EX: CACHE_EXPIRATION });
                    }
                } catch (error) {
                    console.error('Redis set error:', error);
                }

                resolve(formattedProducts);
            }
        });
    });
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
