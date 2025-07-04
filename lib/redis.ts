import { Redis } from '@upstash/redis'

// Initialize Redis client
export const redis = new Redis({
  url: 'https://stirring-weevil-16969.upstash.io',
  token: 'AUJJAAIjcDE2Y2QyOGE2YzBlYzE0NTFlYmU4MGQzOGJmYmFiNTU3YXAxMA',
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