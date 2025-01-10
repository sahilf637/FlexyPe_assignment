const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { APP_SECRET, MSG_QUEUE_URL, EXCHANGE_NAME } = require("./../config");
const amqp = require("amqplib");

module.exports.generateSalt = async () => {
  return await bcrypt.genSalt();
};

module.exports.hashPassword = async (password, salt) => {
  return await bcrypt.hash(password, salt);
};

module.exports.validatePassword = async (
  enteredPassword,
  savedPassword,
  salt,
) => {
  const hashedPassword = await this.hashPassword(enteredPassword, salt);
  return hashedPassword === savedPassword;
};

module.exports.generateSignature = async (payload) => {
  return await jwt.sign(payload, APP_SECRET, { expiresIn: "2d" });
};

module.exports.validateSignature = async (req) => {
  const signature = req.get("Authorization");

  if (signature) {
    const payload = await jwt.verify(signature.split(" ")[1], APP_SECRET);
    req.user = payload;
    return true;
  }

  return false;
};

module.exports.FormateData = (data) => {
  if (data) {
    return data;
  } else {
    throw new Error("Data Not found!");
  }
};

module.exports.CreateChannel = async () => {
  try {
    const url = MSG_QUEUE_URL;

    console.log(`Connecting to RabbitMQ at ${url}...`);

    const connection = await amqp.connect(url); // Use `await` for Promises
    console.log("Connected to RabbitMQ successfully.");

    const channel = await connection.createChannel();
    const queueName = "default_queue";
    await channel.assertQueue(queueName, { durable: true });

    console.log(`Queue '${queueName}' is ready.`);
    return channel;
  } catch (err) {
    console.error("Failed to connect to RabbitMQ:", err);
    if (err.code === "ETIMEDOUT") {
      console.error(
        "Connection timed out. Check your network and RabbitMQ instance status.",
      );
    } else if (err.code === "ECONNREFUSED") {
      console.error(
        "Connection refused. Verify your RabbitMQ URL and credentials.",
      );
    } else if (err.code === "ENOTFOUND") {
      console.error("Hostname not found. Verify your CloudAMQP hostname.");
    }
    throw err;
  }
};

module.exports.PublishMessage = (channel, service, msg) => {
  channel.publish(EXCHANGE_NAME, service, Buffer.from(msg));
  console.log("Sent: ", msg);
};
