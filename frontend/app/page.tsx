"use client"

import Image from "next/image"
import { FeatureItem } from "@/components/ui/feature-item"
import { Navbar } from "@/components/ui/navbar"
import { FaqSection } from "@/components/ui/faq-section"
import { IntroCard } from "@/components/ui/intro-card"
import { WaitlistForm } from "@/components/ui/waitlist-form"

const features = [
  {
    imageSrc: "/images/add-project.gif",
    imageAlt: "Create project demonstration",
    title: "Create Projects",
    description: "Organize your API endpoints effortlessly into separate, unique projects. Keep everything structured and streamlined, making it simple to manage and scale as your needs grow."
  },
  {
    imageSrc: "/images/adding-api-section.gif",
    imageAlt: "Organize endpoints demonstration",
    title: "Organize Your Endpoints",
    description: "Organize your API endpoints with ease by creating independent sections. Build a clear structure that keeps everything connected and simple to manage."
  },
  {
    imageSrc: "/images/rich-editor.gif",
    imageAlt: "Rich editor demonstration",
    title: "Rich Text Editor",
    description: "Create detailed API documentation with our powerful rich text editor. Add formatting, code snippets, and more to make your documentation clear and comprehensive."
  },
  {
    imageSrc: "/images/editor-tester.gif",
    imageAlt: "API tester demonstration",
    title: "Built-in API Tester",
    description: "Test your API endpoints directly within the documentation. Our built-in API tester allows you to verify functionality and provide working examples for your users."
  }
]

export default function Home() {
  return (
    <div className="min-h-screen font-sans">
      <Navbar />
      <div className="p-8 my-10">
        <main className="max-w-6xl mx-auto space-y-16">
          <section className="text-center space-y-6">
            <h1 className="text-3xl md:text-5xl font-bold">
              The minimal API documentation tool for API Craftsmen
            </h1>
            <p className="text-xl text-muted-foreground">
              Manage API documentation with a minimal and simple tool
            </p>
            <WaitlistForm />
          </section>

          <Image
            src="/images/landing-image.png"
            alt="API documentation tool interface"
            width={1000}
            height={500}
            className="w-full h-auto border border-dashed rounded-lg shadow-2xl"
          />

          <section id="features" className="space-y-8">
            <div className="my-20">
              <h2 className="text-3xl md:text-5xl font-bold text-center mt-5">
                An interface crafted for simplicity
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-center my-4">
                Powerful tools and insights to help you build, manage, and optimize your APIs
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
              {features.map((feature, index) => (
                <FeatureItem
                  key={index}
                  imageSrc={feature.imageSrc}
                  imageAlt={feature.imageAlt}
                  title={feature.title}
                  description={feature.description}
                  onJoinWaitlist={() => {}}
                />
              ))}
            </div>
          </section>
          <FaqSection />
          <IntroCard />
        </main>
      </div>
      {/* <Footer /> */}
    </div>
  )
}

