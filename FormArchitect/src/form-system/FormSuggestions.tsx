/**
 * ============================================================
 * FORM SUGGESTIONS — Smart Hints Component
 * ============================================================
 *
 * Provides contextual hints based on the field name and value.
 * Demonstrates reading from both Form and Field context.
 */

import React from "react";
import { useFieldContext, useFormContext } from "./FormContext";
import { suggestionsStyle } from "./styles";

const suggestionMap: Record<string, (value: unknown) => string | null> = {
  email: (v) => {
    const s = String(v ?? "");
    if (!s) return "Enter your email address (e.g. user@example.com)";
    if (s.length > 0 && !s.includes("@")) return "Don't forget the @ symbol";
    if (s.includes("@") && !s.includes(".")) return "Add a domain (e.g. .com)";
    return null;
  },
  password: (v) => {
    const s = String(v ?? "");
    if (!s) return "Use at least 8 characters with mixed case and numbers";
    if (s.length < 8) return `${8 - s.length} more characters needed`;
    return null;
  },
  name: (v) => {
    const s = String(v ?? "");
    if (!s) return "Enter your full name";
    return null;
  },
};

export function FormSuggestions() {
  const { name, value } = useFieldContext();
  const { theme } = useFormContext();

  // Find a matching suggestion generator
  const generator =
    suggestionMap[name] ??
    Object.entries(suggestionMap).find(([key]) =>
      name.toLowerCase().includes(key),
    )?.[1];

  const suggestion = generator?.(value);
  if (!suggestion) return null;

  return <div style={suggestionsStyle(theme)}>💡 {suggestion}</div>;
}
