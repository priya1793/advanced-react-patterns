/**
 * ============================================================
 * FORM ERROR — Compound Component Consumer
 * ============================================================
 *
 * Reads the error state from FieldContext.
 * Only renders when there's an error AND the field is touched.
 */

import React from "react";
import { useFieldContext, useFormContext } from "./FormContext";
import { errorStyle } from "./styles";

export function FormError() {
  const { name, error } = useFieldContext();
  const { theme } = useFormContext();

  if (!error) return null;

  return (
    <span id={`${name}-error`} role="alert" style={errorStyle(theme)}>
      ⚠ {error}
    </span>
  );
}
