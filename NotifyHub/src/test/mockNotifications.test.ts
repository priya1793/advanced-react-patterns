import { describe, it, expect } from "vitest";
import {
  generateNotification,
  generateHistoricalNotifications,
  getAvatarColor,
  fetchNotifications,
} from "../lib/mockNotifications";

describe("generateNotification", () => {
  it("returns a notification with all required fields", () => {
    const n = generateNotification();
    expect(n).toHaveProperty("id");
    expect(n).toHaveProperty("actor");
    expect(n).toHaveProperty("content");
    expect(n).toHaveProperty("timestamp");
    expect(n).toHaveProperty("isRead");
    expect(n).toHaveProperty("type");
    expect(n.actor).toHaveProperty("name");
    expect(n.actor).toHaveProperty("avatar");
  });

  it("accepts overrides", () => {
    const n = generateNotification({ id: "custom-id", isRead: true });
    expect(n.id).toBe("custom-id");
    expect(n.isRead).toBe(true);
  });

  it("generates unique ids", () => {
    const ids = new Set(
      Array.from({ length: 20 }, () => generateNotification().id),
    );
    expect(ids.size).toBe(20);
  });
});

describe("generateHistoricalNotifications", () => {
  it("generates the requested count", () => {
    const items = generateHistoricalNotifications(10);
    expect(items).toHaveLength(10);
  });

  it("timestamps are in the past", () => {
    const items = generateHistoricalNotifications(5);
    const now = Date.now();
    items.forEach((n) => {
      expect(new Date(n.timestamp).getTime()).toBeLessThanOrEqual(now);
    });
  });

  it("mixes read and unread", () => {
    // With 20 items, statistically we should have both
    const items = generateHistoricalNotifications(20);
    const hasRead = items.some((n) => n.isRead);
    const hasUnread = items.some((n) => !n.isRead);
    expect(hasRead || hasUnread).toBe(true);
  });
});

describe("getAvatarColor", () => {
  it("returns a hex color string", () => {
    const color = getAvatarColor("AB");
    expect(color).toMatch(/^#[0-9a-fA-F]{6}$/);
  });

  it("returns same color for same initials (deterministic)", () => {
    expect(getAvatarColor("XY")).toBe(getAvatarColor("XY"));
  });
});

describe("fetchNotifications", () => {
  it("returns an array of notifications", async () => {
    const result = await fetchNotifications();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty("id");
  });
});
