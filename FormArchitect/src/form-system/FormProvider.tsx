/**
 * ============================================================
 * FORM PROVIDER — Compound Component Root
 * ============================================================
 *
 * PATTERN: Compound Components with Context
 * -----------------------------------------
 * Form.Provider is the root compound component. It owns all
 * form state (values, errors, touched, dirty) and exposes
 * actions via context. Child components read/write state
 * through context — no prop-drilling needed.
 *
 * Also demonstrates: Zod-based validation integration.
 */

import React, { useCallback, useMemo, useRef, useState } from "react";
import type { FormTheme, ValidationStrategy, ValidationRule } from "./types";
import { FormContext } from "./FormContext";
import { providerStyle } from "./styles";

interface FormProviderProps {
  theme?: FormTheme;
  validation?: ValidationStrategy;
  children: React.ReactNode;
  /** Optional Zod schema for the whole form */
  initialValues?: Record<string, unknown>;
}

export function FormProvider({
  theme = "light",
  validation = "onBlur",
  children,
  initialValues = {},
}: FormProviderProps) {
  const [values, setValues] = useState<Record<string, unknown>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [dirty, setDirty] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Store per-field validation rules
  const fieldRules = useRef<Record<string, ValidationRule | undefined>>({});

  // ------------------------------------
  // Field registration
  // ------------------------------------

  const registerField = useCallback((name: string, rule?: ValidationRule) => {
    fieldRules.current[name] = rule;
    // Initialize value if not present
    setValues((prev) => (name in prev ? prev : { ...prev, [name]: "" }));
  }, []);

  const unregisterField = useCallback((name: string) => {
    delete fieldRules.current[name];
  }, []);

  // ------------------------------------
  // Validation (single field, Zod-based)
  // ------------------------------------

  const validateField = useCallback((name: string) => {
    const rule = fieldRules.current[name];
    if (!rule) {
      setErrors((prev) => ({ ...prev, [name]: null }));
      return;
    }
    setValues((currentValues) => {
      const result = rule.safeParse(currentValues[name]);
      if (!result.success) {
        const message = result.error.issues[0]?.message ?? "Invalid";
        setErrors((prev) => ({ ...prev, [name]: message }));
      } else {
        setErrors((prev) => ({ ...prev, [name]: null }));
      }
      return currentValues;
    });
  }, []);

  // ------------------------------------
  // Actions
  // ------------------------------------

  const setFieldValue = useCallback(
    (name: string, value: unknown) => {
      setValues((prev) => ({ ...prev, [name]: value }));
      setDirty((prev) => ({ ...prev, [name]: true }));
      if (validation === "onChange") {
        // Defer validation so the value is set first
        setTimeout(() => validateField(name), 0);
      }
    },
    [validation, validateField],
  );

  const setFieldError = useCallback((name: string, error: string | null) => {
    setErrors((prev) => ({ ...prev, [name]: error }));
  }, []);

  const setFieldTouched = useCallback(
    (name: string, isTouched: boolean) => {
      setTouched((prev) => ({ ...prev, [name]: isTouched }));
      if (validation === "onBlur" && isTouched) {
        validateField(name);
      }
    },
    [validation, validateField],
  );

  const handleSubmit = useCallback(
    (onSubmit: (values: Record<string, unknown>) => void | Promise<void>) =>
      async (e?: React.FormEvent) => {
        e?.preventDefault();

        // Validate all fields
        let hasError = false;
        const newErrors: Record<string, string | null> = {};

        for (const name of Object.keys(fieldRules.current)) {
          const rule = fieldRules.current[name];
          if (rule) {
            const result = rule.safeParse(values[name]);
            if (!result.success) {
              newErrors[name] = result.error.issues[0]?.message ?? "Invalid";
              hasError = true;
            } else {
              newErrors[name] = null;
            }
          }
        }

        setErrors((prev) => ({ ...prev, ...newErrors }));
        // Mark all as touched
        const allTouched: Record<string, boolean> = {};
        for (const name of Object.keys(fieldRules.current)) {
          allTouched[name] = true;
        }
        setTouched((prev) => ({ ...prev, ...allTouched }));

        if (hasError) return;

        setIsSubmitting(true);
        try {
          await onSubmit(values);
        } finally {
          setIsSubmitting(false);
        }
      },
    [values],
  );

  // ------------------------------------
  // Context value (memoized)
  // ------------------------------------

  const ctx = useMemo(
    () => ({
      theme,
      validation,
      values,
      errors,
      touched,
      dirty,
      isSubmitting,
      setFieldValue,
      setFieldError,
      setFieldTouched,
      validateField,
      registerField,
      unregisterField,
      handleSubmit,
    }),
    [
      theme,
      validation,
      values,
      errors,
      touched,
      dirty,
      isSubmitting,
      setFieldValue,
      setFieldError,
      setFieldTouched,
      validateField,
      registerField,
      unregisterField,
      handleSubmit,
    ],
  );

  return (
    <FormContext.Provider value={ctx}>
      <div style={providerStyle(theme)}>{children}</div>
    </FormContext.Provider>
  );
}
