/**
 * ============================================================
 * FORM INPUT — ForwardRef with Generics
 * ============================================================
 *
 * PATTERN: ForwardRef with Generics
 * ----------------------------------
 * React.forwardRef doesn't natively support generic type params.
 * We use a typed wrapper pattern to preserve full generic typing
 * while still forwarding refs.
 *
 * PATTERN: Polymorphic Component (via `as` prop)
 * -----------------------------------------------
 * The `as` prop lets this component render as any element type.
 * Default is <input>, but could be <textarea> or a custom component.
 */

import React, { forwardRef, useCallback } from "react";
import { useFieldContext } from "./FormContext";
import { useFormContext } from "./FormContext";
import { inputStyle } from "./styles";

interface BaseFormInputProps {
  type?: string;
  placeholder?: string;
  as?: React.ElementType;
  style?: React.CSSProperties;
}

// ForwardRef with generics: We type the ref explicitly
// and use a factory pattern to preserve generic inference.

type FormInputProps = BaseFormInputProps &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, keyof BaseFormInputProps>;

/**
 * FormInput — ForwardRef + Polymorphic
 *
 * Usage:
 *   <Form.Input />                     → renders <input>
 *   <Form.Input as="textarea" />       → renders <textarea>
 *   <Form.Input as={CustomInput} />    → renders <CustomInput>
 */
export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  function FormInput({ type = "text", placeholder, as, style, ...rest }, ref) {
    const field = useFieldContext();
    const { theme } = useFormContext();

    const Component = as ?? "input";
    const hasError = Boolean(field.error);

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        field.onChange(e.target.value);
      },
      [field],
    );

    return (
      <Component
        ref={ref}
        id={field.name}
        name={field.name}
        type={Component === "input" ? type : undefined}
        value={String(field.value ?? "")}
        onChange={handleChange}
        onBlur={field.onBlur}
        placeholder={placeholder ?? `Enter ${field.name}...`}
        style={{ ...inputStyle(theme, hasError), ...style }}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${field.name}-error` : undefined}
        {...rest}
      />
    );
  },
);

FormInput.displayName = "FormInput";
