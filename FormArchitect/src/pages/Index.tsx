/**
 * ============================================================
 * DEMO PAGE — Compound Component Design System Showcase
 * ============================================================
 *
 * This page demonstrates ALL advanced React patterns:
 *
 * 1. Compound Components with Context    → Form.Provider/Field/Input/...
 * 2. Render Props Pattern                → Form.FieldArray
 * 3. Higher-Order Components             → withFormField(CustomInput)
 * 4. Component Injection                 → Form.InjectedField
 * 5. Polymorphic Components              → Box as="section"
 * 6. Generic TypeScript Components       → GenericList<T>
 * 7. ForwardRef with Generics            → Form.Input ref forwarding
 */

import React, { useRef, useState } from "react";
import { z } from "zod";
import { useFormContext } from "../form-system/FormContext";
import { Form, Box, withFormField, GenericList } from "../form-system";
import type { InjectedFieldProps } from "../form-system";
import { FieldArrayInput } from "../form-system/FieldArrayInput";
import type { FieldArrayItem } from "../form-system/types";
import { getPalette } from "../form-system/styles";

// =============================================
// DEMO 1: HOC Pattern — Custom Input via withFormField
// =============================================

/** A custom textarea that gets wired to form state via the HOC */
function RawCustomTextarea({
  name,
  value,
  onChange,
  onBlur,
  error,
  theme,
}: InjectedFieldProps) {
  const p = getPalette(theme);
  return (
    <textarea
      name={name}
      value={String(value ?? "")}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      rows={3}
      placeholder={`Enter ${name}...`}
      style={{
        padding: "10px 14px",
        fontSize: "15px",
        border: `1.5px solid ${error ? p.danger : p.inputBorder}`,
        borderRadius: "8px",
        backgroundColor: p.inputBg,
        color: p.text,
        outline: "none",
        width: "100%",
        boxSizing: "border-box",
        resize: "vertical",
        fontFamily: "inherit",
      }}
    />
  );
}

const ConnectedTextarea = withFormField(RawCustomTextarea);

// =============================================
// DEMO 2: Component Injection — Custom Error Display
// =============================================

function FancyError({ error }: { error: string | null; name: string }) {
  if (!error) return null;
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #ff6b6b22, #ee5a2422)",
        border: "1px solid #ff6b6b44",
        borderRadius: "8px",
        padding: "8px 12px",
        fontSize: "13px",
        color: "#ff6b6b",
        marginTop: "4px",
      }}
    >
      🚨 {error}
    </div>
  );
}

// =============================================
// MAIN DEMO PAGE
// =============================================

type ThemeChoice = "light" | "dark";

