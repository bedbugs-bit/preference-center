import { createClient } from 'redis';
import logger from './logger.js';

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379', 
});

redisClient.on('error', (err) => {
  logger.error(`Redis error: ${err.message}`);
});

redisClient.on('connect', () => {
  logger.info('Connected to Redis');
});

await redisClient.connect(); 

export default redisClient;
