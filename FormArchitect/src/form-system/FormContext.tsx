/**
 * ============================================================
 * FORM CONTEXT — Compound Component Pattern (Core)
 * ============================================================
 *
 * PATTERN: Compound Components with Context
 * -----------------------------------------
 * The Form.Provider creates a shared context that all child
 * compound components (Field, Input, Label, Error, etc.)
 * consume implicitly. Users compose them declaratively without
 * manually wiring props between siblings.
 *
 * This file provides:
 *  - FormContext (shared state)
 *  - FieldContext (per-field state)
 *  - Custom hooks to consume them safely
 */

import React, { createContext, useContext } from "react";
import type { FormContextValue, FieldContextValue } from "./types";

// ------------------------------------
// Form-level context
// ------------------------------------

export const FormContext = createContext<FormContextValue | null>(null);

/** Hook: access the nearest Form.Provider context */
export function useFormContext(): FormContextValue {
  const ctx = useContext(FormContext);
  if (!ctx) {
    throw new Error(
      "useFormContext must be used within a <Form.Provider>. " +
        "Wrap your form components inside <Form.Provider>.",
    );
  }
  return ctx;
}

// ------------------------------------
// Field-level context
// ------------------------------------

export const FieldContext = createContext<FieldContextValue | null>(null);

/** Hook: access the nearest Form.Field context */
export function useFieldContext(): FieldContextValue {
  const ctx = useContext(FieldContext);
  if (!ctx) {
    throw new Error(
      "useFieldContext must be used within a <Form.Field>. " +
        "Wrap your input components inside <Form.Field name='...'>.",
    );
  }
  return ctx;
}
