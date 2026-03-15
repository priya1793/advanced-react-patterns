/**
 * ============================================================
 * FORM FIELD ARRAY — Render Props Pattern
 * ============================================================
 *
 * PATTERN: Render Props
 * ----------------------
 * Instead of rendering fixed JSX, FieldArray accepts a function
 * as children. It calls that function with helper methods
 * (fields, append, remove, prepend, swap), giving the consumer
 * full control over rendering while the component manages state.
 *
 * Usage:
 *   <Form.FieldArray name="items">
 *     {({ fields, append, remove }) => ( ... )}
 *   </Form.FieldArray>
 */

import React, { useCallback, useState } from "react";
import { useFormContext } from "./FormContext";
import type { FieldArrayRenderProps, FieldArrayItem } from "./types";
import { fieldArrayContainerStyle } from "./styles";

let nextId = 1;
function generateId(): string {
  return `field-array-${nextId++}`;
}

interface FormFieldArrayProps {
  name: string;
  children: (props: FieldArrayRenderProps) => React.ReactNode;
}

export function FormFieldArray({ name, children }: FormFieldArrayProps) {
  const { theme, setFieldValue } = useFormContext();
  const [fields, setFields] = useState<FieldArrayItem[]>([]);

  // Sync field array values up to the form context
  const syncToForm = useCallback(
    (updated: FieldArrayItem[]) => {
      setFieldValue(
        name,
        updated.map((f) => f.value),
      );
    },
    [name, setFieldValue],
  );

  const append = useCallback(
    (value?: string) => {
      setFields((prev) => {
        const next = [...prev, { id: generateId(), value: value ?? "" }];
        syncToForm(next);
        return next;
      });
    },
    [syncToForm],
  );

  const remove = useCallback(
    (id: string) => {
      setFields((prev) => {
        const next = prev.filter((f) => f.id !== id);
        syncToForm(next);
        return next;
      });
    },
    [syncToForm],
  );

  const prepend = useCallback(
    (value?: string) => {
      setFields((prev) => {
        const next = [{ id: generateId(), value: value ?? "" }, ...prev];
        syncToForm(next);
        return next;
      });
    },
    [syncToForm],
  );

  const swap = useCallback(
    (indexA: number, indexB: number) => {
      setFields((prev) => {
        const next = [...prev];
        const temp = next[indexA];
        next[indexA] = next[indexB];
        next[indexB] = temp;
        syncToForm(next);
        return next;
      });
    },
    [syncToForm],
  );

  return (
    <div style={fieldArrayContainerStyle(theme)}>
      <div
        style={{
          fontSize: "13px",
          fontWeight: 600,
          marginBottom: "10px",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          opacity: 0.6,
        }}
      >
        {name}
      </div>
      {children({ fields, append, remove, prepend, swap })}
    </div>
  );
}