export default function Index() {
  const [theme, setTheme] = useState<ThemeChoice>("dark");
  const [submitResult, setSubmitResult] = useState<string | null>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const p = getPalette(theme);

  const handleSubmit = (values: Record<string, unknown>) => {
    setSubmitResult(JSON.stringify(values, null, 2));
  };

  // Sample data for GenericList demo
  const patternsList = [
    {
      id: 1,
      name: "Compound Components",
      desc: "Context-based implicit communication",
    },
    {
      id: 2,
      name: "Render Props",
      desc: "Function-as-children for flexible rendering",
    },
    {
      id: 3,
      name: "Higher-Order Components",
      desc: "Wrap & enhance existing components",
    },
    { id: 4, name: "Component Injection", desc: "Swap components via props" },
    {
      id: 5,
      name: "Polymorphic Components",
      desc: "Render as any element via `as` prop",
    },
    {
      id: 6,
      name: "Generic TypeScript",
      desc: "Full type inference for component props",
    },
    {
      id: 7,
      name: "ForwardRef + Generics",
      desc: "Ref forwarding with preserved types",
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: theme === "dark" ? "#0f0f1a" : "#f0f2f5",
        padding: "20px",
        transition: "background-color 0.3s",
      }}
    >
      {/* Header */}
      <div
        style={{ maxWidth: "640px", margin: "0 auto 0", textAlign: "center" }}
      >
        <h1
          style={{
            fontSize: "28px",
            fontWeight: 800,
            color: p.text,
            marginBottom: "4px",
            letterSpacing: "-0.02em",
          }}
        >
          Compound Component Design System
        </h1>
        <p
          style={{
            color: p.textSecondary,
            fontSize: "15px",
            marginBottom: "16px",
          }}
        >
          Advanced React patterns showcase — 7 patterns, 1 form system
        </p>

        {/* Theme toggle */}
        <button
          onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
          style={{
            padding: "6px 16px",
            borderRadius: "20px",
            border: `1px solid ${p.border}`,
            background: p.surface,
            color: p.text,
            cursor: "pointer",
            fontSize: "13px",
            marginBottom: "8px",
          }}
        >
          {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      {/* =========================================
          PATTERN 6: Generic TypeScript Component
          ========================================= */}
      <Box
        as="section"
        style={{
          maxWidth: "640px",
          margin: "0 auto 20px",
          padding: "20px",
          backgroundColor: p.surface,
          borderRadius: "12px",
          border: `1px solid ${p.border}`,
        }}
      >
        <h2
          style={{
            fontSize: "16px",
            fontWeight: 700,
            color: p.text,
            marginBottom: "12px",
          }}
        >
          📋 Patterns Used{" "}
          <span
            style={{
              fontWeight: 400,
              fontSize: "13px",
              color: p.textSecondary,
            }}
          >
            (GenericList{"<T>"} + Polymorphic Box)
          </span>
        </h2>
        <GenericList
          items={patternsList}
          keyExtractor={(item) => item.id}
          renderItem={(item) => (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 12px",
                borderBottom: `1px solid ${p.border}`,
                fontSize: "14px",
              }}
            >
              <span style={{ fontWeight: 600, color: p.text }}>
                {item.id}. {item.name}
              </span>
              <span style={{ color: p.textSecondary, fontSize: "13px" }}>
                {item.desc}
              </span>
            </div>
          )}
        />
      </Box>

      {/* =========================================
          MAIN FORM DEMO — Compound Components
          ========================================= */}
      <Form.Provider
        theme={theme}
        validation="onBlur"
        initialValues={{ email: "", password: "", name: "" }}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            // We use handleSubmit from context via the Form.Submit button
          }}
        >
          <h2
            style={{
              fontSize: "18px",
              fontWeight: 700,
              color: p.text,
              marginBottom: "20px",
            }}
          >
            🧩 Form Builder Demo
          </h2>

          {/* ---- Pattern 1: Compound Components + Pattern 7: ForwardRef ---- */}
          <Form.Field
            name="email"
            rule={z.string().email("Please enter a valid email address")}
          >
            <Form.Label>Email Address</Form.Label>
            <Form.Input ref={emailInputRef} type="email" />
            <Form.Error />
            <Form.Suggestions />
          </Form.Field>

          <Form.Field
            name="password"
            rule={z.string().min(8, "Password must be at least 8 characters")}
          >
            <Form.Label />
            <Form.Input type="password" />
            <Form.Error />
            <Form.Suggestions />
          </Form.Field>

          {/* ---- Pattern 1 continued: Auto-generated label ---- */}
          <Form.Field name="name" rule={z.string().min(1, "Name is required")}>
            <Form.Label />
            <Form.Input />
            <Form.Error />
            <Form.Suggestions />
          </Form.Field>

          {/* ---- Pattern 3: HOC (withFormField) ---- */}
          <Form.Field
            name="bio"
            rule={z.string().max(200, "Bio must be under 200 characters")}
          >
            <Form.Label>Bio (HOC-connected textarea)</Form.Label>
            <ConnectedTextarea />
            <Form.Error />
          </Form.Field>

          {/* ---- Pattern 4: Component Injection ---- */}
          <Form.InjectedField
            name="website"
            label="Website (Injected Error Component)"
            rule={z.string().url("Please enter a valid URL").or(z.literal(""))}
            errorComponent={FancyError}
          />

          {/* ---- Pattern 2: Render Props (FieldArray) ---- */}
          <Form.FieldArray name="items">
            {({
              fields,
              append,
              remove,
            }: {
              fields: FieldArrayItem[];
              append: (v?: string) => void;
              remove: (id: string) => void;
            }) => (
              <>
                {fields.map((field) => (
                  <Form.FieldGroup key={field.id}>
                    <FieldArrayInput
                      value={field.value}
                      onChange={(val) => {
                        field.value = val;
                      }}
                      placeholder="Item value..."
                    />
                    <Form.Remove onClick={() => remove(field.id)} />
                  </Form.FieldGroup>
                ))}
                <Form.Add onClick={() => append()} />
                {fields.length === 0 && (
                  <p
                    style={{
                      fontSize: "13px",
                      color: p.textSecondary,
                      fontStyle: "italic",
                      marginTop: "8px",
                    }}
                  >
                    No items yet. Click "+ Add Item" to start.
                  </p>
                )}
              </>
            )}
          </Form.FieldArray>

          {/* Submit */}
          <SubmitButton onSubmit={handleSubmit} />
        </form>

        {/* Result */}
        {submitResult && (
          <div style={{ marginTop: "16px" }}>
            <h3
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: p.success,
                marginBottom: "8px",
              }}
            >
              ✅ Submitted Values:
            </h3>
            <pre
              style={{
                padding: "12px 16px",
                borderRadius: "8px",
                backgroundColor: p.surface,
                border: `1px solid ${p.border}`,
                fontSize: "13px",
                color: p.text,
                overflow: "auto",
                fontFamily: "'SF Mono', 'Fira Code', monospace",
              }}
            >
              {submitResult}
            </pre>
          </div>
        )}
      </Form.Provider>
    </div>
  );
}

// =============================================
// Submit Button that uses form context
// =============================================

function SubmitButton({
  onSubmit,
}: {
  onSubmit: (values: Record<string, unknown>) => void;
}) {
  const form = useFormContext();

  return (
    <button
      type="button"
      onClick={form.handleSubmit(onSubmit)}
      disabled={form.isSubmitting}
      style={{
        padding: "10px 24px",
        fontSize: "15px",
        fontWeight: 600,
        borderRadius: "8px",
        cursor: form.isSubmitting ? "not-allowed" : "pointer",
        border: "none",
        backgroundColor: getPalette(form.theme).primary,
        color: "#fff",
        opacity: form.isSubmitting ? 0.6 : 1,
        marginTop: "12px",
        transition: "opacity 0.2s",
      }}
    >
      {form.isSubmitting ? "Submitting..." : "Submit Form"}
    </button>
  );
}
