
import { createClient } from 'redis';

let redisClient: ReturnType<typeof createClient> | null = null;

const getRedisClient = async () => {
    if (redisClient) {
        if (redisClient.isOpen) {
            return redisClient;
        }
    }

    const url = process.env.REDIS_URL || process.env.KV_URL;
    if (!url) {
        console.warn('Redis URL is not defined. Caching is disabled.');
        return null;
    }

    try {
        const client = createClient({
            url: url,
        });

        client.on('error', (err) => console.error('Redis Client Error', err));

        await client.connect();
        redisClient = client;
        return redisClient;
    } catch (error) {
        console.error('Failed to connect to Redis:', error);
        return null;
    }
};

export default getRedisClient;
