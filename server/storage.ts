import { type NotificationToken, type InsertNotificationToken, notificationTokens } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getNotificationToken(deviceId: string): Promise<NotificationToken | undefined>;
  createOrUpdateNotificationToken(data: InsertNotificationToken & { deviceId: string }): Promise<NotificationToken>;
}

export class DatabaseStorage implements IStorage {
  async getNotificationToken(deviceId: string): Promise<NotificationToken | undefined> {
    const [token] = await db
      .select()
      .from(notificationTokens)
      .where(eq(notificationTokens.deviceId, deviceId));
    return token || undefined;
  }

  async createOrUpdateNotificationToken(data: InsertNotificationToken & { deviceId: string }): Promise<NotificationToken> {
    const existing = await this.getNotificationToken(data.deviceId);
    
    if (existing) {
      const [updated] = await db
        .update(notificationTokens)
        .set({
          token: data.token,
          platform: data.platform,
          updatedAt: new Date(),
        })
        .where(eq(notificationTokens.deviceId, data.deviceId))
        .returning();
      return updated;
    }
    
    const [created] = await db
      .insert(notificationTokens)
      .values(data)
      .returning();
    return created;
  }
}

export const storage = new DatabaseStorage();
