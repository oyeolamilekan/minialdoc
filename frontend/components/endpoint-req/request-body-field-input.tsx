/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react"
import { RequestBodyField } from "../../interfaces"
import { Label } from "../ui/label"
import { Input } from "../ui/input"

export const RequestBodyFieldInput: React.FC<{
  field: RequestBodyField
  value: unknown
  onChange: (name: string, value: any) => void
  depth?: number
}> = ({ field, value, onChange, depth = 0 }) => {
  if (field.type === 'object' && field.fields) {
    const objectValue = (typeof value === 'object' && value !== null) ? value : {};
    return (
      <div className={`mb-4 ${depth > 0 ? 'ml-4' : ''}`}>
        <Label className="block mb-2 font-bold">{field.name}</Label>
        {field.fields.map((nestedField) => (
          <RequestBodyFieldInput
            key={nestedField.name}
            field={nestedField}
            value={(objectValue as Record<string, unknown>)[nestedField.name]}
            onChange={(nestedName, nestedValue) => {
              const updatedValue = {
                ...(objectValue as Record<string, unknown>),
                [nestedName]: nestedValue
              };
              onChange(field.name, updatedValue);
            }}
            depth={depth + 1}
          />
        ))}
      </div>
    )
  }

  return (
    <div className={`mb-4 ${depth > 0 ? 'ml-4' : ''}`}>
      <Label htmlFor={field.name} className="block mb-2">
        {field.name}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Input
        id={field.name}
        type={field.type === 'number' ? 'number' : 'text'}
        value={typeof value === 'string' || typeof value === 'number' ? String(value) : ''}
        onChange={(e) => {
          const newValue = field.type === 'number' ? parseFloat(e.target.value) : e.target.value;
          onChange(field.name, newValue);
        }}
        placeholder={field.description}
        required={field.required}
      />
    </div>
  )
}