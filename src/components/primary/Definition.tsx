import clsx from "clsx";
import { api } from "../../utils/trpc";
import { Spinner } from "../shared/Spinner";
import { SingleCharDefinition } from "./SingleCharDefinition";
import { twJoin, twMerge } from "tailwind-merge";
import {
  BackgroundStyle,
  BorderStyle,
  SoftBorderStyle,
  TextStyle,
} from "../../styles";
import {
  useCharNavigation,
  useRenderNextOrPrevChar,
} from "../../lib/charNavigation";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/20/solid";

export function Definition({
  char,
  className,
}: {
  char: string;
  className?: string;
}) {
  const { data, isLoading, isError } = api.definition.findOne.useQuery(char, {
    networkMode: "offlineFirst",
  });

  return (
    <div className={className}>
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
    return (
      <div className={twJoin("flex gap-x-3", className)}>
        <button className={CharNavButtonStyle} onClick={renderPrevChar}>
          <ArrowLeftIcon className={CharNavArrowStyle} />
        </button>
        <button className={CharNavButtonStyle} onClick={renderNextChar}>
          <ArrowRightIcon className={CharNavArrowStyle} />
        </button>
      </div>
    );
  });

const CharNavButtonStyle = "text-sm";
const CharNavArrowStyle = "h-5 w-5 hover:text-gray-400";
