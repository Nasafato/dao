import { createContext, useState, useRef, useEffect, useContext } from "react";
import { createPortal } from "react-dom";

export type Popover = {
  content: React.ReactNode;
  currentCharId: string | null;
  element: HTMLElement | null;
  isOpen: boolean;
  width: number;
  height: number;
  top: number;
  left: number;
};

const RESPONSIVE_DIMENSIONS = {
  mobile: {
    width: 150,
    height: 120,
  },
  desktop: {
    width: 200,
    height: 160,
  },
};

export const DefinitionPopoverContext = createContext<{
  popover: Popover;
  updatePopover: (args: any) => void;
  renderPopover: ({
    content,
    rect,
    currentCharId,
    element,
  }: {
    content: React.ReactNode;
    element: HTMLElement;
    rect: DOMRect;
    currentCharId: string;
  }) => void;
  closePopover: () => void;
  openPopover: () => void;
}>({
  popover: {
    content: null,
    element: null,
    currentCharId: null,
    isOpen: false,
    width: 0,
    height: 0,
    top: 0,
    left: 0,
  },
  updatePopover: (args: any) => {},
  renderPopover: ({
    content,
    rect,
    currentCharId,
  }: {
    content: React.ReactNode;
    rect: DOMRect;
    currentCharId: string;
  }) => {},
  closePopover: () => {},
  openPopover: () => {},
});

export function PopoverContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [popover, setPopover] = useState<Popover>({
    content: null,
    element: null,
    currentCharId: null,
    isOpen: false,
    width: 0,
    height: 0,
    top: 0,
    left: 0,
  });

  const updatePopover = (newValues: any) => {
    setPopover({ ...popover, ...newValues });
  };

  const renderPopover = ({
    content,
    element,
    rect,
    currentCharId,
  }: {
    content: React.ReactNode;
    element: HTMLElement;
    rect: DOMRect;
    currentCharId: string;
  }) => {
    const left = rect.left + window.scrollX;
    const right = rect.right + window.scrollX;
    const top = rect.top + window.scrollY;
    const bottom = rect.bottom + window.scrollY;
    const popoverDimensions =
      window.innerWidth > 768
        ? RESPONSIVE_DIMENSIONS.desktop
        : RESPONSIVE_DIMENSIONS.mobile;
    const currentPopoverCoordinates = {
      x: left - popoverDimensions.width,
      y: top - popoverDimensions.height,
    };

    for (const orientation of ["TL", "TR", "BR", "BL"]) {
      const yAxis = orientation[0];
      const xAxis = orientation[1];

      const buildFarthestCorner = () => {
        const farthestCorner = {
          x:
            xAxis === "L"
              ? left - popoverDimensions.width
              : right + popoverDimensions.width,
          y:
            yAxis === "T"
              ? top - popoverDimensions.height
              : bottom + popoverDimensions.height,
        };
        return farthestCorner;
      };

      const checkOverlapsViewport = (corner: { x: number; y: number }) => {
        const topOffset = window.scrollY;
        const minDistance = 30;
        if (yAxis === "T" && corner.y - topOffset < 0 + minDistance) {
          console.log("Overlaps top");
          return true;
        } else if (yAxis === "B" && corner.y > window.innerHeight) {
          console.log("Overlaps bottom");
          return true;
        } else if (xAxis === "L" && corner.x < 0) {
          console.log("Overlaps left");
          return true;
        } else if (xAxis === "R" && corner.x > window.innerWidth) {
          console.log("Overlaps right");
          return true;
        }

        return false;
      };
      // For each orientation, check if the popover overlaps the viewport.
      // If it doesn't, use that orientation.
      const farthestCorner = buildFarthestCorner();
      const hasOverlap = checkOverlapsViewport(farthestCorner);
      if (!hasOverlap) {
        // Place the popover at the position of its top leftmost corner.
        const popoverTop =
          yAxis === "T" ? top - popoverDimensions.height : bottom;
        const popoverLeft =
          xAxis === "L" ? left - popoverDimensions.width : right;
        currentPopoverCoordinates.x = popoverLeft;
        currentPopoverCoordinates.y = popoverTop;
        break;
      }
      // If there is inevitably overlap, go with the defaults.
    }
    setPopover({
      isOpen: true,
      content,
      element: element,
      currentCharId,
      width: popoverDimensions.width,
      height: popoverDimensions.height,
      top: currentPopoverCoordinates.y,
      left: currentPopoverCoordinates.x,
    });
  };

  const closePopover = () => {
    setPopover({
      ...popover,
      isOpen: false,
    });
  };

  const openPopover = () => {
    setPopover({
      ...popover,
      isOpen: true,
    });
  };

  return (
    <DefinitionPopoverContext.Provider
      value={{
        popover,
        updatePopover,
        renderPopover,
        closePopover,
        openPopover,
      }}
    >
      {children}
    </DefinitionPopoverContext.Provider>
  );
}

export function Popover() {
  const { popover, closePopover } = usePopover();
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

  if (!popover.isOpen) return null;

  if (!mounted || !ref.current) {
    return null;
  }

  return createPortal(
    <div
      style={{
        position: "absolute",
        width: popover.width,
        height: popover.height,
        top: popover.top,
        left: popover.left,
      }}
      className="z-10"
      id="popover-portal-root"
    >
      {popover.content}
    </div>,
    ref.current
  );
}

export function usePopover() {
  const context = useContext(DefinitionPopoverContext);
  return context;
}
