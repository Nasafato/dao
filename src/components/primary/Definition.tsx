import { twJoin } from "tailwind-merge";
import { useDefinition } from "@/hooks";
import { TextStyle } from "@/styles";
import { Spinner } from "@/components/shared/Spinner";
import { SingleCharDefinition } from "./SingleCharDefinition";

export function Definition({
  char,
  className,
}: {
  char: string;
  className?: string;
}) {
  const { data, isFetching, isLoading, isError } = useDefinition(char);
  const hasEntries = !!data?.length;

  return (
    <div className={twJoin("min-h-8", className)}>
      {isLoading || (isFetching && !hasEntries) ? (
        <Spinner className="h-4 w-4" />
      ) : isError ? (
        "Error"
      ) : hasEntries ? (
        <SingleCharDefinition entries={data} className="text-sm" />
      ) : (
        "No definition found"
      )}
    </div>
  );
}

export const DefinitionWrapper = (Definition.Wrapper = function Wrapper({
  className,
  children,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={twJoin(
        "h-full overflow-auto px-3 py-2 hyphens-auto",
        TextStyle,
        className
      )}
    >
      {children}
    </div>
  );
});
