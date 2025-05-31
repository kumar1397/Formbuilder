import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableField } from "~/components/SortableField";
import { FormPreview } from "~/components/FormPreview";
import type { Field, FieldType } from "~/types";

type PreviewMode = "desktop" | "tablet" | "mobile";

export default function Index() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="flex justify-between items-center p-4 bg-white shadow-sm">
        <div
          className="text-2xl font-extrabold tracking-tight cursor-pointer"
          style={{ color: "#4C3B9B" }}
        >
          Hypergro
        </div>
        <nav className="flex space-x-6 text-sm font-semibold uppercase text-gray-700">
          <a href="#" className="hover:text-purple-600 transition">
            Home
          </a>
          <a href="#" className="hover:text-purple-600 transition">
            About
          </a>
          <a href="#" className="hover:text-purple-600 transition">
            Contact
          </a>
        </nav>
      </header>

      {/* Main content */}
      {isClient ? (
        <ClientFormBuilder />
      ) : (
        <p className="text-center py-10">Loading...</p>
      )}
    </div>
  );
}

function ClientFormBuilder() {
  const [fields, setFields] = useState<Field[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<PreviewMode>("desktop");

  // For URL generation
  const [shareableUrl, setShareableUrl] = useState<string>("");

  const addField = (type: FieldType) => {
    const newField: Field = {
      id: uuidv4(),
      type,
      label: `${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      placeholder: "",
      required: false,
      helpText: "",
      options: type === "dropdown" ? ["Option 1", "Option 2"] : undefined,
      value: type === "checkbox" ? false : "",
    };
    setFields((f) => [...f, newField]);
    setSelectedFieldId(newField.id);
  };

  const updateField = (id: string, key: keyof Field, value: any) => {
    setFields((fields) =>
      fields.map((field) => (field.id === id ? { ...field, [key]: value } : field))
    );
  };

  const updateOptions = (id: string, idx: number, value: string) => {
    setFields((fields) =>
      fields.map((field) => {
        if (field.id === id && field.options) {
          const newOptions = [...field.options];
          newOptions[idx] = value;
          return { ...field, options: newOptions };
        }
        return field;
      })
    );
  };

  const addOption = (id: string) => {
    setFields((fields) =>
      fields.map((field) => {
        if (field.id === id && field.options) {
          return {
            ...field,
            options: [...field.options, `Option ${field.options.length + 1}`],
          };
        }
        return field;
      })
    );
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = fields.findIndex((f) => f.id === active.id);
      const newIndex = fields.findIndex((f) => f.id === over.id);
      setFields(arrayMove(fields, oldIndex, newIndex));
    }
  };

  // Generate shareable URL (store JSON in localStorage and create a URL with a query param)
  const generateShareableUrl = () => {
    const formJson = JSON.stringify(fields);
    const id = uuidv4();

    // Save to localStorage with id
    localStorage.setItem(`form-builder-${id}`, formJson);

    // Build URL with param, e.g., ?formId=UUID
    const url = `${window.location.origin}${window.location.pathname}?formId=${id}`;
    setShareableUrl(url);
  };

  return (
    <div className="flex flex-col md:flex-row max-w-7xl mx-auto p-4 gap-6 min-h-[80vh]">
      <aside className="w-full md:w-1/4 bg-white p-4 rounded-xl shadow-md flex flex-col">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Add Field</h2>
        {(["text", "textarea", "dropdown", "checkbox", "date"] as FieldType[]).map(
          (type) => (
            <button
              key={type}
              onClick={() => addField(type)}
              className="w-full mb-2 py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              + Add {type}
            </button>
          )
        )}

        <label className="mt-4 block font-semibold text-gray-800 mb-1">Preview Mode</label>
        <select
          value={previewMode}
          onChange={(e) => setPreviewMode(e.target.value as PreviewMode)}
          className="border rounded p-2 mb-4"
        >
          <option value="desktop">Desktop</option>
          <option value="tablet">Tablet</option>
          <option value="mobile">Mobile</option>
        </select>

        {/* Generate URL button */}
        <button
          onClick={generateShareableUrl}
          className="mt-auto py-2 px-4 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition"
        >
          Generate Shareable URL
        </button>

        {/* Show shareable URL */}
        {shareableUrl && (
          <div className="mt-4 break-all text-sm text-purple-900 bg-purple-100 p-2 rounded">
            <strong>Shareable URL:</strong>{" "}
            <a href={shareableUrl} target="_blank" rel="noopener noreferrer" className="underline">
              {shareableUrl}
            </a>
          </div>
        )}
      </aside>

      <main className="w-full md:w-3/4 flex flex-col">
        <div className="bg-white p-4 rounded-xl shadow-md mt-auto">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Form Preview</h2>
          <FormPreview fields={fields} previewMode={previewMode} />
          <div className="mt-6 text-right">
            <button
              type="button"
              className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
              onClick={() => alert("Form submitted!")}
            >
              Submit
            </button>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-md mt-6 flex-grow overflow-auto">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Builder</h2>
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext
              items={fields.map((f) => f.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-6">
                {fields.map((field) => (
                  <SortableField
                    key={field.id}
                    field={field}
                    isSelected={field.id === selectedFieldId}
                    onSelect={() => setSelectedFieldId(field.id)}
                  >
                    <label className="block font-semibold mb-1">Label</label>
                    <input
                      type="text"
                      value={field.label}
                      onChange={(e) => updateField(field.id, "label", e.target.value)}
                      className="border p-2 w-full rounded mb-3"
                    />

                    {field.type !== "checkbox" && (
                      <>
                        <label className="block font-semibold mb-1">Placeholder</label>
                        <input
                          type="text"
                          value={field.placeholder || ""}
                          onChange={(e) =>
                            updateField(field.id, "placeholder", e.target.value)
                          }
                          className="border p-2 w-full rounded mb-3"
                        />
                      </>
                    )}

                    {field.type === "dropdown" && field.options && (
                      <div className="mb-3">
                        <label className="block font-semibold mb-1">Options</label>
                        {field.options.map((opt, idx) => (
                          <input
                            key={idx}
                            type="text"
                            value={opt}
                            onChange={(e) => updateOptions(field.id, idx, e.target.value)}
                            className="border p-2 w-full rounded mb-1"
                          />
                        ))}
                        <button
                          type="button"
                          onClick={() => addOption(field.id)}
                          className="mt-1 text-purple-600 hover:underline"
                        >
                          + Add Option
                        </button>
                      </div>
                    )}

                    <label className="block font-semibold mb-1">Help Text</label>
                    <input
                      type="text"
                      value={field.helpText || ""}
                      onChange={(e) => updateField(field.id, "helpText", e.target.value)}
                      className="border p-2 w-full rounded mb-3"
                    />

                    <label className="inline-flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={field.required || false}
                        onChange={(e) => updateField(field.id, "required", e.target.checked)}
                        className="form-checkbox h-5 w-5 text-purple-600"
                      />
                      <span>Required</span>
                    </label>
                  </SortableField>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </main>
    </div>
  );
}
