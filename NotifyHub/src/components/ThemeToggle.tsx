import { type CSSProperties } from "react";
import { useTheme } from "../hooks/useTheme";

const btnStyle: CSSProperties = {
  width: 36,
  height: 36,
  borderRadius: "50%",
  border: "none",
  background: "transparent",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "1.15rem",
  transition: "background 150ms",
};

export function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      id="theme-toggle"
      style={btnStyle}
      onClick={toggle}
      onMouseEnter={(e) =>
        (e.currentTarget.style.background = "var(--hover-bg-solid)")
      }
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}
