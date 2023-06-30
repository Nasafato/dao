"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../lib/reactQuery";
import { PopoverProvider } from "../components/primary/PopoverProvider";
import * as Tooltip from "@radix-ui/react-tooltip";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <Tooltip.Provider>
        <PopoverProvider>{children}</PopoverProvider>
      </Tooltip.Provider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
