import { Queue } from 'bullmq';
import { redisClient } from '../config/redisClient.js';

export const aiQueue = new Queue('ai-tasks', {
    connection: redisClient,
});
