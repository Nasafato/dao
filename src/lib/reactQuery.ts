import { QueryClient, UseQueryOptions, useQuery } from "@tanstack/react-query";
import verse from "../pages/api/verse";
import {
  INDEXED_DB_NAME,
  INDEXED_DB_VERSION,
  getVerseMemoryStatus,
  USER_ID,
  getVerseMemoryStatuses,
} from "./localDb";
import { VerseMemoryStatusTable, VerseMemoryStatusType } from "./localSchema";

export const queryClient = new QueryClient();

export function useVerseMemoryStatusesQuery() {
  const query = useQuery(
    [
      "indexedDb",
      INDEXED_DB_NAME,
      INDEXED_DB_VERSION,
      VerseMemoryStatusTable.tableName,
    ],
    async () => {
      const res = await getVerseMemoryStatuses(USER_ID);
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
      VerseMemoryStatusTable.tableName,
      verseId,
    ],
    async () => {
      const res = await getVerseMemoryStatus(USER_ID, verseId);
      return res;
    },
    opts
  );

  return verseMemoryStatusQuery;
}
