import { QueryClient, UseQueryOptions, useQuery } from "@tanstack/react-query";
import { INDEXED_DB_NAME, INDEXED_DB_VERSION, USER_ID } from "./localDb/db";
import {
  VerseMemoryStatus,
  VerseMemoryStatusType,
} from "./localDb/verseMemoryStatus";

export const queryClient = new QueryClient();

type VerseMemoryStatusQueryKey = readonly [
  "indexedDb",
  string,
  number,
  string,
  number
];

export function useVerseMemoryStatusesQuery() {
  const query = useQuery(
    [
      "indexedDb",
      INDEXED_DB_NAME,
      INDEXED_DB_VERSION,
      VerseMemoryStatus.tableName,
    ],
    async () => {
      const res = await VerseMemoryStatus.getAll({ userId: USER_ID });
      return res;
    },
    {
      networkMode: "always",
    }
  );

  return query;
}

interface UseVerseMemoryStatusQueryProps {
  verseId: number;
  opts?: Omit<
    UseQueryOptions<
      VerseMemoryStatusType,
      Error,
      VerseMemoryStatusType,
      VerseMemoryStatusQueryKey
    >,
    "queryKey" | "queryFn"
  >;
}

export function useVerseMemoryStatusQuery({
  verseId,
  opts = {},
}: UseVerseMemoryStatusQueryProps) {
  const queryKey: VerseMemoryStatusQueryKey = [
    "indexedDb",
    INDEXED_DB_NAME,
    INDEXED_DB_VERSION,
    VerseMemoryStatus.tableName,
    verseId,
  ];
  const verseMemoryStatusQuery = useQuery(
    queryKey,
    async () => {
      const res = await VerseMemoryStatus.get({
        userId_verseId: [USER_ID, verseId],
      });
      return res;
    },
    { ...opts, networkMode: "offlineFirst" }
  );

  return verseMemoryStatusQuery;
}
