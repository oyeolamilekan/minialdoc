"use client"

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Page() {
  const completeRoute = `https://${window.location.hostname}/reference`
  const router = useRouter()

  useEffect(() => {
    // Redirect to the reference page when the component mounts
    router.push('/reference')
  }, [])

  return (
    <div>Redirecting you to {completeRoute}</div>
  )
}