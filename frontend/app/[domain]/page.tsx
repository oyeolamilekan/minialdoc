"use client"

import { redirectToReference } from '@/lib/redirectToReference'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

export default function Page() {
  const { domain } = useParams()
  const router = useRouter()
  
  useEffect(() => {
    redirectToReference(domain as string).then((slug) => {
      router.push(`/reference/${slug}`)
    })
  }, [domain])

  return (
    <div>Redirecting to..</div>
  )
}