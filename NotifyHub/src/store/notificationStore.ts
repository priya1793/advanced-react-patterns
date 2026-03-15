import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import type { Notification } from "../types/notification";

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isDropdownOpen: boolean;

  setInitial: (notifications: Notification[]) => void;
  addNotification: (n: Notification) => void;
  markAsRead: (id: string) => void;
  markAllRead: () => void;
  toggleDropdown: () => void;
  closeDropdown: () => void;
}

export const useNotificationStore = create<NotificationState>()(
  subscribeWithSelector((set) => ({
    notifications: [],
    unreadCount: 0,
    isDropdownOpen: false,

    setInitial: (notifications) =>
      set({
        notifications,
        unreadCount: notifications.filter((n) => !n.isRead).length,
      }),

    addNotification: (n) =>
      set((state) => ({
        notifications: [n, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      })),

    markAsRead: (id) =>
      set((state) => {
        const target = state.notifications.find((n) => n.id === id);
        if (!target || target.isRead) return state;
        return {
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, isRead: true } : n,
          ),
          unreadCount: Math.max(0, state.unreadCount - 1),
        };
      }),

    markAllRead: () =>
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        unreadCount: 0,
      })),

    toggleDropdown: () =>
      set((state) => ({ isDropdownOpen: !state.isDropdownOpen })),

    closeDropdown: () => set({ isDropdownOpen: false }),
  })),
);
