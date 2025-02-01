import { axiosInstance } from "@/config/api"

interface WaitlistResponse {
  status: boolean
  message: string
  data: null
}

export const joinWaitlist = async (email: string): Promise<WaitlistResponse> => {
  const response = await axiosInstance.post('/waitlist/join', { email })
  return response.data
} 