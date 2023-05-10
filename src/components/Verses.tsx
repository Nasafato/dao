import { useQuery } from "@tanstack/react-query";
import * as z from "zod";
import { DaoVerse, DictionaryEntrySchema, DictionarySchema } from "../types";
import { CommandPalette } from "./CommandPalette";
import { MediaWindow } from "./MediaWindow";
import { Popover, PopoverContextProvider } from "./VersesPopover";
import { Verse } from "./Verse";

export interface VersesProps {
  verses: DaoVerse[];
}

export function Verses({ verses }: VersesProps) {
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

  return (
    <PopoverContextProvider>
      {/* <DebugAtom atom={mediaAtom} /> */}
      {/* <DebugContext context={DefinitionPopoverContext} /> */}
      <div className="space-y-6">
        {verses.map((verse) => {
          return <Verse key={verse.id} verse={verse} />;
        })}
        <Popover />
      </div>
      <MediaWindow />
      <CommandPalette />
    </PopoverContextProvider>
  );
}
