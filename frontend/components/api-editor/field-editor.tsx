import React, { useState } from "react"
import { Button } from "../../components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { ChevronDown, ChevronRight, PlusCircle, Trash2 } from "lucide-react"
import { Input } from "../../components/ui/input"
import { Parameter, RequestBodyField } from "../../interfaces"
import { Textarea } from "../ui/textarea"

export const FieldEditor: React.FC<{
  field: Parameter | RequestBodyField
  updateField: (updatedField: Parameter | RequestBodyField) => void
  deleteField: (field: Parameter | RequestBodyField) => void
  isParameter?: boolean
  depth?: number
}> = ({ field, updateField, deleteField, isParameter = false, depth = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleToggleExpand = () => {
    if (field.type === 'object') {
      setIsExpanded(!isExpanded)
    }
  }

  const addNestedField = () => {
    if ('fields' in field) {
      const newField: RequestBodyField = {
        name: '',
        type: 'string',
        description: '',
        required: false,
        defaultValue: ''
      }
      updateField({
        ...field,
        fields: [...(field.fields || []), newField]
      } as RequestBodyField)
    }
  }

  const updateNestedField = (index: number, updatedNestedField: RequestBodyField) => {
    const newFields = [...((field as RequestBodyField).fields || [])]
    newFields[index] = updatedNestedField
    updateField({ ...field, fields: newFields } as RequestBodyField)
  }

  const deleteNestedField = (index: number) => {
    const newFields = [...((field as RequestBodyField).fields || [])]
    newFields.splice(index, 1)
    updateField({ ...field, fields: newFields } as RequestBodyField)
  }

  return (
    <div className={`flex flex-col space-y-2 mb-4 p-4 border rounded ${depth > 0 ? 'ml-4' : ''}`}>
      <div className="flex items-center space-x-2">
        {field.type === 'object' && (
          <Button variant="ghost" size="sm" onClick={handleToggleExpand}>
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        )}
        <Input
          value={field.name}
          onChange={(e) => updateField({ ...field, name: e.target.value })}
          placeholder="Name"
          className="flex-1"
        />
        <Select
          value={field.type}
          onValueChange={(value) => {
            updateField({ ...field, type: value, fields: value === 'object' ? [] : undefined } as RequestBodyField)
            if (value === 'object') setIsExpanded(true)
          }}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="string">String</SelectItem>
            <SelectItem value="number">Number</SelectItem>
            <SelectItem value="boolean">Boolean</SelectItem>
            <SelectItem value="object">Object</SelectItem>
            <SelectItem value="array">Array</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={field.required ? 'required' : 'optional'}
          onValueChange={(value) => updateField({ ...field, required: value === 'required' })}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Required" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="required">Required</SelectItem>
            <SelectItem value="optional">Optional</SelectItem>
          </SelectContent>
        </Select>
        {isParameter && (
          <Select
            value={(field as Parameter).isPathParam ? 'path' : 'query'}
            onValueChange={(value) => updateField({ ...field, isPathParam: value === 'path' } as Parameter)}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Parameter Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="path">Path</SelectItem>
              <SelectItem value="query">Query</SelectItem>
            </SelectContent>
          </Select>
        )}
        <Button variant="destructive" size="icon" onClick={() => deleteField(field)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <Textarea
        value={field.description}
        onChange={(e) => updateField({ ...field, description: e.target.value })}
        placeholder="Description"
        className="w-full"
      />
      {!isParameter && field.type !== 'object' && (
        <Input
          value={field.defaultValue}
          onChange={(e) => updateField({ ...field, defaultValue: e.target.value })}
          placeholder="Default Value"
          className="w-full"
        />
      )}
      {field.type === 'object' && isExpanded && (
        <div className="mt-2">
          {(field as RequestBodyField).fields?.map((nestedField, index) => (
            <FieldEditor
              key={index}
              field={nestedField}
              updateField={(updatedField) => updateNestedField(index, updatedField as RequestBodyField)}
              deleteField={() => deleteNestedField(index)}
              depth={depth + 1}
            />
          ))}
          <Button onClick={addNestedField} className="mt-2">
            <PlusCircle className="h-4 w-4 mr-2" /> Add Nested Field
          </Button>
        </div>
      )}
    </div>
  )
}