const NotificationRepository = require("./../database/repository/notification-repository");
const { connectRedis } = require("./../database");
const nodemailer = require("nodemailer");
const { APIError } = require("./../utils/app-error");
const { SMTP_USER, SMTP_PASS, SMTP_SERVICE } = require("./../config");

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

  async sendAlertMail(ip, data) {
    try {
      const transporter = nodemailer.createTransport({
        service: SMTP_SERVICE,
        auth: {
          user: SMTP_USER,
          pass: SMTP_PASS,
        },
      });

      const mailOptions = {
        from: SMTP_USER,
        to: "sahilfartyal3@gmail.com",
        subject: `Alert: High Activity from IP ${ip}`,
        html: `
        <h1>High Activity Alert</h1>
        <p>The IP address <b>${ip}</b> has exceeded the allowed number of activity entries.</p>
        <p><b>Details:</b></p>
        <ul>
          ${data
            .map(
              (entry) =>
                `<li><b>Timestamp:</b> ${entry.time}, <b>Reason:</b> ${entry.reason}</li>`,
            )
            .join("")}
        </ul>
        <p>The data for this IP has been cleared.</p>
      `,
      };

      await transporter.sendMail(mailOptions);
    } catch (error) {
      throw new APIError("Error sending alert email:", error);
    }
  }

  async SubscribeEvents(payload) {
    const client = await connectRedis();

    try {
      const { ip, time, reason } = JSON.parse(payload);

      await this.repository.createNotification({
        ip_address: ip,
        timestamp: time,
        reason: reason,
      });

      const existingData = await client.get(ip);

      if (existingData) {
        const parsedData = JSON.parse(existingData);

        parsedData.push({ time, reason });

        if (parsedData.length >= 5) {
          await this.sendAlertMail(ip, parsedData);

          await client.del(ip);
          console.log(`Data for IP ${ip} deleted after sending alert.`);
        } else {
          await client.set(ip, JSON.stringify(parsedData), {
            EX: 600,
          });
        }
      } else {
        const newData = [{ time, reason }];
        await client.set(ip, JSON.stringify(newData), {
          EX: 600,
        });
      }

      console.log(`Updated data for IP: ${ip}`);
    } catch (error) {
      throw new APIError("Error updating Redis entry:", error);
    }
  }
}

module.exports = NotificationService;
