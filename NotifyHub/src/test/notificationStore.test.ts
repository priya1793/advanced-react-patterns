import { describe, it, expect, beforeEach } from "vitest";
import { useNotificationStore } from "../store/notificationStore";
import type { Notification } from "../types/notification";

const makeNotification = (
  overrides: Partial<Notification> = {},
): Notification => ({
  id: "n1",
  actor: { name: "Alice", avatar: "AL" },
  content: "liked your post",
  timestamp: new Date(),
  isRead: false,
  type: "like",
  ...overrides,
});

describe("notificationStore", () => {
  beforeEach(() => {
    useNotificationStore.setState({
      notifications: [],
      unreadCount: 0,
      isDropdownOpen: false,
    });
  });

  it("setInitial populates notifications and calculates unread count", () => {
    const items = [
      makeNotification({ id: "1", isRead: false }),
      makeNotification({ id: "2", isRead: true }),
      makeNotification({ id: "3", isRead: false }),
    ];
    useNotificationStore.getState().setInitial(items);
    const state = useNotificationStore.getState();
    expect(state.notifications).toHaveLength(3);
    expect(state.unreadCount).toBe(2);
  });

  it("addNotification prepends and increments unread", () => {
    const n = makeNotification({ id: "new1" });
    useNotificationStore.getState().addNotification(n);
    const state = useNotificationStore.getState();
    expect(state.notifications[0].id).toBe("new1");
    expect(state.unreadCount).toBe(1);
  });

  it("markAsRead marks a notification read and decrements count", () => {
    useNotificationStore
      .getState()
      .setInitial([makeNotification({ id: "1", isRead: false })]);
    useNotificationStore.getState().markAsRead("1");
    const state = useNotificationStore.getState();
    expect(state.notifications[0].isRead).toBe(true);
    expect(state.unreadCount).toBe(0);
  });

  it("markAsRead does nothing for already-read notification", () => {
    useNotificationStore
      .getState()
      .setInitial([makeNotification({ id: "1", isRead: true })]);
    useNotificationStore.getState().markAsRead("1");
    expect(useNotificationStore.getState().unreadCount).toBe(0);
  });

  it("markAsRead does nothing for non-existent id", () => {
    useNotificationStore
      .getState()
      .setInitial([makeNotification({ id: "1", isRead: false })]);
    useNotificationStore.getState().markAsRead("unknown");
    expect(useNotificationStore.getState().unreadCount).toBe(1);
  });

  it("markAllRead sets all to read and resets count", () => {
    useNotificationStore
      .getState()
      .setInitial([
        makeNotification({ id: "1", isRead: false }),
        makeNotification({ id: "2", isRead: false }),
      ]);
    useNotificationStore.getState().markAllRead();
    const state = useNotificationStore.getState();
    expect(state.notifications.every((n) => n.isRead)).toBe(true);
    expect(state.unreadCount).toBe(0);
  });

  it("toggleDropdown flips isDropdownOpen", () => {
    expect(useNotificationStore.getState().isDropdownOpen).toBe(false);
    useNotificationStore.getState().toggleDropdown();
    expect(useNotificationStore.getState().isDropdownOpen).toBe(true);
    useNotificationStore.getState().toggleDropdown();
    expect(useNotificationStore.getState().isDropdownOpen).toBe(false);
  });

  it("closeDropdown sets isDropdownOpen to false", () => {
    useNotificationStore.setState({ isDropdownOpen: true });
    useNotificationStore.getState().closeDropdown();
    expect(useNotificationStore.getState().isDropdownOpen).toBe(false);
  });
});
