import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/20/solid";
import { twJoin } from "tailwind-merge";
import { useDefinition } from "../../hooks";
import { useCharInfo, useRenderNextOrPrevChar } from "../../lib/charNavigation";
import { BackgroundStyle, BorderStyle, TextStyle } from "../../styles";
import { Spinner } from "../shared/Spinner";
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
        <SingleCharDefinition definition={data} className="text-sm" />
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
        BorderStyle,
        BackgroundStyle,
        className
      )}
    >
      {children}
    </div>
  );
});

export const DefinitionNavigation = (Definition.Navigation =
  function DefinitionNavigation({ className }: { className?: string }) {
    const { renderNextChar, renderPrevChar } = useRenderNextOrPrevChar();
    const { currChar, nextChar, prevChar } = useCharInfo();
    return (
      <div className={twJoin("flex gap-x-3 items-center", className)}>
        <span className={SurroundingCharStyle}>{prevChar?.char}</span>
        <button
          className={twJoin(CharNavButtonStyle, !prevChar && "opacity-30")}
          onClick={renderPrevChar}
        >
          <ArrowLeftIcon className={CharNavArrowStyle} />
        </button>
        <span className="font-medium w-4">{currChar?.char}</span>
        <button
          className={twJoin(CharNavButtonStyle, !nextChar && "opacity-30")}
          onClick={renderNextChar}
        >
          <ArrowRightIcon className={CharNavArrowStyle} />
        </button>
        <span className={SurroundingCharStyle}>{nextChar?.char}</span>
      </div>
    );
  });

const CharNavButtonStyle = "p-1";
const CharNavArrowStyle = "h-5 w-5 hover:text-gray-400";

const SurroundingCharStyle = "text-sm text-gray-500 w-4";
