// app/components/SortableField.tsx
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import clsx from "clsx";
import type { Field } from "~/types";
import type { ReactNode } from "react";

interface SortableFieldProps {
  field: Field;
  isSelected: boolean;
  onSelect: () => void;
  children: ReactNode;
}

export function SortableField({ field, isSelected, onSelect, children }: SortableFieldProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: field.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={clsx(
        "border rounded-lg p-4 shadow-sm cursor-pointer relative",
        isSelected ? "border-indigo-500 bg-indigo-50" : "border-gray-200 bg-white"
      )}
      onClick={onSelect}
    >
      <div
        {...attributes}
        {...listeners}
        className="absolute top-3 left-3 text-gray-400 cursor-move"
        aria-label="Drag handle"
      >
        <GripVertical size={18} />
      </div>
      {children}
    </div>
  );
}
