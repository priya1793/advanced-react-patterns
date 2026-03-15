import { useCallback, useEffect, useRef, type CSSProperties } from "react";
import { useNotificationStore } from "../store/notificationStore";

const bellContainerStyle: CSSProperties = {
  position: "relative",
  display: "inline-flex",
};

const bellButtonStyle: CSSProperties = {
  width: 40,
  height: 40,
  borderRadius: "50%",
  border: "none",
  background: "transparent",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "background 150ms",
  fontSize: "1.25rem",
  color: "var(--text-main-color)",
};

const badgeStyle: CSSProperties = {
  position: "absolute",
  top: -2,
  right: -2,
  minWidth: 20,
  height: 20,
  borderRadius: 10,
  background: "hsl(0 84% 60%)",
  color: "#fff",
  fontSize: "0.6875rem",
  fontWeight: 700,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0 5px",
  fontVariantNumeric: "tabular-nums",
  lineHeight: 1,
  border: "2px solid var(--surface-color)",
  pointerEvents: "none",
};

export function NotificationBell() {
  const unreadCount = useNotificationStore((s) => s.unreadCount);
  const toggleDropdown = useNotificationStore((s) => s.toggleDropdown);
  const badgeRef = useRef<HTMLSpanElement>(null);
  const prevCount = useRef(unreadCount);

  useEffect(() => {
    if (unreadCount > prevCount.current && badgeRef.current) {
      badgeRef.current.classList.remove("badge-pop");
      void badgeRef.current.offsetWidth;
      badgeRef.current.classList.add("badge-pop");
    }
    prevCount.current = unreadCount;
  }, [unreadCount]);

  const handleClick = useCallback(() => {
    toggleDropdown();
  }, [toggleDropdown]);

  return (
    <div style={bellContainerStyle}>
      <button
        id="notification-bell"
        style={bellButtonStyle}
        onClick={handleClick}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "var(--hover-bg-solid)")
        }
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
      >
        <BellIcon />
      </button>
      {unreadCount > 0 && (
        <span ref={badgeRef} style={badgeStyle}>
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </div>
  );
}

function BellIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}
