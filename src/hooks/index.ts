import { DbEntryWithDefinitions } from "@/lib/edgeDb";
import * as kv from "@/lib/keyValueStore";
import { queryClient } from "@/lib/reactQuery";
import { trpcClient } from "@/lib/trpcClient";
import { findMatchingEntries, normalizeDict, parseQueryParam } from "@/utils";
import { Entry } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import type { DenormalizedDictSchema, NormalizedDict } from "types/materials";

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

export type CachedResult = (Entry & {
  relevancy: number;
  definitions: string[];
})[];

export function useDefinition(char: string) {
  const query = useQuery({
    queryKey: ["definition", char],
    initialData: () => {
      const dictionary = queryClient.getQueryData<NormalizedDict>([
        "dictionary",
        "all",
      ]);
      if (!dictionary) {
        return [];
      }
      const matchingEntries = findMatchingEntries(dictionary, char);
      return matchingEntries;
    },
    queryFn: async () => {
      const dictionary = queryClient.getQueryData<NormalizedDict>([
        "dictionary",
        "all",
      ]);
      if (!dictionary) {
        console.log("cache miss");
        const result: {
          data: DbEntryWithDefinitions[];
        } = await fetch("/api/dictionary/definition?query=" + char).then(
          (res) => res.json()
        );
        // const result = await trpcClient.definition.findOne.query(char);
        return result.data;
      }
      const matchingEntries = findMatchingEntries(dictionary, char);
      console.log("cache hit", matchingEntries);

      return matchingEntries;
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

export function useCacheDictionary(dictType: "all" = "all") {
  const query = useQuery({
    queryKey: ["dictionary", dictType],
    queryFn: async (ctx) => {
      const existingDict = await kv.get<DbEntryWithDefinitions[]>(ctx.queryKey);
      if (existingDict) {
        return existingDict;
      }
      const result: { data: DenormalizedDictSchema } = await fetch(
        "/api/dictionary"
      ).then((res) => res.json());
      // const result = await trpcClient.definition.fetchUniqueCharsDict.query(
      //   dictType
      // );
      const normalizedDict = normalizeDict(result.data);
      console.log("Cached dict", normalizedDict);

      return normalizedDict;
    },
    onSuccess: (data) => {
      kv.set(["dictionary", dictType], data);
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

export function useQueryParam(key: string) {
  const [query, setQuery] = useState<string | null>(null);
  useEffect(() => {
    const listener = () => {
      const location = window.location;
      const query = parseQueryParam(location.search);
      // console.log("popstate query", query);
      setQuery(query);
    };
    window.addEventListener("popstate", listener);

    return () => {
      window.removeEventListener("popstate", listener);
    };
  }, [key]);

  useEffect(() => {
    const location = window.location;
    const query = parseQueryParam(location.search);
    setQuery(query);
    // console.log("initial query", query);
  }, []);

  return query;
}

export function useDependenciesDebugger<T>(inputs: Record<string, T>) {
  const oldInputsRef = useRef(inputs);
  const inputValuesArray = Object.values(inputs);
  const inputKeysArray = Object.keys(inputs);
  useMemo(() => {
    const oldInputs = oldInputsRef.current;
    compareInputs(inputKeysArray, oldInputs, inputs);

    oldInputsRef.current = inputs;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, inputValuesArray);
}

function compareInputs<T>(
  inputKeys: string[],
  oldInputs: Record<string, T>,
  newInputs: Record<string, T>
) {
  inputKeys.forEach((key) => {
    const oldInput = oldInputs[key];
    const newInput = newInputs[key];
    if (oldInput !== newInput) {
      console.log(`Input ${key} changed from ${oldInput} to ${newInput}`);
    }
  });
}
