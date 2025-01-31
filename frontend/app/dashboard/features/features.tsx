"use client"

import React from 'react'
import { ArrowRight, BookOpen, BarChart2, Zap } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation'

interface AppsProps {
  slug: string;
}

interface Feature {
  id: number
  title: string
  description: string
  icon: React.ReactNode
  path: string
  isLive?: boolean
}

const features: Feature[] = [
  {
    id: 1,
    title: "API Reference",
    description: "Comprehensive documentation for integrating with our powerful API.",
    icon: <BookOpen className="w-8 h-8 text-blue-500" />,
    isLive: true,
    path: "/api-reference"
  },
  {
    id: 2,
    title: "Analytics",
    description: "Gain insights into your application's performance and user behavior.",
    icon: <BarChart2 className="w-8 h-8 text-green-500" />,
    path: "/analytics"
  },
  {
    id: 3,
    title: "Integration Guide",
    description: "Step-by-step guide for quick and easy integration process.",
    icon: <Zap className="w-8 h-8 text-yellow-500" />,
    path: "/integration-guide"
  }
]

export default function Features({ slug }: AppsProps) {
  const router = useRouter()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {features.map((feature) => (
        <Card key={feature.id} className="overflow-hidden border border-gray-200 transition-colors duration-300 hover:border-gray-300 rounded">
          <CardHeader className="p-6">
            <div className="flex items-center space-x-4">
              {feature.icon}
              <CardTitle className="text-xl font-semibold text-gray-800">{feature.title}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-4">
            <p className="text-gray-600">{feature.description}</p>
          </CardContent>
          <CardFooter className="px-6 pb-6 pt-0">
            <Button
              variant="ghost"
              className="text-gray-600 hover:text-gray-800 hover:bg-gray-50 px-4 py-2 -ml-4 rounded-md transition-colors duration-300"
              onClick={() => feature.isLive && router.push(`${feature.path}/${slug}`)}
            >
              View <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
