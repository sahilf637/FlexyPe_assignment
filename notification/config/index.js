const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  PORT: process.env.PORT,
  DB_URL: process.env.DB_URL,
  MSG_QUEUE_URL: process.env.MSG_QUEUE_URL,
  EXCHANGE_NAME: process.env.EXCHANGE_NAME,
  REDIS_URL: process.env.REDIS_URL,
  REDIS_PORT: process.env.REDIS_PORT,
  SMTP_SERVICE: process.env.SMTP_SERVICE,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
};
