/**
 * ============================================================
 * FORM SUBMIT — Context-Aware Submit Button
 * ============================================================
 *
 * Reads isSubmitting from context to show loading state.
 */

import React from "react";
import { useFormContext } from "./FormContext";
import { buttonStyle } from "./styles";

interface FormSubmitProps {
  children?: React.ReactNode;
}

export function FormSubmit({ children = "Submit" }: FormSubmitProps) {
  const { theme, isSubmitting } = useFormContext();

  return (
    <button
      type="submit"
      disabled={isSubmitting}
      style={{
        ...buttonStyle(theme, "primary"),
        opacity: isSubmitting ? 0.6 : 1,
        cursor: isSubmitting ? "not-allowed" : "pointer",
        marginTop: "8px",
      }}
    >
      {isSubmitting ? "Submitting..." : children}
    </button>
  );
}
