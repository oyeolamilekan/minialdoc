/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react"
import { Endpoint } from "@/interfaces"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ParameterInput } from "./parameter-input"
import { Label } from "../ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { RequestBodyFieldInput } from "./request-body-field-input"
import { Button } from "../ui/button"
import { makeApiRequest } from "@/app/actions"
import { CodeSnippet } from "../ui/code-snippet"

const ResponseBadge: React.FC<{ status: number }> = ({ status }) => {
  let variant: "default" | "secondary" | "destructive" | "outline"
  let label: string

  if (status >= 200 && status < 300) {
    variant = "default"
    label = "Success"
  } else if (status >= 300 && status < 400) {
    variant = "secondary"
    label = "Redirection"
  } else if (status >= 400 && status < 500) {
    variant = "destructive"
    label = "Client Error"
  } else if (status >= 500) {
    variant = "outline"
    label = "Server Error"
  } else {
    variant = "outline"
    label = "Unknown"
  }

  return (
    <Badge variant={variant} className="mr-2">
      {status} - {label}
    </Badge>
  )
}

export const EndpointTester: React.FC<{
  endpoint: Endpoint
  updateEndpoint: (updatedEndpoint: Endpoint) => void
  baseUrl: string
}> = ({ endpoint, updateEndpoint, baseUrl }) => {

  const [paramValues, setParamValues] = useState<Record<string, string>>(() => {
    const initialValues: Record<string, string> = {}
    endpoint.parameters.forEach(param => {
      initialValues[param.name] = param.defaultValue || ''
    })
    return initialValues
  })

  const [bodyValues, setBodyValues] = useState<Record<string, any>>({})
  const [apiKey, setApiKey] = useState('')
  const [response, setResponse] = useState<{ status: number; data: any } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [finalPath, setFinalPath] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const constructPath = () => {
      try {
        const substituteUrlValues = (url: string, values: Record<string, string>): string => {
          return url.replace(/\{(\w+)\}/g, (match, key) => {
            if (values[key] === null || values[key] === '') {
              return match;
            }
            return values[key] !== undefined ? encodeURIComponent(values[key]) : match;
          });
        };

        let basePath = endpoint.path;
        basePath = substituteUrlValues(basePath, paramValues);
        const queryParamsMap = new Map<string, string>();
        endpoint.parameters.forEach(param => {
          if (!param.isPathParam && paramValues[param.name] !== undefined && paramValues[param.name] !== '') {
            const key = param.name;
            const value = encodeURIComponent(paramValues[param.name]);
            queryParamsMap.set(key, value !== 'undefined' ? value : '');
          }
        });

        setFinalPath(`${baseUrl}${basePath}`);
        setError(null);
      } catch (err) {
        setError(`Error constructing path: ${err instanceof Error ? err.message : String(err)}`);
      }
    };

    constructPath();
  }, [endpoint.path, endpoint.parameters, paramValues, baseUrl]);

  const handleParamChange = (name: string, value: string) => {
    const extractedValue = value.match(/^\{(.+)\}$/)
    const finalValue = extractedValue ? extractedValue[1] : value

    setParamValues((prev) => ({ ...prev, [name]: finalValue }))

    const updatedParameters = endpoint.parameters.map(param =>
      param.name === name ? { ...param, defaultValue: finalValue } : param
    )
    updateEndpoint({ ...endpoint, parameters: updatedParameters })
  }

  const handleBodyChange = (name: string, value: string) => {
    setBodyValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setResponse(null)
    setError(null)

    try {
      const result = await makeApiRequest({
        completeUrl: finalPath,
        method: endpoint.method,
        params: paramValues,
        body: bodyValues,
        authHeader: {
          ...endpoint.authHeader,
          value: apiKey || endpoint.authHeader.value
        }
      })

      setResponse(result)
    } catch (error) {
      setError(`Error making API request: ${error instanceof Error ? error.message : String(error)}`)
      setResponse({ status: 500, data: { message: "An error occurred" } })
    } finally {
      setIsLoading(false)
    }
  }

  const generateCodeSamples = () => {
    const headers: Record<string, string> = {}
    let body: string | null = null

    if (endpoint.authHeader.type === 'Bearer Token') {
      headers['Authorization'] = `Bearer ${apiKey || endpoint.authHeader.value}`
    } else if (endpoint.authHeader.type === 'API Key') {
      headers[endpoint.authHeader.key] = apiKey || endpoint.authHeader.value
    }

    if (endpoint.method !== 'GET' && endpoint.requestBody.length > 0) {
      body = JSON.stringify(bodyValues, null, 2)
    }

    const javaScriptCode = `
fetch(
'${finalPath}', {
  method: '${endpoint.method}',
  headers: ${JSON.stringify(headers, null, 2)},
  ${body ? `body: JSON.stringify(${body}),` : ''}
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
`.trim()

    const pythonCode = `
import requests

url = '${finalPath}'
headers = ${JSON.stringify(headers, null, 2)}
${body ? `payload = ${body}` : ''}

response = requests.${endpoint.method.toLowerCase()}(url, headers=headers${body ? ', json=payload' : ''})
print(response.json())
`.trim()

    const rubyCode = `
require 'net/http'
require 'uri'
require 'json'

uri = URI('${finalPath}')
http = Net::HTTP.new(uri.host, uri.port)
http.use_ssl = (uri.scheme == 'https')

request = Net::HTTP::${endpoint.method}.new(uri)
${Object.entries(headers).map(([key, value]) => `request['${key}'] = '${value}'`).join('\n')}
${body ? `request.body = ${body}` : ''}

response = http.request(request)
puts JSON.parse(response.body)
`.trim()

    const curlCode = `
curl -X ${endpoint.method} '${finalPath}' \\
${Object.entries(headers).map(([key, value]) => `     -H '${key}: ${value}' \\`).join('\n')}
     -H 'Content-Type: application/json'${body ? ` \\
     -d '
${body}
'` : ''}
`.trim()

    return { javaScriptCode, pythonCode, rubyCode, curlCode }
  }

  const { javaScriptCode, pythonCode, curlCode, rubyCode } = generateCodeSamples()

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Badge variant={endpoint.method === 'GET' ? 'secondary' : 'default'}>
            {endpoint.method}
          </Badge>
          <span className="text-[0.9rem] whitespace-pre-wrap break-all">{finalPath}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        <div className="flex md:space-x-14 space-y-8 md:space-y-0 md:flex-row flex-col justify-center">
          <div className="md:w-1/2 w-full">
            <form onSubmit={handleSubmit} className="my-5">
              <div className="mb-4 space-y-1">
                <h3 className="font-bold text-xl">Description</h3>
                <p>{endpoint.description}</p>
              </div>
              <div className="mb-4 space-y-1">
                {endpoint.authHeader.type !== 'None' && <>
                  <h3 className="font-bold text-xl">Authentication</h3>
                  <p><strong>Type:</strong> {endpoint.authHeader.type}</p>
                  {endpoint.authHeader.type === 'API Key' && (
                    <p><strong>Header Key:</strong> {endpoint.authHeader.key}</p>
                  )}
                  <div className="mt-2">
                    <Label htmlFor="apiKey">API Key / Token</Label>
                    <Input
                      id="apiKey"
                      type="text"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Enter your API key or token"
                      className="mt-1"
                    />
                  </div>
                </>
                }
              </div>

              {endpoint.parameters.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Parameters</h3>
                  <div className="w-full">
                    {endpoint.parameters.map((param) => (
                      <ParameterInput
                        key={param.name}
                        parameter={param}
                        value={paramValues[param.name] || ''}
                        onChange={handleParamChange}
                      />
                    ))}
                  </div>
                </div>
              )}

              {endpoint.requestBody.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Request Body</h3>
                  {endpoint.requestBody.map((field) => (
                    <RequestBodyFieldInput
                      key={field.name}
                      field={field}
                      value={bodyValues[field.name] || ''}
                      onChange={handleBodyChange}
                    />
                  ))}
                </div>
              )}

              <Button type="submit" disabled={isLoading} size={"sm"}>
                {isLoading ? 'Sending...' : 'Send Request'}
              </Button>
            </form>
            {endpoint.sampleResponses.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Sample Responses</h3>
                <Accordion type="single" collapsible>
                  {endpoint.sampleResponses.map((sampleResponse, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger>
                        <div className="flex items-center space-x-2">
                          <ResponseBadge status={sampleResponse.statusCode} />
                          <span>{sampleResponse.description}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <CodeSnippet
                          code={sampleResponse.body}
                          language="json"
                        />
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}
          </div>

          <div className="md:w-1/2 w-full">
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Response</h3>
              <div className="flex items-center mb-2">
                {response?.status && <ResponseBadge status={response?.status} />}
                <span className="text-sm text-gray-500">Received at: {new Date().toLocaleTimeString()}</span>
              </div>
              {response?.status && <CodeSnippet
                code={JSON.stringify(response?.data, null, 2)}
                language="json"
              />}
            </div>
            <Tabs defaultValue="javascript" className="mt-6">
              <TabsList>
                <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                <TabsTrigger value="python">Python</TabsTrigger>
                <TabsTrigger value="curl">cURL</TabsTrigger>
                <TabsTrigger value="ruby">Ruby</TabsTrigger>
              </TabsList>
              <TabsContent value="javascript">
                <CodeSnippet
                  code={javaScriptCode}
                  language="javascript"
                />
              </TabsContent>
              <TabsContent value="python">
                <CodeSnippet
                  code={pythonCode}
                  language="python"
                />
              </TabsContent>
              <TabsContent value="curl">
                <CodeSnippet
                  code={curlCode}
                  language="curl"
                />
              </TabsContent>
              <TabsContent value="ruby">
                <CodeSnippet
                  code={rubyCode}
                  language="ruby"
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}