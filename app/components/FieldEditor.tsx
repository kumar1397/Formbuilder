// app/components/FieldEditor.tsx
import React from "react";
import type { Field } from "~/types";

interface Props {
  field: Field;
  onChange: (field: Field) => void;
  stepTitle?: string;
  onStepTitleChange?: (title: string) => void;
}

export function FieldEditor({
  field,
  onChange,
  stepTitle,
  onStepTitleChange,
}: Props) {
  const update = (updates: Partial<Field>) => {
    onChange({ ...field, ...updates });
  };

  return (
    <div className="space-y-4">
      {/* Step Title Editor */}
      {stepTitle && onStepTitleChange && (
        <div>
          <label className="block font-medium">Step Title</label>
          <input
            type="text"
            value={stepTitle}
            onChange={(e) => onStepTitleChange(e.target.value)}
            className="border px-3 py-2 rounded w-full"
          />
        </div>
      )}

      {/* Label */}
      <div>
        <label className="block font-medium">Label</label>
        <input
          type="text"
          value={field.label}
          onChange={(e) => update({ label: e.target.value })}
          className="border px-3 py-2 rounded w-full"
        />
      </div>

      {/* Help Text Input */}
      <div>
        <label className="block font-medium">Help Text</label>
        <input
          type="text"
          value={field.helpText || ""}
          onChange={(e) => update({ helpText: e.target.value })}
          className="border px-3 py-2 rounded w-full"
        />
      </div>

      {/* Required Toggle */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={field.required}
          onChange={(e) => update({ required: e.target.checked })}
        />
        <label>Required</label>
      </div>

      {/* Validation Fields */}
      {(field.type === "text" || field.type === "textarea") && (
        <>
          <div>
            <label className="block font-medium">Min Length</label>
            <input
              type="number"
              value={field.minLength || ""}
              onChange={(e) =>
                update({ minLength: e.target.value ? +e.target.value : undefined })
              }
              className="border px-3 py-2 rounded w-full"
            />
          </div>

          <div>
            <label className="block font-medium">Max Length</label>
            <input
              type="number"
              value={field.maxLength || ""}
              onChange={(e) =>
                update({ maxLength: e.target.value ? +e.target.value : undefined })
              }
              className="border px-3 py-2 rounded w-full"
            />
          </div>
        </>
      )}
    </div>
  );
}

