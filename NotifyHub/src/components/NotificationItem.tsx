import { memo, useCallback, type CSSProperties } from "react";
import type { Notification } from "../types/notification";
import { NotificationAvatar } from "./NotificationAvatar";
import { useNotificationStore } from "../store/notificationStore";
import { formatTimeAgo } from "../lib/timeUtils";

interface Props {
  notification: Notification;
}

const baseStyle: CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: 12,
  padding: "12px 14px",
  cursor: "pointer",
  transition: "background 150ms, transform 100ms",
  borderRadius: "var(--radius-inner)",
  position: "relative",
};

const unreadDotStyle: CSSProperties = {
  width: 10,
  height: 10,
  borderRadius: "50%",
  background: "hsl(217 100% 52%)",
  flexShrink: 0,
  marginTop: 8,
  boxShadow: "0 0 0 2px var(--surface-color)",
};

export const NotificationItem = memo(function NotificationItem({
  notification,
}: Props) {
  const markAsRead = useNotificationStore((s) => s.markAsRead);

  const handleClick = useCallback(() => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
  }, [notification.id, notification.isRead, markAsRead]);

  const itemStyle: CSSProperties = {
    ...baseStyle,
    background: notification.isRead ? "transparent" : "hsl(var(--unread-bg))",
  };

  return (
    <div
      className="notification-item-enter"
      style={itemStyle}
      onClick={handleClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = notification.isRead
          ? "var(--hover-bg-solid)"
          : "hsl(var(--unread-bg))";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = notification.isRead
          ? "transparent"
          : "hsl(var(--unread-bg))";
      }}
      role="button"
      tabIndex={0}
      aria-label={`${notification.actor.name} ${notification.content}`}
    >
      <NotificationAvatar
        initials={notification.actor.avatar}
        type={notification.type}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontSize: "0.8125rem",
            lineHeight: 1.5,
            color: "var(--text-main-color)",
            margin: 0,
          }}
        >
          <strong style={{ fontWeight: 700 }}>{notification.actor.name}</strong>{" "}
          {notification.content}
        </p>
        <p
          style={{
            fontSize: "0.75rem",
            color: notification.isRead
              ? "var(--text-muted-color)"
              : "hsl(217 100% 52%)",
            marginTop: 3,
            fontWeight: notification.isRead ? 400 : 600,
          }}
        >
          {formatTimeAgo(notification.timestamp)}
        </p>
      </div>
      {!notification.isRead && <div style={unreadDotStyle} />}
    </div>
  );
});
