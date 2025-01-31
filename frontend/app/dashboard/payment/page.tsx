/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Card, CardContent } from "@/components/ui/card";
import { CustomSupense } from "@/components/ui/custom-suspense";
import { PlanCard } from "@/components/ui/plan-card";
import { fetchCurrentPlan, fetchPlans, paySubscription } from "@/endpoints/payment";
import { Plan } from "@/interfaces";
import { pushToNewTab } from "@/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { BoxIcon } from "lucide-react";
import { toast } from "sonner";

export default function Page() {
  const { isLoading, isError, data } = useQuery({
    queryKey: ["projects"],
    queryFn: () => fetchPlans(),
    retry: false,
  });

  const { mutate: createCheckoutUrl } = useMutation({
    mutationFn: paySubscription,
    onSuccess({ data }) {
      const { checkout_url } = data
      pushToNewTab(checkout_url)
    },
    onError(err: any) {
      const { message } = err.response?.data || '';
      toast.error(message);
    },
  })

  const { data: endpoint } = useQuery({
    queryKey: ["payment_id"],
    queryFn: fetchCurrentPlan,
  }); 

  const createCheckoutUrlAction = async (id: string) => {
    createCheckoutUrl(id)
  }

  return (
    <CustomSupense
      isLoading={isLoading}
      isError={isError}
      isEmpty={data?.data?.length <= 0}
      fallBackEmpty={
        <div className="flex items-center justify-center md:h-4/6 h-3/6 w-full">
          <div className="flex flex-col items-center justify-center">
            <div className="p-5 rounded-full dark:bg-neutral-600 bg-secondary">
              <BoxIcon />
            </div>
            <p className="my-4 font-medium dark:text-white text-xl">No plans available.</p>
          </div>
        </div>
      }
    >
      <div className="mb-12">
        {endpoint?.data?.subscription && <Card className="bg-muted/50">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-lg font-semibold mb-1">Current Plan: {endpoint?.data?.subscription?.plan?.name}</h2>
                <p className="text-muted-foreground">
                  ${endpoint?.data?.subscription?.plan?.price}/month • Renews on {endpoint?.data?.subscription?.end_date}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>}
      </div>
      <div className="mt-0 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-8 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:grid-cols-3 xl:gap-10">
        {(data?.data ?? []).map((plan: Plan) => (
          <PlanCard key={plan.public_id} plan={plan} createCheckoutUrl={createCheckoutUrlAction} />
        ))}
      </div>
    </CustomSupense>
  )
}
