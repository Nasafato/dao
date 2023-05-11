import { useQuery } from "@tanstack/react-query";
import { DaoVerse, DictionarySchema } from "../types";
import { CommandPalette } from "./CommandPalette";
import { MediaWindow } from "./MediaWindow";
import { Verse } from "./Verse";
import { Popover, PopoverContextProvider } from "./VersesPopover";
import { useVerseStatuses } from "../hooks";

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

  const verseStatuses = useVerseStatuses();

  return (
    <PopoverContextProvider>
      {/* <DebugAtom atom={mediaAtom} /> */}
      {/* <DebugContext context={DefinitionPopoverContext} /> */}
      <div className="space-y-6">
        {verses.map((verse) => {
          const status = verseStatuses.isFetched
            ? verseStatuses.verseStatuses[verse.id] ?? null
            : "not-fetched";
          return <Verse key={verse.id} verse={verse} verseStatus={status} />;
        })}
        <Popover />
      </div>
      <MediaWindow />
      <CommandPalette />
    </PopoverContextProvider>
  );
}
