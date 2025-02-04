"use client"

import { redirectToReference } from '@/lib/redirectToReference'
import { useParams } from 'next/navigation'
import React, { useEffect } from 'react'

export default function Page() {
  const { domain } = useParams()

  useEffect(() => {
    redirectToReference(domain as string)
  }, [domain])

  return (
    <div>Redirecting to..</div>
  )
}