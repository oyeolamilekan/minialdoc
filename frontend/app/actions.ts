'use server';

import { AuthHeader } from '@/interfaces';
import { revalidatePath } from 'next/cache';

interface MakeApiRequestParams {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  completeUrl: string;
  params?: Record<string, string>;
  body?: Record<string, unknown>;
  headers?: Record<string, string> | Headers;
  authHeader?: AuthHeader;
}

interface ApiResponse<T> {
  status: number;
  data: T;
}

export async function makeApiRequest<T>({
  completeUrl,
  method,
  params,
  body,
  headers: initialHeaders = {},
  authHeader
}: MakeApiRequestParams): Promise<ApiResponse<T>> {
  const url = new URL(completeUrl);

  // Add query parameters
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }

  // Create a new Headers object
  const headers = new Headers();

  // If initialHeaders is a Headers object, convert it to a plain object
  const headersObj = initialHeaders instanceof Headers 
    ? Object.fromEntries(initialHeaders.entries()) 
    : initialHeaders;

  // Add initial headers
  Object.entries(headersObj).forEach(([key, value]) => {
    headers.set(key, value);
  });

  // Set content type if not already set
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  // Add auth header
  if (authHeader) {
    if (authHeader.type === 'Bearer Token') {
      headers.set('Authorization', `Bearer ${authHeader.value}`);
    } else if (authHeader.type === 'API Key') {
      headers.set(authHeader.key, authHeader.value);
    }
  }

  try {
    console.log('Request URL:', url.toString());
    console.log('Request method:', method);
    console.log('Request headers:', Object.fromEntries(headers.entries()));
    if (body) console.log('Request body:', JSON.stringify(body));

    const response = await fetch(url.toString(), {
      method,
      headers,
      body: method !== 'GET' && body ? JSON.stringify(body) : undefined,
    });

    let data: T;

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const textData = await response.text();
      console.warn('Received non-JSON response:', textData);
      data = { message: 'Received non-JSON response' } as T;
    }

    console.log('Response status:', response.status);
    console.log('Response data:', data);

    revalidatePath('/');

    return {
      status: response.status,
      data
    };
  } catch (error) {
    console.error('Error making API request:', error);
    return {
      status: 500,
      data: { message: 'An error occurred while making the API request' } as T
    };
  }
}