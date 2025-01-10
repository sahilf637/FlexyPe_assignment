const { MSG_QUEUE_URL, EXCHANGE_NAME } = require("./../config");
const amqp = require("amqplib"); // Use 'amqplib' for Promises

module.exports.CreateChannel = async () => {
  try {
    const url = MSG_QUEUE_URL;

    console.log(`Connecting to RabbitMQ at ${url}...`);

    const connection = await amqp.connect(url); // Use `await` for Promises
    console.log("Connected to RabbitMQ successfully.");

    const channel = await connection.createChannel();
    const queueName = process.env.QUEUE_NAME || "default_queue";
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

module.exports.SubscribeMessage = async (channel, service) => {
  try {
    await channel.assertExchange(EXCHANGE_NAME, "direct", { durable: true });
    const q = await channel.assertQueue("", { exclusive: true });
    console.log(`Waiting for messages in queue: ${q.queue}`);

    channel.bindQueue(q.queue, EXCHANGE_NAME, "rejection");

    channel.consume(
      q.queue,
      (msg) => {
        if (msg.content) {
          console.log("The message is:", msg.content.toString());
          service.SubscribeEvents(msg.content.toString());
        }
        console.log("[X] Received");
      },
      { noAck: true },
    );
  } catch (err) {
    console.error("Failed to subscribe to messages:", err);
    throw err;
  }
};
