import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

// Use UPSTASH_REDIS_URL in production, otherwise local Redis.
// Note: BullMQ requires a standard TCP connection (rediss://...) not the REST API.
const redisConnectionUrl = process.env.UPSTASH_REDIS_URL || process.env.REDIS_URL;

export const redisClient = redisConnectionUrl
    ? new Redis(redisConnectionUrl, {
        maxRetriesPerRequest: null,
        ...(redisConnectionUrl.startsWith('rediss://') ? { tls: { rejectUnauthorized: false } } : {})
    })
    : new Redis({
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: process.env.REDIS_PORT || 6379,
        maxRetriesPerRequest: null
    });

redisClient.on('connect', () => {
    console.log(`✅ Redis Connected successfully! (${redisConnectionUrl ? 'Production' : 'Local'})`);
});

redisClient.on('error', (err) => {
    console.error('❌ Redis Connection Error:', err);
});
