import { Check } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Plan } from '@/interfaces';

interface PlanCardProps {
  plan: Plan;
  createCheckoutUrl: (id: string) => void
}

export function PlanCard({ plan, createCheckoutUrl }: PlanCardProps) {
  return (
    <Card 
      className={`flex flex-col justify-between rounded ${plan.recommended ? 'border-primary shadow-lg relative' : ''}`}
    >
      {plan.recommended && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <span className="inline-flex rounded-full bg-primary px-4 py-1 text-sm font-semibold text-primary-foreground">
            Recommended
          </span>
        </div>
      )}
      <CardHeader>
        <CardTitle className={`text-2xl font-semibold ${plan.recommended ? 'text-primary' : ''}`}>
          {plan.name}
        </CardTitle>
        <CardDescription className="text-sm">{plan.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center">
          <span className={`text-4xl font-extrabold ${plan.recommended ? 'text-primary' : ''}`}>
            ${plan.price}
          </span>
          <span className="text-base font-medium text-muted-foreground">/{plan.interval}</span>
        </div>
        <ul className="mt-8 space-y-4">
          {Object.entries(plan.features ?? []).map(([key, value]) => (
            <li key={key} className="flex items-start">
              <div className="flex-shrink-0">
                <Check
                  className={`h-6 w-6 ${
                    plan.recommended ? "text-primary" : "text-green-500"
                  }`}
                />
              </div>
              <p className="ml-3 text-base text-foreground">
                {key === 'users' ? `${value} Users` :
                 key === 'storage' ? `${value} Storage` :
                 key === 'support' ? value : `${key}: ${value}`}
              </p>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          variant={plan.recommended ? "default" : "outline"}
          onClick={() => createCheckoutUrl(plan.id.toString())}
        >
          Select {plan.name}
        </Button>
      </CardFooter>
    </Card>
  )
}

