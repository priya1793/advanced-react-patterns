/**
 * ============================================================
 * COMPONENT INJECTION PATTERN
 * ============================================================
 *
 * PATTERN: Component Injection
 * -----------------------------
 * Instead of hardcoding which component to render, the parent
 * accepts a component via props. This enables extreme flexibility —
 * consumers swap in custom inputs, labels, or error displays
 * without modifying the form system internals.
 *
 * Usage:
 *   <Form.InjectedField
 *     name="bio"
 *     inputComponent={MyTextarea}     // inject custom input
 *     errorComponent={MyFancyError}   // inject custom error
 *   />
 */

import React, { useEffect, useMemo } from "react";
import { useFormContext, FieldContext } from "./FormContext";
import { FormLabel } from "./FormLabel";
import { FormInput } from "./FormInput";
import { FormError } from "./FormError";
import type { FieldContextValue, ValidationRule } from "./types";
import { fieldStyle } from "./styles";

interface InjectedFieldProps {
  name: string;
  label?: string;
  rule?: ValidationRule;

  /** Inject a custom input component */
  inputComponent?: React.ComponentType<{
    value: unknown;
    onChange: (value: unknown) => void;
    onBlur: () => void;
    name: string;
    error: string | null;
  }>;

  /** Inject a custom error component */
  errorComponent?: React.ComponentType<{
    error: string | null;
    name: string;
  }>;

  /** Inject a custom label component */
  labelComponent?: React.ComponentType<{
    name: string;
    children?: React.ReactNode;
  }>;
}

export function InjectedField({
  name,
  label,
  rule,
  inputComponent: InputComp,
  errorComponent: ErrorComp,
  labelComponent: LabelComp,
}: InjectedFieldProps) {
  const form = useFormContext();

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

  // Determine which components to render (injected or defaults)
  const LabelToRender = LabelComp;
  const ErrorToRender = ErrorComp;

  return (
    <FieldContext.Provider value={fieldCtx}>
      <div style={fieldStyle()}>
        {LabelToRender ? (
          <LabelToRender name={name}>{label}</LabelToRender>
        ) : (
          <FormLabel>{label}</FormLabel>
        )}

        {InputComp ? (
          <InputComp
            name={name}
            value={fieldCtx.value}
            onChange={fieldCtx.onChange}
            onBlur={fieldCtx.onBlur}
            error={fieldCtx.error}
          />
        ) : (
          <FormInput />
        )}

        {ErrorToRender ? (
          <ErrorToRender error={fieldCtx.error} name={name} />
        ) : (
          <FormError />
        )}
      </div>
    </FieldContext.Provider>
  );
}
