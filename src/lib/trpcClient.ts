import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { AppRouter } from "../server/routers/_app";
import SuperJSON from "superjson";

export const trpcClient = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:3001/api/trpc",
    }),
  ],
  transformer: SuperJSON,
});
