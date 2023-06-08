import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import colors from "tailwindcss/colors";
import {
  computePopoverDimensions,
  computePosition,
} from "../../lib/positioning";

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

type PopoverDimensions = {
  width: number;
  height: number;
};

type DataContext = {
  meta: Record<string, any>;
  popoverDimensions: PopoverDimensions;
  arrow: Arrow;
  anchor: HTMLElement | null;
  content: React.ReactNode | null;
  coordinates: Coordinates;
  isOpen: boolean;
  popoverRef: React.MutableRefObject<HTMLDivElement | null>;
};

type ApiContext = {
  renderPopover: (args: RenderPopoverArgs) => void;
  closePopover: (anchorElement: HTMLElement) => void;
  // openPopover: () => void;
};

export type Arrow = {
  orientation: "facingUp" | "facingDown";
  left: number;
};

export const PopoverDataContext = createContext<DataContext>({} as DataContext);
export const PopoverApiContext = createContext<ApiContext>({} as ApiContext);

interface RenderPopoverArgs {
  /** What's being rendered inside the popover. */
  content: React.ReactNode;
  /** The element over which the popover is positioned. */
  anchor: HTMLElement;
  /** Any metadata to pass */
  meta?: Record<string, any>;
}

type Coordinates = {
  left: number;
  top: number;
};

export function PopoverProvider({ children }: { children: React.ReactNode }) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const [content, setContent] = useState<React.ReactNode | null>(null);
  const [coordinates, setCoordinates] = useState<Coordinates>({
    left: 0,
    top: 0,
  });
  const [arrow, setArrow] = useState<Arrow>({
    orientation: "facingUp",
    left: 0,
  });
  const [isOpen, setIsOpen] = useState(false);
  const [popoverDimensions, setPopoverDimensions] = useState<{
    width: number;
    height: number;
  }>(computePopoverDimensions());
  const [meta, setMeta] = useState<Record<string, any>>({});

  const popoverRef = React.useRef<HTMLDivElement>(null);
  const prevAnchor = React.useRef<HTMLElement | null>(null);

  const api = useMemo(() => {
    const renderPopover = (args: RenderPopoverArgs) => {
      if (!popoverRef.current) return;
      const { anchor, content } = args;
      if (prevAnchor.current && prevAnchor.current !== anchor) {
        prevAnchor.current.style.color = "inherit";
        prevAnchor.current = anchor;
        anchor.style.color = colors.green["500"];
      } else if (!prevAnchor.current) {
        prevAnchor.current = anchor;
        anchor.style.color = colors.green["500"];
      }
      const desiredDimensions = computePopoverDimensions();
      const { position, computedDimensions, arrow } = computePosition({
        anchorElement: anchor,
        desiredDimensions: desiredDimensions,
      });
      setAnchor(anchor);
      setContent(content);
      setCoordinates(position);
      setIsOpen(true);
      setArrow(arrow);
      setPopoverDimensions(computedDimensions);
      setMeta(args.meta || {});
    };

    const closePopover = (anchorElement: HTMLElement) => {
      anchorElement.style.color = "inherit";
      setIsOpen(false);
    };

    return { renderPopover, closePopover };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (anchor && popoverRef.current && isOpen) {
        if (prevAnchor.current && prevAnchor.current !== anchor) {
          prevAnchor.current.style.color = "inherit";
          prevAnchor.current = anchor;
          anchor.style.color = colors.green["500"];
        } else if (!prevAnchor.current) {
          prevAnchor.current = anchor;
          anchor.style.color = colors.green["500"];
        }
        const desiredDimensions = computePopoverDimensions();
        const { position, computedDimensions, arrow } = computePosition({
          anchorElement: anchor,
          desiredDimensions,
        });
        setCoordinates(position);
        setArrow(arrow);
        setPopoverDimensions(computedDimensions);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [anchor, isOpen]);

  const popover = useMemo(() => {
    return {
      popoverDimensions,
      coordinates,
      content,
      popoverRef,
      isOpen,
      anchor,
      arrow,
      meta,
    };
  }, [
    coordinates,
    content,
    popoverRef,
    isOpen,
    popoverDimensions,
    anchor,
    arrow,
    meta,
  ]);

  return (
    <PopoverApiContext.Provider value={api}>
      <PopoverDataContext.Provider value={popover}>
        {children}
      </PopoverDataContext.Provider>
    </PopoverApiContext.Provider>
  );
}

export function usePopoverApi() {
  const context = useContext(PopoverApiContext);
  return context;
}

export function usePopoverData() {
  const context = useContext(PopoverDataContext);
  return context;
}
