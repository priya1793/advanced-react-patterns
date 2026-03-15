/**
 * ============================================================
 * INLINE STYLES (No Tailwind / No CSS frameworks)
 * ============================================================
 * All styles are plain CSS-in-JS objects.
 * Theme-aware via the `theme` parameter.
 */

import type { FormTheme } from "./types";
import type { CSSProperties } from "react";

// ------------------------------------
// Theme palettes
// ------------------------------------

const palettes = {
  light: {
    bg: "#ffffff",
    surface: "#f8f9fa",
    border: "#dee2e6",
    text: "#212529",
    textSecondary: "#6c757d",
    primary: "#0d6efd",
    primaryHover: "#0b5ed7",
    danger: "#dc3545",
    dangerBg: "#fff5f5",
    success: "#198754",
    inputBg: "#ffffff",
    inputBorder: "#ced4da",
    focusRing: "rgba(13, 110, 253, 0.25)",
    suggestionBg: "#f0f7ff",
    suggestionBorder: "#b6d4fe",
  },
  dark: {
    bg: "#1a1a2e",
    surface: "#16213e",
    border: "#0f3460",
    text: "#e4e6eb",
    textSecondary: "#a8a8b3",
    primary: "#4dabf7",
    primaryHover: "#339af0",
    danger: "#ff6b6b",
    dangerBg: "#2d1b1b",
    success: "#51cf66",
    inputBg: "#16213e",
    inputBorder: "#0f3460",
    focusRing: "rgba(77, 171, 247, 0.25)",
    suggestionBg: "#1a2744",
    suggestionBorder: "#0f3460",
  },
} as const;

export function getPalette(theme: FormTheme) {
  return palettes[theme];
}

// ------------------------------------
// Component Style Factories
// ------------------------------------

export function providerStyle(theme: FormTheme): CSSProperties {
  const p = getPalette(theme);
  return {
    fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
    color: p.text,
    backgroundColor: p.bg,
    padding: "32px",
    borderRadius: "12px",
    maxWidth: "640px",
    margin: "32px auto",
    boxShadow:
      theme === "dark"
        ? "0 8px 32px rgba(0,0,0,0.4)"
        : "0 4px 24px rgba(0,0,0,0.08)",
  };
}

export function fieldStyle(): CSSProperties {
  return {
    marginBottom: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  };
}

export function labelStyle(theme: FormTheme): CSSProperties {
  const p = getPalette(theme);
  return {
    fontSize: "14px",
    fontWeight: 600,
    color: p.text,
    marginBottom: "2px",
    letterSpacing: "0.01em",
  };
}

export function inputStyle(theme: FormTheme, hasError: boolean): CSSProperties {
  const p = getPalette(theme);
  return {
    padding: "10px 14px",
    fontSize: "15px",
    border: `1.5px solid ${hasError ? p.danger : p.inputBorder}`,
    borderRadius: "8px",
    backgroundColor: p.inputBg,
    color: p.text,
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    width: "100%",
    boxSizing: "border-box",
  };
}

export function errorStyle(theme: FormTheme): CSSProperties {
  const p = getPalette(theme);
  return {
    fontSize: "13px",
    color: p.danger,
    marginTop: "2px",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  };
}

export function suggestionsStyle(theme: FormTheme): CSSProperties {
  const p = getPalette(theme);
  return {
    fontSize: "13px",
    color: p.textSecondary,
    backgroundColor: p.suggestionBg,
    border: `1px solid ${p.suggestionBorder}`,
    borderRadius: "6px",
    padding: "8px 12px",
    marginTop: "4px",
  };
}

export function buttonStyle(
  theme: FormTheme,
  variant: "primary" | "danger" | "ghost" = "primary",
): CSSProperties {
  const p = getPalette(theme);
  const base: CSSProperties = {
    padding: "8px 18px",
    fontSize: "14px",
    fontWeight: 600,
    borderRadius: "8px",
    cursor: "pointer",
    border: "none",
    transition: "background-color 0.2s, opacity 0.2s",
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
  };

  if (variant === "primary") {
    return { ...base, backgroundColor: p.primary, color: "#fff" };
  }
  if (variant === "danger") {
    return {
      ...base,
      backgroundColor: p.dangerBg,
      color: p.danger,
      border: `1px solid ${p.danger}`,
    };
  }
  // ghost
  return {
    ...base,
    backgroundColor: "transparent",
    color: p.textSecondary,
    border: `1px solid ${p.border}`,
  };
}

export function fieldGroupStyle(theme: FormTheme): CSSProperties {
  const p = getPalette(theme);
  return {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 12px",
    backgroundColor: p.surface,
    borderRadius: "8px",
    marginBottom: "8px",
    border: `1px solid ${p.border}`,
  };
}

export function fieldArrayContainerStyle(theme: FormTheme): CSSProperties {
  const p = getPalette(theme);
  return {
    padding: "16px",
    borderRadius: "10px",
    border: `1px dashed ${p.border}`,
    backgroundColor: p.surface,
    marginBottom: "20px",
  };
}

export function headingStyle(theme: FormTheme): CSSProperties {
  const p = getPalette(theme);
  return {
    fontSize: "22px",
    fontWeight: 700,
    color: p.text,
    marginBottom: "24px",
  };
}

export function submitResultStyle(theme: FormTheme): CSSProperties {
  const p = getPalette(theme);
  return {
    marginTop: "16px",
    padding: "12px 16px",
    borderRadius: "8px",
    backgroundColor: p.suggestionBg,
    border: `1px solid ${p.suggestionBorder}`,
    fontSize: "13px",
    color: p.text,
    whiteSpace: "pre-wrap",
    fontFamily: "monospace",
  };
}
