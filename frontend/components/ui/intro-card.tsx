import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

export function IntroCard() {
  return (
    <Card className="border-0 bg-muted/50">
      <CardContent className="p-8 flex gap-8 items-start">
        <div className="flex-1 space-y-6">
          <h2 className="text-2xl font-semibold">
            👋 I&apos;m Oye and I built ApiCraft because I needed a simple system to document APIs.
          </h2>
          
          <p className="text-lg leading-relaxed">
            I multi-task a lot and there would always be things that slip my mind or I would forget to take care of. 
            ApiCraft solved this for me by giving me a space to offload and organize API documentation.
          </p>

          <p className="text-lg">
            My hope is that this app improves your life as much as it has improved mine.
          </p>

          <p className="text-lg font-medium">- Oye</p>
        </div>
        <div className="hidden md:block">
          <Image
            src="/images/oye.jpeg"
            alt="Chris Raroque"
            width={160}
            height={160}
            className="rounded-full"
          />
        </div>
      </CardContent>
    </Card>
  )
}

