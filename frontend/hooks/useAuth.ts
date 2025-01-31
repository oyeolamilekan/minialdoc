import { APP_NAME } from "@/config/app"
import { useSessionStorage } from "./useSessionStorage"

export const useAuth = () => {
    const { value: user } = useSessionStorage(APP_NAME, '')
    if (user) {
        return true
    } else {
        return false
    }
}