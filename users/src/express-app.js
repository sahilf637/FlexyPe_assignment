const cors = require("cors");
const express = require("express");
const morgan = require("morgan");
const userApi = require("./api/userApi");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const { CreateChannel } = require("./utils");

module.exports = async (app) => {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests, please try again later.",
  });

  const channel = await CreateChannel();

  app.use(limiter);
  app.use(express.json());

  app.use(morgan("dev"));

  app.use(cors());

  userApi(app, channel);

  app.use((error, req, res, next) => {
    console.error(error.stack);
    res.status(500).json({
      error: error.message,
    });
  });
};
