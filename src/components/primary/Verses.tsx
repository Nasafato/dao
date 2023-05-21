import { useQuery } from "@tanstack/react-query";
import { VerseMemoryStatusType } from "../../lib/localSchema";
import { useVerseMemoryStatusesQuery } from "../../lib/reactQuery";
import { DaoVerse, DictionarySchema } from "../../types";
import { CommandPalette } from "./CommandPalette";
import { MediaWindow } from "./MediaWindow";
import { Verse } from "./Verse";
import { Popover, PopoverContextProvider } from "./VersesPopover";

interface VerseProps {
  verses: DaoVerse[];
}

export function Verses({ verses }: VerseProps) {
  useQuery({
    queryKey: ["dictionary"],
    queryFn: async () => {
      const result = await fetch("/api/dictionary");
      const json = await result.json();
      const validated = DictionarySchema.parse(json);
      return validated;
    },
    networkMode: "always",
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    cacheTime: Infinity,
  });

  const verseMemoryStatusesQuery = useVerseMemoryStatusesQuery();
  const statusMap: Record<string, VerseMemoryStatusType> = {};
  for (const status of verseMemoryStatusesQuery.data ?? []) {
    statusMap[status.verseId] = status;
  }

  return (
    <PopoverContextProvider>
      {/* <DebugAtom atom={mediaAtom} /> */}
      {/* <DebugContext context={DefinitionPopoverContext} /> */}
      <div className="space-y-6">
        {verses.map((verse) => {
          return (
            <Verse
              key={verse.id}
              verse={verse}
              verseStatus={statusMap[verse.id]}
            />
          );
        })}
        <Popover />
      </div>
      <MediaWindow />
      <CommandPalette />
    </PopoverContextProvider>
  );
}
