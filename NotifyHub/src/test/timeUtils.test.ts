import { describe, it, expect, vi, afterEach } from "vitest";
import { formatTimeAgo } from "../lib/timeUtils";

describe("formatTimeAgo", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns "Just now" for less than 60 seconds', () => {
    const now = new Date();
    expect(formatTimeAgo(now)).toBe("Just now");
  });

  it("returns minutes ago", () => {
    const date = new Date(Date.now() - 5 * 60 * 1000);
    expect(formatTimeAgo(date)).toBe("5m ago");
  });

  it("returns hours ago", () => {
    const date = new Date(Date.now() - 3 * 60 * 60 * 1000);
    expect(formatTimeAgo(date)).toBe("3h ago");
  });

  it("returns days ago", () => {
    const date = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
    expect(formatTimeAgo(date)).toBe("2d ago");
  });

  it("returns formatted date for 7+ days", () => {
    const date = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);
    const result = formatTimeAgo(date);
    // Should be a locale date string, not relative
    expect(result).not.toContain("ago");
    expect(result).not.toBe("Just now");
  });
});
