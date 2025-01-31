"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { Toaster } from "sonner";

const queryClient = new QueryClient();

const ToasterProvider = () => {
  return <Toaster position="top-right" />;
};

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        {children}
        <ToasterProvider />
      </QueryClientProvider>
    </>
  );
}
