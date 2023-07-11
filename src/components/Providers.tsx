"use client";
import { PopoverProvider } from "@/components/primary/PopoverProvider";
import { queryClient } from "@/lib/reactQuery";
import * as Tooltip from "@radix-ui/react-tooltip";
import { QueryClientProvider } from "@tanstack/react-query";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <Tooltip.Provider>
        <PopoverProvider>{children}</PopoverProvider>
      </Tooltip.Provider>
    </QueryClientProvider>
  );
}
