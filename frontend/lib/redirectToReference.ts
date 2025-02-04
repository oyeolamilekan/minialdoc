import { fetchProjectWithEndpoint } from '@/endpoints/api-projects'

export async function redirectToReference(domain: string) {

  try {
    const response = await fetchProjectWithEndpoint(domain)
    const slug = response.data?.slug
    
    if (slug) {
      window.location.replace(`/reference/${slug}`)
    }
  } catch (error) {
    console.error('Failed to redirect to reference:', error)
  }
}