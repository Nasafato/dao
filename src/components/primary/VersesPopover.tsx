"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { twJoin } from "tailwind-merge";
import { CharMetaSchema, useCharNavigation } from "../../lib/charNavigation";
import { BorderStyle, IconButtonColor } from "../../styles";
import { Arrow, usePopoverApi, usePopoverData } from "./PopoverProvider";
import { XMarkIcon } from "@heroicons/react/20/solid";

export function Popover() {
  const popover = usePopoverData();
  const { closePopover } = usePopoverApi();
  const ref = useRef<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const { renderPrevChar, renderNextChar, renderCharId } = useCharNavigation();

  useEffect(() => {
    ref.current = document.getElementById("popover-portal");
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!ref.current) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const clickedOnPopover = target.closest("#popover-portal-root");
      const clickedOnFooter = target.closest("#footer");
      const clickedOnCharacter = target.closest(".character");

      if (clickedOnPopover || clickedOnFooter) return;
      if (clickedOnCharacter) {
        renderCharId(clickedOnCharacter.id);
        return;
      }
      if (popover.isOpen && ref.current && popover.anchor) {
        closePopover(popover.anchor);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closePopover, popover, renderCharId]);

  useEffect(() => {
    if (popover.isOpen && popover.popoverRef.current) {
      popover.popoverRef.current.focus();
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          if (popover.anchor) {
            closePopover(popover.anchor);
          }
        }

        if (event.key === "Tab") {
          event.preventDefault();
          if (popover.anchor) {
            closePopover(popover.anchor);
          }
        }

        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
          const charMeta = CharMetaSchema.safeParse(popover.meta);
          if (!charMeta.success) return;
          const { charId } = charMeta.data;
          event.preventDefault();
          if (event.key === "ArrowRight") {
            renderNextChar(charId);
          } else {
            renderPrevChar(charId);
          }
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      popover.popoverRef.current?.blur();
    }
  }, [
    renderNextChar,
    renderPrevChar,
    popover.isOpen,
    popover.popoverRef,
    closePopover,
    popover.anchor,
    popover.meta,
  ]);

  let content = popover.content;
  if (!popover.isOpen) {
    content = null;
  }

  if (!mounted || !ref.current) {
    return null;
  }

  if (!popover.coordinates) {
    content = null;
  }

  return createPortal(
    <div
      ref={popover.popoverRef}
      style={{
        position: "absolute",
        top: popover.coordinates.top,
        left: popover.coordinates.left,
        width: popover.popoverDimensions.width,
        height: popover.popoverDimensions.height,
        display: popover.isOpen ? "block" : "none",
      }}
      className={twJoin("z-10", "focus-visible:outline-none")}
      tabIndex={-1}
      id="popover-portal-root"
    >
      <div className={twJoin("relative h-full", "focus-visible:outline-none")}>
        <Arrow
          arrow={popover.arrow}
          popoverDimensions={popover.popoverDimensions}
          className="focus-visible:outline-none"
        />
        {content}
        <div className="absolute top-0 right-0 p-1">
          <button
            className={twJoin(IconButtonColor, "rounded-sm")}
            onClick={() => {
              if (popover.anchor) {
                closePopover(popover.anchor);
              }
            }}
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>,
    ref.current
  );
}

function Arrow({
  arrow,
  popoverDimensions,
  className,
}: {
  arrow: Arrow;
  popoverDimensions: { width: number; height: number };
  className?: string;
}) {
  const rotate =
    arrow.orientation === "facingUp" ? "rotate-45" : "-rotate-[135deg]";
  return (
    <div
      className={twJoin(
        "w-2 h-2 bg-white border-l border-t absolute",
        rotate,
        BorderStyle,
        className
      )}
      style={{
        top:
          arrow.orientation === "facingUp"
            ? "-4px"
            : `${popoverDimensions.height - 4}px`,
        left: arrow.left - 4,
      }}
    ></div>
  );
}
