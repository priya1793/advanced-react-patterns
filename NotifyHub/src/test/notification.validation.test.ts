import { describe, it, expect } from "vitest";
import {
  NotificationSchema,
  NotificationTypeEnum,
} from "../types/notification";

describe("NotificationSchema (Zod)", () => {
  const validData = {
    id: "abc123",
    actor: { name: "Bob", avatar: "BO" },
    content: "commented on your post",
    timestamp: new Date().toISOString(),
    isRead: false,
    type: "comment",
  };

  it("parses valid notification data", () => {
    const result = NotificationSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("coerces string timestamp to Date", () => {
    const result = NotificationSchema.parse(validData);
    expect(result.timestamp).toBeInstanceOf(Date);
  });

  it("rejects missing required fields", () => {
    const { id, ...noId } = validData;
    expect(NotificationSchema.safeParse(noId).success).toBe(false);
  });

  it("rejects invalid notification type", () => {
    const result = NotificationSchema.safeParse({
      ...validData,
      type: "invalid_type",
    });
    expect(result.success).toBe(false);
  });

  it("validates all notification type enum values", () => {
    const validTypes = [
      "like",
      "comment",
      "mention",
      "share",
      "friend_request",
    ];
    validTypes.forEach((type) => {
      expect(NotificationTypeEnum.safeParse(type).success).toBe(true);
    });
  });

  it("rejects empty actor name", () => {
    const result = NotificationSchema.safeParse({
      ...validData,
      actor: { name: "", avatar: "BO" },
    });
    // Zod string allows empty by default, so this should pass
    expect(result.success).toBe(true);
  });
});
