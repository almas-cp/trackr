import { redis } from '../lib/redis';

async function main() {
  try {
    // Set a value in Redis
    await redis.set("foo", "bar");
    console.log("Value set in Redis: foo=bar");
    
    // Get the value from Redis
    const value = await redis.get("foo");
    console.log("Value retrieved from Redis:", value);
    
    // Additional test with JSON data
    const user = {
      id: 1,
      name: "Test User",
      email: "test@example.com"
    };
    
    await redis.json.set("user:1", "$", user);
    console.log("JSON object set in Redis");
    
    const retrievedUser = await redis.json.get("user:1");
    console.log("JSON object retrieved from Redis:", retrievedUser);
  } catch (error) {
    console.error("Redis operation failed:", error);
  }
}

main()
  .then(() => console.log("Redis test completed successfully"))
  .catch(error => console.error("Redis test failed:", error)); 