import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Arrow, usePopoverApi, usePopoverData } from "./PopoverProvider";
import { twMerge } from "tailwind-merge";

export function Popover() {
  const popover = usePopoverData();
  const { closePopover } = usePopoverApi();
  const ref = useRef<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    ref.current = document.getElementById("popover-portal");
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!ref.current) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const closest = target.closest("#popover-portal-root");
      if (popover.isOpen && ref.current && !closest && popover.anchor) {
        closePopover(popover.anchor);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closePopover, popover]);

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
      }}
      className="z-10"
      id="popover-portal-root"
    >
      <div className="relative h-full">
        {popover.isOpen && (
          <Arrow
            arrow={popover.arrow}
            popoverDimensions={popover.popoverDimensions}
          />
        )}
        {content}
      </div>
    </div>,
    ref.current
  );
}

function Arrow({
  arrow,
  popoverDimensions,
}: {
  arrow: Arrow;
  popoverDimensions: { width: number; height: number };
}) {
  const rotate =
    arrow.orientation === "facingUp" ? "rotate-45" : "-rotate-[135deg]";
  return (
    <div
      className={twMerge(
        "w-2 h-2 bg-white border-l border-t border-gray-950 absolute rotate",
        rotate
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
