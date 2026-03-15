/**
 * ============================================================
 * FORM ADD / REMOVE — Action Buttons
 * ============================================================
 *
 * Simple themed button components for field array operations.
 */

import React from "react";
import { useFormContext } from "./FormContext";
import { buttonStyle } from "./styles";

interface FormAddProps {
  onClick: () => void;
  label?: string;
}

export function FormAdd({ onClick, label = "+ Add Item" }: FormAddProps) {
  const { theme } = useFormContext();

  return (
    <button type="button" onClick={onClick} style={buttonStyle(theme, "ghost")}>
      {label}
    </button>
  );
}

interface FormRemoveProps {
  onClick: () => void;
  label?: string;
}

export function FormRemove({ onClick, label = "✕" }: FormRemoveProps) {
  const { theme } = useFormContext();

  return (
    <button
      type="button"
      onClick={onClick}
      style={buttonStyle(theme, "danger")}
      aria-label="Remove item"
    >
      {label}
    </button>
  );
}
