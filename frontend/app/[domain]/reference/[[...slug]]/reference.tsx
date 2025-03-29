"use client"

import { EndpointTester } from '@/components/endpoint-req/endpoint-tester';
import { ApiReferenceSidebar } from '@/components/ui/api-reference-sidebar';
import { fetchAPIEndpoint, fetchAPISectionAndEndpoints, fetchProject } from '@/endpoints/api-projects';
import { APIEndpoint, Endpoint } from '@/interfaces';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react'
import "@blocknote/mantine/style.css";
import "@blocknote/core/fonts/inter.css";
import { redirectToReference } from '@/lib/redirectToReference';
import { useRouter } from 'next/navigation';
import { Loading } from '@/components/ui/loading';

export default function Reference({ slug, domain }: { slug: string, domain: string }) {
  const [endpointState, setEndpoint] = useState<APIEndpoint | null>(null)
  const router = useRouter()


  const { data: projectData } = useQuery({
    queryKey: ["api_project", domain],
    queryFn: () => fetchProject(domain),
    retry: false,
  });

  const { data } = useQuery({
    queryKey: ["api_sections_and_endpoints", domain],
    queryFn: () => fetchAPISectionAndEndpoints(domain),
    retry: false,
  });

  const { data: endpoint, refetch, isLoading: isEndpointLoading } = useQuery({
    queryKey: ["api_endpoint", slug],
    enabled: Boolean(slug),
    queryFn: () => fetchAPIEndpoint(slug!),
    retry: false,
  });

  useEffect(() => {
    setEndpoint(endpoint?.data)
    if (Boolean(slug)) refetch()
  }, [slug, endpoint?.data, refetch])

  const updateEndpoint = (updatedEndpoint: Endpoint) => {
    setEndpoint((prevEndpoint) => {
      if (!prevEndpoint) return null;
      return {
        ...prevEndpoint,
        body: {
          ...prevEndpoint.body,
          ...updatedEndpoint
        }
      }
    })
  }

  useEffect(() => {
    if (!slug) {
      redirectToReference(domain).then((slug) => {
        router.push(`/reference/${slug}`)
      })
    }
  }, [slug, domain, router])

  return (
    <ApiReferenceSidebar
      title={projectData?.data?.title}
      items={data?.data ?? []}
      endpointSlug={slug}
    >
      <>
        {isEndpointLoading ? <Loading /> : endpointState?.endpoint_type == "endpoint" && (
          <>
            <h2 className='mx-6 text-xl md:text-2xl font-bold'>{endpointState.title}</h2>
            <EndpointTester endpoint={endpointState.body} updateEndpoint={updateEndpoint} baseUrl={projectData?.data?.base_url} />
          </>
        )}
      </>
    </ApiReferenceSidebar>
  )
}
