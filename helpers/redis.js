import { createClient } from 'redis';

const redisUrl = process.env.REDIS_URL || undefined;

let client;

export function getRedisClient() {
  if (!client) {
    client = createClient(redisUrl ? { url: redisUrl } : {});
  }
  return client;
}

export async function connectRedis() {
  const c = getRedisClient();
  if (!c.isOpen) {
    await c.connect();
  }
  return c;
}
