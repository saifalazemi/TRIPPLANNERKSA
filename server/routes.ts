import type { Express } from "express";
import { createServer, type Server } from "node:http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Push notification endpoints
  app.post("/api/notifications/register", async (req, res) => {
    try {
      const { deviceId, token, platform } = req.body;

      if (!deviceId || !token || !platform) {
        return res.status(400).json({
          error: "Missing required fields: deviceId, token, platform",
        });
      }

      const notificationToken = await storage.createOrUpdateNotificationToken({
        deviceId,
        token,
        platform,
      });

      res.json({
        success: true,
        data: notificationToken,
      });
    } catch (error) {
      console.error("Failed to register push token:", error);
      res.status(500).json({
        error: "Failed to register push notification token",
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
