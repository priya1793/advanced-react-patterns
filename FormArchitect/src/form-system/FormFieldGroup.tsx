/**
 * ============================================================
 * FORM FIELD GROUP — Layout Compound Component
 * ============================================================
 *
 * Groups field array items with consistent styling.
 */

import React from "react";
import { useFormContext } from "./FormContext";
import { fieldGroupStyle } from "./styles";

interface FormFieldGroupProps {
  children: React.ReactNode;
}

export function FormFieldGroup({ children }: FormFieldGroupProps) {
  const { theme } = useFormContext();

  return <div style={fieldGroupStyle(theme)}>{children}</div>;
}
