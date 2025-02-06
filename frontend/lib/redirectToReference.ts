import { fetchProjectWithEndpoint } from '@/endpoints/api-projects'

export async function redirectToReference(domain: string) {

  try {
    const response = await fetchProjectWithEndpoint(domain)
    const slug = response.data?.slug
    return slug
  } catch (error) {
    console.error('Failed to redirect to reference:', error)
  }
}