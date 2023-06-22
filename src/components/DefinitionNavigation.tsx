import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/20/solid";
import { twJoin } from "tailwind-merge";
import { useRenderNextOrPrevChar, useCharInfo } from "../lib/charNavigation";

const CharNavButtonStyle = "p-1";
const CharNavArrowStyle = "h-5 w-5 hover:text-gray-400";

const SurroundingCharStyle = "text-sm text-gray-500 w-4";

export function DefinitionNavigation({ className }: { className?: string }) {
  const { renderNextChar, renderPrevChar } = useRenderNextOrPrevChar();
  const { currChar, nextChar, prevChar } = useCharInfo();
  return (
    <div
      className={twJoin("flex gap-x-3 items-center justify-center", className)}
    >
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
}
