import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const notificationTokens = pgTable("notification_tokens", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  deviceId: varchar("device_id").notNull().unique(),
  token: text("token").notNull(),
  platform: varchar("platform", { length: 10 }).notNull(), // ios or android
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertNotificationTokenSchema = createInsertSchema(
  notificationTokens
).pick({
  deviceId: true,
  token: true,
  platform: true,
});

export type NotificationToken = typeof notificationTokens.$inferSelect;
export type InsertNotificationToken = z.infer<
  typeof insertNotificationTokenSchema
>;
