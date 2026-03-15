import { useEffect, useRef, useCallback } from "react";
import { useNotificationStore } from "../store/notificationStore";
import { generateNotification } from "../lib/mockNotifications";
import { NotificationSchema } from "../types/notification";

/**
 * Simulates a Socket.IO-like real-time notification stream.
 * In production, replace with actual Socket.IO connection.
 */
export function useSocketNotifications() {
  const addNotification = useNotificationStore((s) => s.addNotification);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleIncoming = useCallback(
    (rawData: unknown) => {
      try {
        // Zod validation on incoming data
        const parsed = NotificationSchema.parse(rawData);
        addNotification(parsed);
      } catch (err) {
        console.warn("[Socket] Malformed notification rejected:", err);
      }
    },
    [addNotification],
  );

  useEffect(() => {
    // Simulate new notifications arriving every 8-15 seconds
    const scheduleNext = () => {
      const delay = 8000 + Math.random() * 7000;
      intervalRef.current = setTimeout(() => {
        const raw = generateNotification();
        handleIncoming(raw);
        scheduleNext();
      }, delay);
    };

    scheduleNext();

    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, [handleIncoming]);
}
