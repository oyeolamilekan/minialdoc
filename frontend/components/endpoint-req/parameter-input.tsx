import React from "react"
import { Parameter } from "../../interfaces"
import { Label } from "../../components/ui/label"
import { Input } from "../../components/ui/input"

export const ParameterInput: React.FC<{
  parameter: Parameter
  value: string
  onChange: (name: string, value: string) => void
}> = ({ parameter, value, onChange }) => {
  return (
    <div className="mb-4 p-4 border rounded">
      <div className="flex flex-col space-y-2">
        <Label htmlFor={parameter.name} className="font-semibold">
          {parameter.name}
          {parameter.required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        <Input
          id={parameter.name}
          type={parameter.type === 'number' ? 'number' : 'text'}
          value={value}
          onChange={(e) => onChange(parameter.name, e.target.value)}
          placeholder={parameter.description}
          required={parameter.required}
        />
        <p className="text-sm text-gray-500">{parameter.description}</p>
        <p className="text-xs text-gray-400">Type: {parameter.type}</p>
        <p className="text-xs text-gray-400">Parameter Type: {parameter.isPathParam ? 'Path' : 'Query'}</p>
      </div>
    </div>
  )
}