const NotificationRepository = require("./../database/repository/notification-repository");

class NotificationService {
  constructor() {
    this.repository = new NotificationRepository();
  }

  async createNotification({ ip_address, timestamp, reason }) {
    try {
      const data = await this.repository.createNotification({
        ip_address,
        timestamp,
        reason,
      });

      return data;
    } catch (error) {
      throw new APIError("Can't Create Notification", error);
    }
  }

  async getAllNotifications() {
    try {
      const data = await this.repository.getAllNotifications();
      return data;
    } catch (error) {
      throw new APIError("Can't Get Notifications", error);
    }
  }

  async SubscribeEvents(payload) {}
}

module.exports = NotificationService;
