/**
 * ============================================================
 * FORM LABEL — Compound Component Consumer
 * ============================================================
 *
 * Reads the field name from FieldContext to auto-generate
 * a human-readable label. Can be overridden with children.
 */

import React from "react";
import { useFieldContext } from "./FormContext";
import { useFormContext } from "./FormContext";
import { labelStyle } from "./styles";

interface FormLabelProps {
  children?: React.ReactNode;
}

export function FormLabel({ children }: FormLabelProps) {
  const { name } = useFieldContext();
  const { theme } = useFormContext();

  // Auto-generate label from field name: "firstName" → "First Name"
  const autoLabel = name
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .trim();

  return (
    <label htmlFor={name} style={labelStyle(theme)}>
      {children ?? autoLabel}
    </label>
  );
}
