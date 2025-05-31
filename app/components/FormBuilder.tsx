// app/components/FormBuilder.tsx
import React, { useState } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableField } from "./SortableField";
import { FieldEditor } from "./FieldEditor";
import { FormPreview } from "./FormPreview";
import type { Field, FieldType } from "~/types";
import { nanoid } from "nanoid";

const FIELD_TYPES: { label: string; type: FieldType }[] = [
  { label: "Text", type: "text" },
  { label: "Textarea", type: "textarea" },
  { label: "Dropdown", type: "dropdown" },
  { label: "Checkbox", type: "checkbox" },
  { label: "Date", type: "date" },
];

interface Step {
  id: string;
  title: string;
  fields: Field[];
}

export function FormBuilder() {
  const [steps, setSteps] = useState<Step[]>([
    { id: nanoid(), title: "Step 1", fields: [] },
  ]);
  const [selectedStepId, setSelectedStepId] = useState<string>(steps[0].id);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<"desktop" | "tablet" | "mobile">("desktop");

  const selectedStep = steps.find((s) => s.id === selectedStepId)!;
  const fields = selectedStep.fields;
  const selectedField = fields.find((f) => f.id === selectedFieldId) || null;

  const addField = (type: FieldType) => {
    const newField: Field = {
      id: nanoid(),
      type,
      label: `${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      required: false,
    };
    if (type === "dropdown") {
      newField.options = ["Option 1", "Option 2"];
    }

    const newFields = [...fields, newField];
    updateStepFields(selectedStepId, newFields);
    setSelectedFieldId(newField.id);
  };

  const updateStepFields = (stepId: string, newFields: Field[]) => {
    setSteps((steps) =>
      steps.map((step) =>
        step.id === stepId ? { ...step, fields: newFields } : step
      )
    );
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((f) => f.id === active.id);
      const newIndex = fields.findIndex((f) => f.id === over.id);
      const newFields = arrayMove(fields, oldIndex, newIndex);
      updateStepFields(selectedStepId, newFields);
    }
  };

  const updateField = (updatedField: Field) => {
    const newFields = fields.map((f) =>
      f.id === updatedField.id ? updatedField : f
    );
    updateStepFields(selectedStepId, newFields);
  };

  const updateStepTitle = (title: string) => {
    setSteps((steps) =>
      steps.map((step) =>
        step.id === selectedStepId ? { ...step, title } : step
      )
    );
  };

  const addStep = () => {
    const newStep: Step = {
      id: nanoid(),
      title: `Step ${steps.length + 1}`,
      fields: [],
    };
    setSteps((prev) => [...prev, newStep]);
    setSelectedStepId(newStep.id);
    setSelectedFieldId(null);
  };

  const selectStep = (id: string) => {
    setSelectedStepId(id);
    setSelectedFieldId(null);
  };

  return (
    <div className="flex space-x-6 p-6 bg-gray-50 min-h-screen">
      {/* Sidebar */}
      <aside className="w-48 bg-white rounded shadow p-4 space-y-4">
        <h2 className="font-bold text-lg mb-2">Add Field</h2>
        {FIELD_TYPES.map(({ label, type }) => (
          <button
            key={type}
            type="button"
            onClick={() => addField(type)}
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
          >
            {label}
          </button>
        ))}

        <hr className="my-4" />

        <h2 className="font-bold text-lg mb-2">Steps</h2>
        <div className="space-y-2">
          {steps.map((step) => (
            <button
              key={step.id}
              type="button"
              onClick={() => selectStep(step.id)}
              className={`w-full text-left px-3 py-2 rounded ${
                step.id === selectedStepId
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {step.title}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={addStep}
          className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          + Add Step
        </button>
      </aside>

      {/* Fields List */}
      <main className="flex-1 flex flex-col space-y-4">
        <h2 className="text-xl font-bold">Fields in "{selectedStep.title}"</h2>
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={fields.map((f) => f.id)}
            strategy={verticalListSortingStrategy}
          >
            {fields.map((field) => (
              <SortableField
                key={field.id}
                field={field}
                isSelected={field.id === selectedFieldId}
                onSelect={() => setSelectedFieldId(field.id)}
              >
                <div>
                  <p className="font-semibold">{field.label}</p>
                  <p className="text-sm text-gray-500">{field.type}</p>
                </div>
              </SortableField>
            ))}
          </SortableContext>
        </DndContext>
      </main>

      {/* Field Editor */}
      <section className="w-96 bg-white rounded shadow p-4">
        <h2 className="text-xl font-bold mb-4">Field Settings</h2>
        {selectedField ? (
          <FieldEditor
            field={selectedField}
            onChange={updateField}
            stepTitle={selectedStep.title}
            onStepTitleChange={updateStepTitle}
          />
        ) : (
          <p className="text-gray-500 italic">Select a field to edit</p>
        )}
      </section>

      {/* Preview Panel */}
      <section className="w-96 bg-white rounded shadow p-4">
        <h2 className="text-xl font-bold mb-2">Form Preview</h2>

        {/* Preview Mode Selector */}
        <div className="mb-4 space-x-2">
          {["desktop", "tablet", "mobile"].map((mode) => (
            <button
              key={mode}
              onClick={() => setPreviewMode(mode as typeof previewMode)}
              className={`px-3 py-1 rounded border text-sm ${
                previewMode === mode ? "bg-indigo-600 text-white" : "bg-white"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        <FormPreview fields={fields} previewMode={previewMode} />
      </section>
    </div>
  );
}
