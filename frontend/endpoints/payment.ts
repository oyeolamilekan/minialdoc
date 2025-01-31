import { axiosInstance } from "@/config/api";

export const paySubscription = async (id: string) => {
  const { data } = await axiosInstance.post(`subscriptions/pay_subscription/${id}`);
  return data;
}

export const fetchCurrentPlan = async () => { 
  const { data } = await axiosInstance.get(`subscriptions/fetch_active_subscription`);
  return data;
}

export const fetchPlans = async () => {
  const { data } = await axiosInstance.get(`subscriptions/plans`);
  return data;
}