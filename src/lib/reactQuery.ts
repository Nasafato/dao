import { QueryClient, UseQueryOptions, useQuery } from "@tanstack/react-query";
import verse from "../pages/api/verse";
import {
  INDEXED_DB_NAME,
  INDEXED_DB_VERSION,
  getVerseMemoryStatus,
  USER_ID,
} from "./localDb";
import { VerseMemoryStatus, VerseMemoryStatusType } from "./localSchema";

export const queryClient = new QueryClient();

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
      const res = await getVerseMemoryStatus(USER_ID, verseId);
      return res;
    },
    opts
  );

  return verseMemoryStatusQuery;
}
