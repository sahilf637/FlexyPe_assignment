const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  ip_address: String,
  timestamp: String,
  reason: String,
});

module.exports = mongoose.model("Notification", notificationSchema);
