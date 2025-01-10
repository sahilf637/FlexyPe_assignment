const cors = require("cors");
const express = require("express");
const morgan = require("morgan");
const { CreateChannel } = require("./utils");
const notificationApi = require("./api/notificationApi");

module.exports = async (app) => {
  const channel = await CreateChannel();

  app.use(express.json());

  app.use(morgan("dev"));

  app.use(cors());

  notificationApi(app, channel);

  app.use((error, req, res, next) => {
    console.error(error.stack);
    res.status(500).json({
      error: error.message,
    });
  });
};
