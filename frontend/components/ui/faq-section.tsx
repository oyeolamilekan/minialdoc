import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "I already use Readme, Minitify, Postman, etc... how is this different?",
    answer: "Unlike general-purpose tools, our platform is specifically designed for API documentation. We focus on providing specialized features like endpoint testing, request/response examples, and API-specific workflows that make documenting and testing APIs more efficient."
  },
  {
    question: "Who would be a good fit for ApiCraft?",
    answer: "ApiCraft is perfect for developers, API designers, and teams who want a streamlined way to document and test their APIs. Whether you're building a public API, managing internal services, or need to document APIs for client projects, our tool provides the specific features you need without the complexity of general-purpose tools."
  },
  {
    question: "As a one person operation, how can I trust that you will be around in a year or two?",
    answer: "We're committed to long-term sustainability. We maintain a lean operation with minimal overhead, and our business model is designed for steady, sustainable growth rather than rapid scaling. We also provide easy export options for your documentation, ensuring you always have control over your content."
  }
]

export function FaqSection() {
  return (
    <section className="space-y-8 mt-9">
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
          Frequently asked questions
        </h2>
      </div>
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-xl font-semibold text-left">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}

