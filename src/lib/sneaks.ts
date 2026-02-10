
const SneaksAPI = require('sneaks-api');
import getRedisClient from './redis';
import { Sneaker } from '@/types/sneaker';

const sneaks = new SneaksAPI();
const CACHE_EXPIRATION = 3600; // 1 hour

export const getProducts = async (keyword: string, limit: number = 10): Promise<Sneaker[]> => {
    const redis = await getRedisClient();
    const cacheKey = `search:${keyword}:${limit}`;

    try {
        if (redis) {
            const cached = await redis.get(cacheKey);
            if (cached) {
                console.log(`Cache hit for keyword: ${keyword}`);
                return JSON.parse(cached);
            }
        }
    } catch (error) {
        console.error('Redis error:', error);
    }

    return new Promise((resolve, reject) => {
        sneaks.getProducts(keyword, limit, async (err: any, products: any[]) => {
            if (err) {
                console.error(`Error fetching products for ${keyword}:`, err);
                resolve([]);
            } else {
                const formattedProducts: Sneaker[] = products.map(p => ({
                    styleID: p.styleID,
                    shoeName: p.shoeName,
                    brand: p.brand,
                    silhoutte: p.silhoutte,
                    colorway: p.colorway,
                    retailPrice: p.retailPrice,
                    thumbnail: p.thumbnail,
                    imageLinks: p.imageLinks || [], // Ensure array
                    lowestResellPrice: p.lowestResellPrice || {}, // Ensure object
                    resellLinks: p.resellLinks || {},
                    description: p.description,
                    urlKey: p.urlKey
                }));

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
