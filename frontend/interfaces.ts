export interface Parameter {
  name: string
  type: string
  description: string
  required: boolean
  defaultValue?: string
  isPathParam?: boolean
}

export interface RequestBodyField {
  name: string
  type: string
  description: string
  required: boolean
  defaultValue: string
  fields?: RequestBodyField[]
}

export interface AuthHeader {
  type: 'None' | 'Bearer Token' | 'API Key' | 'Basic Auth'
  key: string
  value: string
}

export interface SampleResponse {
  statusCode: number
  description: string
  body: string
}

export interface APIEndpoint {
  id: number
  sectionId: number
  projectId: number
  title: string
  slug: string
  endpoint_type: string
  body: Endpoint
  createdAt: string
  updatedAt: string
}

export interface Endpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  path: string
  description: string
  parameters: Parameter[]
  requestBody: RequestBodyField[]
  responseExample: string
  authHeader: AuthHeader
  sampleResponses: SampleResponse[]
}

export interface Section {
  id: number
  title: string
  slug: string
  endpoints: EndpointData[]
}

export interface EndpointData {
  id: number
  title: string
  slug: string
  method: string
  endpoint_type: string
}

interface PlanFeatures {
  users: string;
  storage: string;
  support: string;
}

export interface Plan {
  id: number;
  public_id: string;
  name: string;
  description: string;
  price: string;
  interval: string;
  features: PlanFeatures;
  created_at: string;
  updated_at: string;
  recommended?: boolean;
}