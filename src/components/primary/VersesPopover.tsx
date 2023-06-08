import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { usePopoverApi, usePopoverData } from "./PopoverProvider";

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
      if (popover.isOpen && ref.current && !closest) {
        closePopover();
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

  console.log("content", content);

  console.log("popover.popoverDimensions", popover.popoverDimensions);
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
      {content}
    </div>,
    ref.current
  );
}
