import {
  useMemo,
  useCallback,
  useEffect,
  useRef,
  type CSSProperties,
} from "react";
import { useNotificationStore } from "../store/notificationStore";
import { NotificationItem } from "./NotificationItem";
import { NotificationSkeleton } from "./NotificationSkeleton";
import { NotificationErrorBoundary } from "./NotificationErrorBoundary";

interface Props {
  isLoading: boolean;
}

const dropdownStyle: CSSProperties = {
  position: "absolute",
  top: "calc(100% + 10px)",
  right: -8,
  width: 380,
  maxHeight: 500,
  background: "var(--surface-color)",
  borderRadius: "var(--radius-outer)",
  boxShadow: "0 8px 30px rgba(0,0,0,0.15), 0 0 0 1px var(--border-color)",
  overflow: "hidden",
  zIndex: 1000,
  transition: "background 300ms",
};

const headerStyle: CSSProperties = {
  padding: "16px 20px 12px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderBottom: "1px solid var(--border-color)",
};

const groupHeaderStyle: CSSProperties = {
  fontSize: "0.8125rem",
  fontWeight: 700,
  color: "var(--text-muted-color)",
  padding: "12px 16px 6px",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

export function NotificationDropdown({ isLoading }: Props) {
  const notifications = useNotificationStore((s) => s.notifications);
  const isOpen = useNotificationStore((s) => s.isDropdownOpen);
  const closeDropdown = useNotificationStore((s) => s.closeDropdown);
  const markAllRead = useNotificationStore((s) => s.markAllRead);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        const bell = document.getElementById("notification-bell");
        if (bell?.contains(e.target as Node)) return;
        closeDropdown();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen, closeDropdown]);

  const { newItems, earlierItems } = useMemo(() => {
    const newItems = notifications.filter((n) => !n.isRead);
    const earlierItems = notifications.filter((n) => n.isRead);
    return { newItems, earlierItems };
  }, [notifications]);

  const handleMarkAllRead = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      markAllRead();
    },
    [markAllRead],
  );

  if (!isOpen) return null;

  return (
    <div ref={dropdownRef} style={dropdownStyle}>
      <div style={headerStyle}>
        <h2
          style={{
            fontSize: "1.25rem",
            fontWeight: 800,
            margin: 0,
            color: "var(--text-main-color)",
          }}
        >
          Notifications
        </h2>
        <button
          onClick={handleMarkAllRead}
          style={{
            background: "none",
            border: "none",
            color: "hsl(217 100% 52%)",
            cursor: "pointer",
            fontSize: "0.8125rem",
            fontWeight: 600,
            padding: "6px 12px",
            borderRadius: "var(--radius-inner)",
            transition: "background 150ms",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(8,102,255,0.08)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "transparent")
          }
        >
          Mark all read
        </button>
      </div>

      <div
        className="notification-scroll"
        style={{ maxHeight: 430, overflowY: "auto", padding: "4px 6px" }}
      >
        <NotificationErrorBoundary>
          {isLoading ? (
            <>
              {Array.from({ length: 5 }).map((_, i) => (
                <NotificationSkeleton key={i} />
              ))}
            </>
          ) : notifications.length === 0 ? (
            <div
              style={{
                padding: "48px 16px",
                textAlign: "center",
                color: "var(--text-muted-color)",
                fontSize: "0.875rem",
              }}
            >
              <div style={{ fontSize: "2rem", marginBottom: 8 }}>🔔</div>
              No notifications yet
            </div>
          ) : (
            <>
              {newItems.length > 0 && (
                <>
                  <div style={groupHeaderStyle}>New</div>
                  {newItems.map((n) => (
                    <NotificationItem key={n.id} notification={n} />
                  ))}
                </>
              )}
              {earlierItems.length > 0 && (
                <>
                  <div style={groupHeaderStyle}>Earlier</div>
                  {earlierItems.map((n) => (
                    <NotificationItem key={n.id} notification={n} />
                  ))}
                </>
              )}
            </>
          )}
        </NotificationErrorBoundary>
      </div>
    </div>
  );
}
