/**
 * ============================================================
 * FORM SYSTEM TYPES
 * ============================================================
 * Central type definitions for the compound component form system.
 * Demonstrates: Generic TypeScript patterns, discriminated unions,
 * mapped types, and conditional types.
 */

import { z } from "zod";

// ------------------------------------
// Theme & Validation Strategy Types
// ------------------------------------

export type FormTheme = "light" | "dark";
export type ValidationStrategy = "onChange" | "onBlur" | "onSubmit";

// ------------------------------------
// Field State (generic over value type)
// ------------------------------------

export interface FieldState<T = unknown> {
  value: T;
  error: string | null;
  touched: boolean;
  dirty: boolean;
}

// ------------------------------------
// Form State (generic over the shape)
// ------------------------------------

export interface FormState<
  T extends Record<string, unknown> = Record<string, unknown>,
> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  dirty: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
}

// ------------------------------------
// Field Array Item
// ------------------------------------

export interface FieldArrayItem {
  id: string;
  value: string;
}

// ------------------------------------
// Field Array Render Props
// ------------------------------------

export interface FieldArrayRenderProps {
  fields: FieldArrayItem[];
  append: (value?: string) => void;
  remove: (id: string) => void;
  prepend: (value?: string) => void;
  swap: (indexA: number, indexB: number) => void;
}

// ------------------------------------
// Validation Rule (Zod-based)
// ------------------------------------

export type ValidationRule = z.ZodType<unknown>;

// ------------------------------------
// Form Context Value
// ------------------------------------

export interface FormContextValue {
  theme: FormTheme;
  validation: ValidationStrategy;
  values: Record<string, unknown>;
  errors: Record<string, string | null>;
  touched: Record<string, boolean>;
  dirty: Record<string, boolean>;
  isSubmitting: boolean;

  // Actions
  setFieldValue: (name: string, value: unknown) => void;
  setFieldError: (name: string, error: string | null) => void;
  setFieldTouched: (name: string, touched: boolean) => void;
  validateField: (name: string) => void;
  registerField: (name: string, rule?: ValidationRule) => void;
  unregisterField: (name: string) => void;
  handleSubmit: (
    onSubmit: (values: Record<string, unknown>) => void | Promise<void>,
  ) => (e?: React.FormEvent) => void;
}

// ------------------------------------
// Field Context Value
// ------------------------------------

export interface FieldContextValue {
  name: string;
  value: unknown;
  error: string | null;
  touched: boolean;
  dirty: boolean;
  onChange: (value: unknown) => void;
  onBlur: () => void;
}

// ------------------------------------
// Polymorphic Component Types
// ------------------------------------

/**
 * The `as` prop lets a component render as any HTML element or React component.
 * This is the core of the polymorphic component pattern.
 */
export type PolymorphicAs = React.ElementType;

export type PolymorphicProps<E extends PolymorphicAs, P = object> = P &
  Omit<React.ComponentPropsWithoutRef<E>, keyof P | "as"> & {
    as?: E;
  };

export type PolymorphicRef<E extends PolymorphicAs> =
  React.ComponentPropsWithRef<E>["ref"];

export type PolymorphicPropsWithRef<
  E extends PolymorphicAs,
  P = object,
> = PolymorphicProps<E, P> & { ref?: PolymorphicRef<E> };
