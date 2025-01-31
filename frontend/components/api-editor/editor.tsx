import React from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, Trash2 } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { AuthHeaderEditor } from "./euth-editor"
import { AuthHeader, Endpoint, Parameter, RequestBodyField, SampleResponse } from "@/interfaces"
import { FieldEditor } from "./field-editor"


const statusCodes = [
  { value: 200, label: "200 OK" },
  { value: 201, label: "201 Created" },
  { value: 204, label: "204 No Content" },
  { value: 400, label: "400 Bad Request" },
  { value: 401, label: "401 Unauthorized" },
  { value: 403, label: "403 Forbidden" },
  { value: 404, label: "404 Not Found" },
  { value: 500, label: "500 Internal Server Error" },
  { value: 503, label: "503 Service Unavailable" }
]

export const EndpointEditor: React.FC<{
  endpoint: Endpoint,
  save: () => void,
  updateEndpoint: (updatedEndpoint: Endpoint) => void,
  isUpdatingAPIEndpoint: boolean
}> = ({ endpoint, save, updateEndpoint, isUpdatingAPIEndpoint }) => {
  const addParameter = () => {
    const newParameter: Parameter = { name: '', type: 'string', description: '', required: false, defaultValue: '', isPathParam: false }
    updateEndpoint({
      ...endpoint,
      parameters: [...endpoint.parameters, newParameter]
    })
  }

  const updateParameter = (updatedParameter: Parameter, index: number) => {
    const newParameters = [...endpoint.parameters]
    newParameters[index] = updatedParameter
    updateEndpoint({ ...endpoint, parameters: newParameters })
  }

  const deleteParameter = (parameterToDelete: Parameter) => {
    updateEndpoint({
      ...endpoint,
      parameters: endpoint.parameters?.filter(p => p !== parameterToDelete)
    })
  }

  const addRequestBodyField = () => {
    const newField: RequestBodyField = { name: '', type: 'string', description: '', required: false, defaultValue: '' }
    updateEndpoint({
      ...endpoint,
      requestBody: [...endpoint.requestBody, newField]
    })
  }

  const updateRequestBodyField = (updatedField: RequestBodyField, index: number) => {
    const newRequestBody = [...endpoint.requestBody]
    newRequestBody[index] = updatedField
    updateEndpoint({ ...endpoint, requestBody: newRequestBody })
  }

  const deleteRequestBodyField = (fieldToDelete: RequestBodyField) => {
    updateEndpoint({
      ...endpoint,
      requestBody: endpoint.requestBody.filter(f => f !== fieldToDelete)
    })
  }

  const updateAuthHeader = (updatedAuthHeader: AuthHeader) => {
    updateEndpoint({ ...endpoint, authHeader: updatedAuthHeader })
  }

  const addSampleResponse = () => {
    const newSampleResponse: SampleResponse = {
      statusCode: 200,
      description: '',
      body: '{}'
    }
    updateEndpoint({
      ...endpoint,
      sampleResponses: [...endpoint.sampleResponses, newSampleResponse]
    })
  }

  const updateSampleResponse = (updatedResponse: SampleResponse, index: number) => {
    const newSampleResponses = [...endpoint.sampleResponses]
    newSampleResponses[index] = updatedResponse
    updateEndpoint({ ...endpoint, sampleResponses: newSampleResponses })
  }

  const deleteSampleResponse = (index: number) => {
    const newSampleResponses = [...endpoint.sampleResponses]
    newSampleResponses.splice(index, 1)
    updateEndpoint({ ...endpoint, sampleResponses: newSampleResponses })
  }

  const saveData = () => {
    save()
  }

  return (
    <Card className="mb-4 border-none shadow-none">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Select
              value={endpoint.method}
              onValueChange={(value: Endpoint['method']) => updateEndpoint({ ...endpoint, method: value })}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GET">GET</SelectItem>
                <SelectItem value="POST">POST</SelectItem>
                <SelectItem value="PUT">PUT</SelectItem>
                <SelectItem value="DELETE">DELETE</SelectItem>
                <SelectItem value="PATCH">PATCH</SelectItem>
              </SelectContent>
            </Select>
            <Input
              value={endpoint.path}
              onChange={(e) => updateEndpoint({ ...endpoint, path: e.target.value })}
              placeholder="Path"
              className="flex-1"
            />
          </div>
          
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="details" className="w-full">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="auth">Auth</TabsTrigger>
            <TabsTrigger value="parameters">Parameters</TabsTrigger>
            <TabsTrigger value="request">Request Body</TabsTrigger>
            <TabsTrigger value="sampleResponses">Sample Responses</TabsTrigger>
          </TabsList>
          <TabsContent value="details">
            <Textarea
              value={endpoint.description}
              onChange={(e) => updateEndpoint({ ...endpoint, description: e.target.value })}
              placeholder="Endpoint description"
              className="w-full h-32"
            />
          </TabsContent>
          <TabsContent value="auth">
            <AuthHeaderEditor
              authHeader={endpoint.authHeader}
              updateAuthHeader={updateAuthHeader}
            />
          </TabsContent>
          <TabsContent value="parameters">
            {endpoint.parameters?.map((param, index) => (
              <FieldEditor
                key={index}
                field={param}
                updateField={(updatedParam) => updateParameter(updatedParam as Parameter, index)}
                deleteField={() => deleteParameter(param)}
                isParameter={true}
              />
            ))}
            <Button onClick={addParameter} className="my-2">
              <PlusCircle className="h-4 w-4 mr-2" /> Add Parameter
            </Button>
          </TabsContent>
          <TabsContent value="request">
            {endpoint.requestBody.map((field, index) => (
              <FieldEditor
                key={index}
                field={field}
                updateField={(updatedField) => updateRequestBodyField(updatedField as RequestBodyField, index)}
                deleteField={() => deleteRequestBodyField(field)}
              />
            ))}
            <Button onClick={addRequestBodyField} className="my-2">
              <PlusCircle className="h-4 w-4 mr-2" /> Add Request Body Field
            </Button>
          </TabsContent>
          <TabsContent value="sampleResponses">
            {endpoint.sampleResponses.map((response, index) => (
              <div key={index} className="mb-4 p-4 border rounded">
                <div className="flex items-center space-x-2 mb-2">
                  <Select
                    value={response.statusCode.toString()}
                    onValueChange={(value) => updateSampleResponse({ ...response, statusCode: parseInt(value) }, index)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Status Code" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusCodes.map((code) => (
                        <SelectItem key={code.value} value={code.value.toString()}>
                          {code.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    value={response.description}
                    onChange={(e) => updateSampleResponse({ ...response, description: e.target.value }, index)}
                    placeholder="Description"
                    className="flex-1"
                  />
                  <Button variant="destructive" size="icon" onClick={() => deleteSampleResponse(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <Textarea
                  value={response.body}
                  onChange={(e) => updateSampleResponse({ ...response, body: e.target.value }, index)}
                  placeholder="Response body (JSON)"
                  className="w-full h-32 font-mono"
                />
              </div>
            ))}
            <Button onClick={addSampleResponse} className="my-2">
              <PlusCircle className="h-4 w-4 mr-2" /> Add Sample Response
            </Button>
          </TabsContent>
        </Tabs>
        <Button 
          onClick={saveData} 
          className="my-3" 
          disabled={isUpdatingAPIEndpoint}
        >
          {isUpdatingAPIEndpoint ? 'Saving': 'Save'}
        </Button>
      </CardContent>
    </Card>
  )
}