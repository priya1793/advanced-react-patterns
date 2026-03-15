import { memo, type CSSProperties } from "react";
import { getAvatarColor } from "../lib/mockNotifications";

const TYPE_ICONS: Record<string, string> = {
  like: "👍",
  comment: "💬",
  mention: "@",
  share: "↗",
  friend_request: "👤",
};

interface Props {
  initials: string;
  type: string;
  size?: number;
}

export const NotificationAvatar = memo(function NotificationAvatar({
  initials,
  type,
  size = 44,
}: Props) {
  const bgColor = getAvatarColor(initials);

  const containerStyle: CSSProperties = {
    position: "relative",
    width: size,
    height: size,
    flexShrink: 0,
  };

  const avatarStyle: CSSProperties = {
    width: size,
    height: size,
    borderRadius: "50%",
    background: bgColor,
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: size * 0.34,
    fontWeight: 700,
    letterSpacing: "-0.02em",
    userSelect: "none",
  };

  const badgeSize = size * 0.42;
  const badgeStyle: CSSProperties = {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: badgeSize,
    height: badgeSize,
    borderRadius: "50%",
    background: "hsl(217 100% 52%)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: badgeSize * 0.55,
    border: "2px solid var(--surface-color)",
    lineHeight: 1,
  };

  return (
    <div style={containerStyle}>
      <div style={avatarStyle}>{initials}</div>
      <div style={badgeStyle}>{TYPE_ICONS[type] ?? "🔔"}</div>
    </div>
  );
});
