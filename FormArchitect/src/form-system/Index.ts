/**
 * ============================================================
 * FORM SYSTEM — Public API (Compound Component Namespace)
 * ============================================================
 *
 * All compound components are exported as `Form.X` for
 * a clean, discoverable API:
 *
 *   import { Form } from "./form-system";
 *
 *   <Form.Provider theme="dark" validation="onBlur">
 *     <Form.Field name="email">
 *       <Form.Label />
 *       <Form.Input type="email" />
 *       <Form.Error />
 *       <Form.Suggestions />
 *     </Form.Field>
 *   </Form.Provider>
 */

import { FormProvider } from "./FormProvider";
import { FormField } from "./FormField";
import { FormLabel } from "./FormLabel";
import { FormInput } from "./FormInput";
import { FormError } from "./FormError";
import { FormSuggestions } from "./FormSuggestions";
import { FormFieldArray } from "./FormFieldArray";
import { FormFieldGroup } from "./FormFieldGroup";
import { FormAdd, FormRemove } from "./FormActions";
import { FormSubmit } from "./FormSubmit";
import { InjectedField } from "./ComponentInjection";

export const Form = {
  Provider: FormProvider,
  Field: FormField,
  Label: FormLabel,
  Input: FormInput,
  Error: FormError,
  Suggestions: FormSuggestions,
  FieldArray: FormFieldArray,
  FieldGroup: FormFieldGroup,
  Add: FormAdd,
  Remove: FormRemove,
  Submit: FormSubmit,
  InjectedField: InjectedField,
};

// Re-export advanced patterns for direct use
export { Box } from "./Polymorphic";
export { withFormField } from "./withFormField";
export { GenericList } from "./GenericList";
export type { InjectedFieldProps } from "./withFormField";
export type {
  FormTheme,
  ValidationStrategy,
  FieldArrayItem,
  FieldArrayRenderProps,
  PolymorphicAs,
  PolymorphicProps,
  PolymorphicPropsWithRef,
} from "./types";
