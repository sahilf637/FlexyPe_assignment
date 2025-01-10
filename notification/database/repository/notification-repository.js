const Notification = require("./../model/notificatin");
const { APIError, STATUS_CODES } = require("./../../utils/app-error");

class NotifcationRepository {
  async createNotification({ ip_address, timestamp, reason }) {
    try {
      const newNotification = new Notification({
        ip_address,
        timestamp,
        reason,
      });

      const notification = await newNotification.save();
      return notification;
    } catch (error) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Create Notification",
      );
    }
  }

  async getAllNotifications() {
    try {
      const notifications = await Notification.find();

      return notifications;
    } catch (error) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to find Notifications",
      );
    }
  }
}

module.exports = NotifcationRepository;
