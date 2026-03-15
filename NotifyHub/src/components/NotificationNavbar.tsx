import { type CSSProperties, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNotificationStore } from "../store/notificationStore";
import { fetchNotifications } from "../lib/mockNotifications";
import { useSocketNotifications } from "../hooks/useSocketNotifications";
import { NotificationBell } from "./NotificationBell";
import { NotificationDropdown } from "./NotificationDropdown";
import { ThemeToggle } from "./ThemeToggle";

const navStyle: CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  height: 60,
  background: "var(--surface-color)",
  boxShadow: "var(--nav-shadow)",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 20px",
  zIndex: 100,
  transition: "background 300ms, box-shadow 300ms",
};

const logoStyle: CSSProperties = {
  fontSize: "1.375rem",
  fontWeight: 800,
  color: "hsl(217 100% 52%)",
  letterSpacing: "-0.04em",
  display: "flex",
  alignItems: "center",
  gap: 8,
};

const rightSectionStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
};

const bellWrapperStyle: CSSProperties = {
  position: "relative",
};

export function NotificationNavbar() {
  const setInitial = useNotificationStore((s) => s.setInitial);

  const { isLoading, data } = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
  });

  useEffect(() => {
    if (data) {
      setInitial(data);
    }
  }, [data, setInitial]);

  useSocketNotifications();

  return (
    <nav style={navStyle}>
      <div style={logoStyle}>
        <span style={{ fontSize: "1.5rem" }}>🔔</span>
        NotifyHub
      </div>
      <div style={rightSectionStyle}>
        <ThemeToggle />
        <div style={bellWrapperStyle}>
          <NotificationBell />
          <NotificationDropdown isLoading={isLoading} />
        </div>
      </div>
    </nav>
  );
}
