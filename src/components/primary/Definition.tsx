import { twJoin } from "tailwind-merge";
import { useDefinition } from "@/hooks";
import { BackgroundStyle, BorderStyle, TextStyle, border } from "@/styles";
import { Spinner } from "@/components/shared/Spinner";
import { SingleCharDefinition } from "./SingleCharDefinition";

export function Definition({
  char,
  className,
}: {
  char: string;
  className?: string;
}) {
  const { data, isLoading, isError } = useDefinition(char);

  return (
    <div className={className}>
      {isLoading ? (
        <Spinner className="h-4 w-4" />
      ) : isError ? (
        "Error"
      ) : data ? (
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
        "border px-3 py-2 rounded-md shadow-md overflow-scroll hyphens-auto h-full",
        TextStyle,
        border(),
        BackgroundStyle,
        className
      )}
    >
      {children}
    </div>
  );
});
