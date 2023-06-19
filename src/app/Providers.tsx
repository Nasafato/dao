"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../lib/reactQuery";
import { PopoverProvider } from "../components/primary/PopoverProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <PopoverProvider>{children}</PopoverProvider>
    </QueryClientProvider>
  );
}
