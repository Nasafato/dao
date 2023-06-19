import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { trpcClient } from "../lib/trpcClient";
import { queryClient } from "../lib/reactQuery";
import { Definition, Entry } from "@prisma/client";
import * as kv from "../lib/keyValueStore";

export function useLogPropChanges(props: any) {
  const prevProps = useRef(props);

  useEffect(() => {
    const changedProps = Object.entries(props).reduce((acc, [key, value]) => {
      if (prevProps.current[key] !== value) {
        acc[key] = { oldValue: prevProps.current[key], newValue: value };
      }
      return acc;
    }, {} as { [key: string]: { oldValue: any; newValue: any } });

    if (Object.keys(changedProps).length > 0) {
      console.log("Changed props:", changedProps);
    }

    prevProps.current = props;
  });
}

type Result = (Entry & {
  definitions: Definition[];
})[];

export type CachedResult = (Entry & {
  definitions: string[];
})[];

export function useDefinition(char: string) {
  const query = useQuery({
    queryKey: ["definition", char],
    queryFn: async () => {
      const verseDictionary =
        queryClient.getQueryData<Record<string, CachedResult>>([
          "dictionary",
          "verse",
        ]) ?? {};
      const descriptionDictionary =
        queryClient.getQueryData<Record<string, CachedResult>>([
          "dictionary",
          "description",
        ]) ?? {};
      if (verseDictionary[char]) {
        return verseDictionary[char];
      }
      if (descriptionDictionary[char]) {
        return descriptionDictionary[char];
      }

      const result = await trpcClient.definition.findOne.query(char);
      console.log("cache miss");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return result;
    },
    networkMode: "offlineFirst",
    enabled: !!char,
  });

  return query;
}

export function useMoreQuery(
  verseId: number,
  opts: { enabled?: boolean } = { enabled: true }
) {
  const query = useQuery({
    queryKey: ["description", verseId],
    queryFn: async () => {
      const result = await trpcClient.verse.findDescription.query(verseId);
      return result;
    },
    networkMode: "offlineFirst",
    enabled: opts.enabled ? !!verseId : false,
  });

  return query;
}

export function useCacheDictionary(dictType: "verse" | "description") {
  const query = useQuery({
    queryKey: ["dictionary", dictType],
    queryFn: async (ctx) => {
      const existingDict = await kv.get<Record<string, CachedResult>>(
        ctx.queryKey
      );
      if (existingDict) {
        return existingDict;
      }
      const result = await trpcClient.definition.fetchUniqueCharsDict.query(
        dictType
      );
      await kv.set(ctx.queryKey, result);
      return result;
    },
    networkMode: "offlineFirst",
    enabled: true,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    cacheTime: Infinity,
  });

  return query;
}

// const VerseToUserArraySchema = z.array(VerseToUserSchema);

// export function useVerseStatuses() {
//   const { status, data } = useSession();
//   const queryResult = useQuery({
//     queryKey: ["verseStatuses"],
//     queryFn: async () => {
//       const res = await fetch("/api/verse");
//       const json = await res.json();
//       return VerseToUserArraySchema.parse(json.data);
//     },
//     enabled: status === "authenticated" && !!data,
//   });

//   if (!queryResult.data) {
//     return {};
//   }

//   const result: Record<string, string> = {};
//   for (const verseToUser of queryResult.data) {
//     result[verseToUser.verseId] = verseToUser.status;
//   }

//   return {
//     verseStatuses: result,
//     isFetched: queryResult.isFetched,
//   };
// }
