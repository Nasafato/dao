import clsx from "clsx";
import { useRef } from "react";
import { api } from "../../utils/trpc";
import { Spinner } from "../shared/Spinner";
import { usePopoverApi } from "./PopoverProvider";
import { SingleCharDefinition } from "./SingleCharDefinition";

export function VerseChar({ char, charId }: { char: string; charId: string }) {
  const { renderPopover } = usePopoverApi();
  const ref = useRef<HTMLSpanElement>(null);

  return (
    <span
      id={charId}
      ref={ref}
      onClick={() => {
        if (!ref.current) return;
        renderPopover({
          content: <Definition char={char} />,
          currentCharId: charId,
          anchor: ref.current,
        });
      }}
    >
      {char}
    </span>
  );
}

export function Definition({ char }: { char: string }) {
  const { data, isLoading, isError } = api.definition.findOne.useQuery(char, {
    networkMode: "offlineFirst",
  });

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
