import { Redis } from '@upstash/redis'

// Initialize Redis client
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
})

// Helper function to test the connection
export async function testRedisConnection() {
  try {
    await redis.set("foo", "bar");
    const value = await redis.get("foo");
    console.log("Redis connection successful, retrieved value:", value);
    return true;
  } catch (error) {
    console.error("Redis connection failed:", error);
    return false;
  }
} 