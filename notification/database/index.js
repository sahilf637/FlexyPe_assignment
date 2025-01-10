const connectDB = require("./connection");
const connectRedis = require("./redisConnection");

module.exports = {
  connectDB: connectDB,
  connectRedis: connectRedis,
};
