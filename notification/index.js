const express = require("express");
const expressApp = require("./express-app");
const { PORT } = require("./config");
const { connectDB } = require("./database");

const startServer = async () => {
  const app = express();

  expressApp(app);

  await connectDB();

  app
    .listen(PORT, () => {
      console.log(`Notification Service has Started at ${PORT}`);
    })
    .on("error", (err) => {
      console.log(err.message);
      process.exit();
    });
};

startServer();
