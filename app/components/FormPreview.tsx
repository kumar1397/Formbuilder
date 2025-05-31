import React from "react";
import type { Field } from "~/types";

type PreviewMode = "desktop" | "tablet" | "mobile";

interface FormPreviewProps {
  fields: Field[];
  previewMode: PreviewMode;
}

const modeStyles: Record<PreviewMode, string> = {
  desktop: "w-full max-w-[100%]",
  tablet: "w-[600px] mx-auto",
  mobile: "w-[375px] mx-auto",
};

export const FormPreview: React.FC<FormPreviewProps> = ({ fields, previewMode }) => {
  return (
    <div className={`p-4 border rounded bg-gray-50 ${modeStyles[previewMode]}`}>
      <form className="space-y-4">
        {fields.map((field) => (
          <div key={field.id} className="space-y-1">
            <label className="block font-semibold">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>

            {field.helpText && (
              <p className="text-xs text-gray-500 mb-1">{field.helpText}</p>
            )}

            {field.type === "text" && (
              <input
                type="text"
                required={field.required}
                minLength={field.minLength}
                maxLength={field.maxLength}
                className="w-full border px-3 py-2 rounded"
              />
            )}

            {field.type === "textarea" && (
              <textarea
                required={field.required}
                minLength={field.minLength}
                maxLength={field.maxLength}
                className="w-full border px-3 py-2 rounded"
              />
            )}

            {field.type === "dropdown" && (
              <select
                required={field.required}
                className="w-full border px-3 py-2 rounded"
              >
                {field.options?.map((option, i) => (
                  <option key={i} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}

            {field.type === "checkbox" && (
              <input type="checkbox" className="mr-2" />
            )}

            {field.type === "date" && (
              <input type="date" className="w-full border px-3 py-2 rounded" />
            )}
          </div>
        ))}
      </form>
    </div>
  );
};
