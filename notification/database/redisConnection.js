const redis = require("redis");
const { REDIS_URL, REDIS_PORT } = require("./../config");

let client;

module.exports = async () => {
  if (!client) {
    try {
      client = redis.createClient({
        host: REDIS_URL,
        port: REDIS_PORT,
      });

      client.on("connect", () => {
        console.log("Connected to Redis");
      });

      client.on("error", (err) => {
        console.error("Redis connection error:", err);
      });

      await client.connect();

      console.log("Redis client ready.");
    } catch (error) {
      console.error("Error connecting to Redis:", error);
      throw error;
    }
  }
  return client;
};
