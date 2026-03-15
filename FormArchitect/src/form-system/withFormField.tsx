/**
 * ============================================================
 * HIGHER-ORDER COMPONENT (HOC) — withFormField
 * ============================================================
 *
 * PATTERN: Higher-Order Components
 * ---------------------------------
 * A HOC is a function that takes a component and returns an
 * enhanced component. `withFormField` injects field-level
 * props (value, onChange, error) into any input component,
 * connecting it to the form system automatically.
 *
 * Usage:
 *   const ConnectedInput = withFormField(MyCustomInput);
 *   // Inside <Form.Field name="email">:
 *   <ConnectedInput />  // automatically wired to "email" field
 */

import React, { forwardRef } from "react";
import { useFieldContext, useFormContext } from "./FormContext";

export interface InjectedFieldProps {
  name: string;
  value: unknown;
  error: string | null;
  touched: boolean;
  onChange: (value: unknown) => void;
  onBlur: () => void;
  theme: "light" | "dark";
}

/**
 * withFormField — HOC that injects form field props
 *
 * The wrapped component receives InjectedFieldProps automatically.
 * Any additional props are forwarded through.
 */
export function withFormField<P extends object>(
  WrappedComponent: React.ComponentType<P & InjectedFieldProps>,
) {
  const WithFormField = forwardRef<unknown, Omit<P, keyof InjectedFieldProps>>(
    function WithFormField(props, ref) {
      const field = useFieldContext();
      const { theme } = useFormContext();

      const injected: InjectedFieldProps = {
        name: field.name,
        value: field.value,
        error: field.error,
        touched: field.touched,
        onChange: field.onChange,
        onBlur: field.onBlur,
        theme,
      };

      const allProps = { ...props, ...injected, ref } as unknown as P &
        InjectedFieldProps & { ref: unknown };
      return <WrappedComponent {...allProps} />;
    },
  );

  WithFormField.displayName = `withFormField(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return WithFormField;
}
