const userServices = require("./../services/user-service");
const auth = require("./middleware/auth");
const { PublishMessage } = require("./../utils/index");

module.exports = async (app, channel) => {
  const service = new userServices();

  const sendTokenInCookie = (res, token) => {
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    };

    res.cookie("jwt", token, cookieOptions);
  };

  app.post("/api/signup", async (req, res, next) => {
    const { name, email, phone, password } = req.body;

    try {
      const data = await service.SignUp({ name, email, phone, password });
      if (data) {
        sendTokenInCookie(res, data.token);
      }
      res.status(200).json({
        status: "success",
        data: data,
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/signin", async (req, res, next) => {
    const { email, password } = req.body;
    try {
      const data = await service.SignIn({ email, password });
      if (data) {
        sendTokenInCookie(res, data.token);
      }

      res.status(200).json({
        status: "success",
        data: data,
      });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/users", async (req, res, next) => {
    try {
      const data = await service.GetAllUsers();

      res.status(200).json({
        users: data,
      });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/user/:id", async (req, res, next) => {
    try {
      const id = req.params.id;

      if (!id) {
        return res.status(400).json({ error: "User ID is required" });
      }

      const data = await service.GetProfile(id);

      if (!data) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json({
        user: data,
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/submit", async (req, res, next) => {
    try {
      const rejectionReasons = [
        "Invalid request format",
        "Missing required fields",
        "Unauthorized access",
        "Exceeded maximum payload size",
        "Unsupported media type",
        "Duplicate submission",
        "Validation error in input data",
        "Resource not found",
        "Rate limit exceeded",
        "Server is currently unavailable",
      ];

      const probability = Math.random() * 100;
      if (probability < 50) {
        const randomIndex = Math.floor(Math.random() * rejectionReasons.length);
        const rejectionReason = rejectionReasons[randomIndex];

        const ip =
          req.headers["x-forwarded-for"] || req.connection.remoteAddress;
        const time = new Date().toISOString();

        const message = {
          ip,
          time,
          reason: rejectionReason,
        };

        PublishMessage(channel, "rejection", JSON.stringify(message));

        res.status(400).json({
          message: "Submission rejected",
          reason: rejectionReason,
        });
      } else {
        res.status(200).json({
          message: "Submission successfull",
        });
      }
    } catch (error) {
      next(error);
    }
  });
};
