"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Stars } from "lucide-react"
import { toast } from "sonner"
import { useMutation } from "@tanstack/react-query"
import { joinWaitlist } from "@/endpoints/waitlist"
import { ApiError } from "@/types/api"

export function WaitlistForm() {
  const [email, setEmail] = useState("")

  const mutation = useMutation({
    mutationFn: (email: string) => joinWaitlist(email),
    onSuccess: (data) => {
      toast.success(data.message || "Successfully joined the waitlist!")
      setEmail("")
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.message || "Failed to join waitlist")
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate(email)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
      <Input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="flex-grow"
      />
      <Button 
        type="submit" 
        disabled={mutation.isPending}
      >
        <Stars className="mr-2 h-4 w-4" />
        {mutation.isPending ? "Joining..." : "Join Waitlist"}
      </Button>
    </form>
  )
} 