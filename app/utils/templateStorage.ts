// app/utils/templateStorage.ts

import type { Field } from "~/types";

export interface Step {
  id: string;
  title: string;
  fields: Field[];
}

export function saveTemplate(templateId: string, steps: Step[]) {
  try {
    localStorage.setItem(`form-template-${templateId}`, JSON.stringify(steps));
  } catch (e) {
    console.error("Failed to save template:", e);
  }
}

export function loadTemplate(templateId: string): Step[] | null {
  try {
    const stored = localStorage.getItem(`form-template-${templateId}`);
    if (!stored) return null;
    return JSON.parse(stored) as Step[];
  } catch (e) {
    console.error("Failed to load template:", e);
    return null;
  }
}

export function deleteTemplate(templateId: string) {
  try {
    localStorage.removeItem(`form-template-${templateId}`);
  } catch (e) {
    console.error("Failed to delete template:", e);
  }
}
