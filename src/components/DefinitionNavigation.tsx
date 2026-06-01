import {
  ArrowLeft,
  ArrowLeftFromLine,
  ArrowRight,
  ArrowRightFromLine,
} from "lucide-react";
import { twJoin } from "tailwind-merge";
import { useRenderNextOrPrevChar, useCharInfo } from "@/lib/charNavigation";
import { Tooltip } from "@/components/Tooltip";
import { KeyboardButton } from "@/components/KeyboardButton";

const CharNavButtonStyle =
  "flex h-12 w-12 items-center justify-center rounded-full touch-manipulation transition hover:bg-white/25 active:bg-white/35 min-[380px]:h-14 min-[380px]:w-14 dark:hover:bg-white/10 dark:active:bg-white/15";
const CharNavArrowStyle = "h-7 w-7 min-[380px]:h-9 min-[380px]:w-9";
const CharNavExpandArrowStyle = "h-6 w-6 min-[380px]:h-7 min-[380px]:w-7";

const SurroundingCharStyle =
  "w-5 text-center text-lg leading-none text-gray-500 min-[380px]:w-6 min-[380px]:text-xl";

export function DefinitionNavigation({ className }: { className?: string }) {
  const { extendNextChar, extendPrevChar, renderNextChar, renderPrevChar } =
    useRenderNextOrPrevChar();
  const { currChar, nextChar, prevChar } = useCharInfo();
  return (
    <div
      className={twJoin(
        "flex h-14 w-full items-center justify-between px-1 min-[380px]:px-1.5",
        className
      )}
    >
      <Tooltip
        side="top"
        anchor={
          <button
            type="button"
            aria-label="Expand selection left"
            className={twJoin(CharNavButtonStyle, !prevChar && "opacity-30")}
            onClick={extendPrevChar}
          >
            <ArrowLeftFromLine
              className={CharNavExpandArrowStyle}
              strokeWidth={2.3}
            />
          </button>
        }
        content={
          <div className="flex items-center">
            <span className="mr-1 text-xs">Shift +</span>
            <KeyboardButton>{"<-"}</KeyboardButton>
            <span className="ml-1"> : Expand left</span>
          </div>
        }
      />
      <span className={SurroundingCharStyle}>{prevChar?.char}</span>
      <Tooltip
        side="top"
        anchor={
          <button
            type="button"
            aria-label="Previous character"
            className={twJoin(CharNavButtonStyle, !prevChar && "opacity-30")}
            onClick={(event) => {
              if (event.shiftKey) {
                extendPrevChar();
              } else {
                renderPrevChar();
              }
            }}
          >
            <ArrowLeft className={CharNavArrowStyle} strokeWidth={2.3} />
          </button>
        }
        content={
          <div className="flex items-center">
            <KeyboardButton>{"<-"}</KeyboardButton>
            <span className="ml-1"> : Prev char</span>
          </div>
        }
      />
      <span className="w-6 text-center text-2xl font-medium leading-none">
        {currChar?.char}
      </span>
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
            type="button"
            aria-label="Next character"
            className={twJoin(CharNavButtonStyle, !nextChar && "opacity-30")}
            onClick={(event) => {
              if (event.shiftKey) {
                extendNextChar();
              } else {
                renderNextChar();
              }
            }}
          >
            <ArrowRight className={CharNavArrowStyle} strokeWidth={2.3} />
          </button>
        }
      />
      <span className={SurroundingCharStyle}>{nextChar?.char}</span>
      <Tooltip
        side="top"
        anchor={
          <button
            type="button"
            aria-label="Expand selection right"
            className={twJoin(CharNavButtonStyle, !nextChar && "opacity-30")}
            onClick={extendNextChar}
          >
            <ArrowRightFromLine
              className={CharNavExpandArrowStyle}
              strokeWidth={2.3}
            />
          </button>
        }
        content={
          <div className="flex items-center">
            <span className="mr-1 text-xs">Shift +</span>
            <KeyboardButton>{"->"}</KeyboardButton>
            <span className="ml-1"> : Expand right</span>
          </div>
        }
      />
    </div>
  );
}
