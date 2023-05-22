import { QueryClient, UseQueryOptions, useQuery } from "@tanstack/react-query";
import { INDEXED_DB_NAME, INDEXED_DB_VERSION, USER_ID } from "./localDb/db";
import {
  VerseMemoryStatus,
  VerseMemoryStatusType,
} from "./localDb/verseMemoryStatus";

export const queryClient = new QueryClient();

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
    }
  );

  return query;
}

interface UseVerseMemoryStatusQueryProps {
  verseId: number;
  opts?: Omit<
    UseQueryOptions<VerseMemoryStatusType, Error>,
    "queryKey" | "queryFn"
  >;
}

export function useVerseMemoryStatusQuery({
  verseId,
  opts = {},
}: UseVerseMemoryStatusQueryProps) {
  const verseMemoryStatusQuery = useQuery(
    [
      "indexedDb",
      INDEXED_DB_NAME,
      INDEXED_DB_VERSION,
      VerseMemoryStatus.tableName,
      verseId,
    ],
    async () => {
      const res = await VerseMemoryStatus.get({
        userId_verseId: [USER_ID, verseId],
      });
      return res;
    },
    opts
  );

  return verseMemoryStatusQuery;
}
