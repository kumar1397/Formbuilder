// app/types.ts

export type FieldType = "text" | "textarea" | "dropdown" | "checkbox" | "date";

export interface Field {
  id: string;
  label: string;
  placeholder?: string;
  required: boolean;
  helpText?: string;
  value?: string | boolean;
  type: "text" | "textarea" | "dropdown" | "checkbox" | "date";
  options?: string[]; // only for dropdown
  minLength?: number; // only for text and textarea
  maxLength?: number; // only for text and textarea
  pattern?: string; // regex pattern string for validation
}

export interface Step {
  id: string;
  title: string;
  fields: Field[];
}
