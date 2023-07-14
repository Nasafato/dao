import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/20/solid";
import { twJoin } from "tailwind-merge";
import { useRenderNextOrPrevChar, useCharInfo } from "@/lib/charNavigation";
import { Tooltip } from "@/components/Tooltip";
import { KeyboardButton } from "@/components/KeyboardButton";

const CharNavButtonStyle = "p-2";
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
      <Tooltip
        side="top"
        anchor={
          <button
            className={twJoin(CharNavButtonStyle, !prevChar && "opacity-30")}
            onClick={renderPrevChar}
          >
            <ArrowLeftIcon className={CharNavArrowStyle} />
          </button>
        }
        content={
          <div className="flex items-center">
            <KeyboardButton>{"<-"}</KeyboardButton>
            <span className="ml-1"> : Prev char</span>
          </div>
        }
      />
      <span className="font-medium w-4">{currChar?.char}</span>
      <Tooltip
        side="top"
        content={
          <div className="flex items-center">
            <KeyboardButton>{"->"}</KeyboardButton>
            <span className="ml-1"> : Next char</span>
          </div>
        }
        anchor={
          <button
            className={twJoin(CharNavButtonStyle, !nextChar && "opacity-30")}
            onClick={renderNextChar}
          >
            <ArrowRightIcon className={CharNavArrowStyle} />
          </button>
        }
      />
      <span className={SurroundingCharStyle}>{nextChar?.char}</span>
    </div>
  );
}
