import { z } from "zod";

export const NotificationTypeEnum = z.enum([
  "like",
  "comment",
  "mention",
  "share",
  "friend_request",
]);

export const ActorSchema = z.object({
  name: z.string(),
  avatar: z.string(),
});

export const NotificationSchema = z.object({
  id: z.string(),
  actor: ActorSchema,
  content: z.string(),
  timestamp: z.coerce.date(),
  isRead: z.boolean(),
  type: NotificationTypeEnum,
});

export type NotificationType = z.infer<typeof NotificationTypeEnum>;
export type Actor = z.infer<typeof ActorSchema>;
export type Notification = z.infer<typeof NotificationSchema>;
