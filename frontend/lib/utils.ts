import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getMethodColor = (method: string) => {
  const colors = {
    GET: 'bg-blue-500',
    POST: 'bg-green-500',
    PUT: 'bg-yellow-500',
    PATCH: 'bg-orange-500',
    DELETE: 'bg-red-500',
    OPTIONS: 'bg-purple-500',
    HEAD: 'bg-gray-500'
  };

  const upperMethod = method.toUpperCase() as HttpMethod;
  return colors[upperMethod] || 'bg-gray-500';
}

export const renderErrorMessage = (error: unknown) => {
  if (typeof error === 'string') {
    return error;
  }
  return null;
};

export const redirectUrl = (url: string) => window.open(url, "_self")

export const pushToNewTab = (route: string) => window.open(route, "_blank");

export function getSubdomain(hostname: string | null): string | null {
  if (!hostname) return null;

  // Check if we're in a development environment
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Define the base domain
  const baseDomain = isDevelopment ? 'localhost:3000' : process.env.BASE_DOMAIN;

  if (!baseDomain) {
    console.error('Base domain is not defined');
    return null;
  }

  // Remove the base domain from the hostname
  const subdomain = hostname.replace(`.${baseDomain}`, '');

  // If the subdomain is the same as the hostname, it means we're on the root domain
  return subdomain === hostname ? null : subdomain;
}

export const truncateWithDots = (
  text: string,
  limit: number = 18,
  ending: string = '......'
): string => {
  if (!text) return '';
  if (text.length <= limit) return text;
  
  return text.slice(0, limit) + ending;
};

export const openDoc = (slug: string) => {
  const baseDomain = process.env.PUBLIC_APPLICATION_DOMAIN || 'minialdoc.com'
  open(`https://${slug}.${baseDomain}`)
}