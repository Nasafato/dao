import { useQueryClient, useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { useRef, useEffect } from "react";
import { DictionarySchemaType, DictionaryEntrySchema } from "../../types";
import { usePopover } from "./VersesPopover";
import { api } from "../../utils/trpc";
import { SingleCharDefinition } from "./SingleCharDefinition";
import { Spinner } from "../shared/Spinner";

export function VerseChar({ char, charId }: { char: string; charId: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const { renderPopover, popover } = usePopover();
  useEffect(() => {
    if (charId !== popover.currentCharId || !ref.current || !popover.isOpen) {
      return;
    }

    const handleResize = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      renderPopover({
        content: <Definition char={char} />,
        currentCharId: charId,
        element: ref.current,
        rect,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [charId, popover.currentCharId, char, renderPopover, popover.isOpen]);

  return (
    <span
      id={charId}
      ref={ref}
      onClick={() => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        renderPopover({
          content: <Definition char={char} />,
          currentCharId: charId,
          element: ref.current,
          rect,
        });
      }}
      className={clsx("relative", {
        "text-green-600": popover.currentCharId === charId && popover.isOpen,
      })}
    >
      {char}
    </span>
  );
}

function Definition({ char }: { char: string }) {
  // const queryClient = useQueryClient();
  const { data, isLoading, isError } = api.definition.findOne.useQuery(char);
  // const { data, isLoading, isError } = useQuery({
  //   queryKey: ["definition", char],
  //   queryFn: async () => {
  //     const dictionary = queryClient.getQueryData<DictionarySchemaType>([
  //       "dictionary",
  //     ]);
  //     if (dictionary) {
  //       const entry = dictionary[char];
  //       return entry;
  //     }
  //     if (!char) return;
  //     const r = await fetch(`/api/definition?char=${char}`);
  //     const result = await r.json();
  //     return DictionaryEntrySchema.parse(result);
  //   },
  //   networkMode: "always",
  //   refetchOnMount: false,
  //   refetchOnWindowFocus: false,
  //   refetchOnReconnect: false,
  //   // staleTime: Infinity,
  //   enabled: !!char,
  // });

  return (
    <div
      className={clsx(
        "bg-white dark:bg-gray-950 border-gray-500 dark:border-gray-200/20 dark:text-gray-100 border px-3 py-2 rounded-md shadow-md text-gray-800 overflow-scroll hyphens-auto h-full"
      )}
    >
      {isLoading ? (
        <Spinner className="h-4 w-4" />
      ) : isError ? (
        "Error"
      ) : data ? (
        <SingleCharDefinition definition={data} className="text-xs" />
      ) : (
        "No definition found"
      )}
    </div>
  );
}
