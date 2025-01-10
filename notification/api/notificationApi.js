const NotificationService = require("../services/notification-service");
const { SubscribeMessage } = require("../utils/index");

module.exports = (app, channel) => {
  const Service = new NotificationService();

  SubscribeMessage(channel, Service);

  app.post("/api/addlog", async (req, res, next) => {
    try {
      const { ip_address, timestamp, reason } = req.body;
      const data = await Service.createNotification({
        ip_address,
        timestamp,
        reason,
      });
      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/getlog", async (req, res, next) => {
    try {
      const data = await Service.getAllNotifications();
      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  });
};
