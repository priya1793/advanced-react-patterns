/**
 * ============================================================
 * FIELD ARRAY INPUT — Standalone input for field array items
 * ============================================================
 *
 * A simple controlled input for use inside FieldArray render props.
 * It doesn't use FieldContext (since array items aren't registered
 * as individual fields). Instead it takes value/onChange directly.
 */

import React from "react";
import { useFormContext } from "./FormContext";
import { inputStyle } from "./styles";

interface FieldArrayInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function FieldArrayInput({
  value,
  onChange,
  placeholder = "Enter value...",
}: FieldArrayInputProps) {
  const { theme } = useFormContext();

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{ ...inputStyle(theme, false), flex: 1 }}
    />
  );
}
