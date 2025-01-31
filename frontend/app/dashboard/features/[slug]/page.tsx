import React from 'react'
import Apps from '../features'

type Props = {
  params: {
    slug: string
  }
}

export default function Page({ params: { slug } }: Props) {
  return (
    <div>
      <Apps slug={slug} />
    </div>
  )
}
