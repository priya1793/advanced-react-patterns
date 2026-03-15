/**
 * ============================================================
 * FORM FIELD — Compound Component (Field-level context)
 * ============================================================
 *
 * PATTERN: Nested Compound Components
 * ------------------------------------
 * Form.Field creates a nested context layer. It reads from
 * the parent FormContext and provides a FieldContext so that
 * child components (Label, Input, Error) automatically know
 * which field they belong to.
 *
 * Users never pass `name` to each child — it's implicit.
 */

import React, { useEffect, useMemo } from "react";
import { useFormContext, FieldContext } from "./FormContext";
import type { FieldContextValue, ValidationRule } from "./types";
import { fieldStyle } from "./styles";

interface FormFieldProps {
  name: string;
  /** Optional Zod validation rule for this field */
  rule?: ValidationRule;
  children: React.ReactNode;
}

export function FormField({ name, rule, children }: FormFieldProps) {
  const form = useFormContext();

  // Register field on mount, unregister on unmount
  useEffect(() => {
    form.registerField(name, rule);
    return () => form.unregisterField(name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  const fieldCtx: FieldContextValue = useMemo(
    () => ({
      name,
      value: form.values[name] ?? "",
      error: form.touched[name] ? (form.errors[name] ?? null) : null,
      touched: form.touched[name] ?? false,
      dirty: form.dirty[name] ?? false,
      onChange: (value: unknown) => form.setFieldValue(name, value),
      onBlur: () => form.setFieldTouched(name, true),
    }),
    [name, form],
  );

  return (
    <FieldContext.Provider value={fieldCtx}>
      <div style={fieldStyle()}>{children}</div>
    </FieldContext.Provider>
  );
}
