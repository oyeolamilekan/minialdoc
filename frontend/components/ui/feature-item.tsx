import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight } from 'lucide-react'

interface FeatureItemProps {
  imageSrc: string
  imageAlt: string
  title: string
  description: string
  onJoinWaitlist: () => void
}

export function FeatureItem({ 
  imageSrc, 
  imageAlt, 
  title, 
  description, 
  onJoinWaitlist 
}: FeatureItemProps) {
  return (
    <Card className="overflow-hidden border-0 bg-gradient-to-b from-muted/50 to-background">
      <CardContent className="p-6">
        <div className="flex flex-col space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">ADVANCED</p>
            <h3 className="text-2xl font-semibold">{title}</h3>
          </div>
          <p className="text-muted-foreground">{description}</p>
          <div className="relative aspect-[2/1] overflow-hidden rounded-lg border bg-background">
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex items-center justify-between pt-4">
            <Button 
              variant="ghost" 
              className="text-primary hover:text-primary hover:bg-primary/5"
              onClick={onJoinWaitlist}
            >
              Learn more
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button onClick={onJoinWaitlist} variant="outline">
              Join Waitlist
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

