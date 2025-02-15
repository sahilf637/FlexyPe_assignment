const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  PORT: process.env.PORT,
  DB_URL: process.env.DB_URL,
  APP_SECRET: process.env.APP_SECRET,
  MSG_QUEUE_URL: process.env.MSG_QUEUE_URL,
  EXCHANGE_NAME: process.env.EXCHANGE_NAME,
};
