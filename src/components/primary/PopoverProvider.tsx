import React, {
  createContext,
  useState,
  useMemo,
  useContext,
  useEffect,
} from "react";
import {
  computePopoverDimensions,
  computePosition,
} from "../../lib/positioning";
import { set } from "zod";

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
  popoverDimensions: PopoverDimensions;
  content: React.ReactNode | null;
  coordinates: Coordinates;
  isOpen: boolean;
  popoverRef: React.MutableRefObject<HTMLDivElement | null>;
};

type ApiContext = {
  renderPopover: (args: RenderPopoverArgs) => void;
  closePopover: () => void;
  openPopover: () => void;
};

export const PopoverDataContext = createContext<DataContext>({} as DataContext);
export const PopoverApiContext = createContext<ApiContext>({} as ApiContext);

interface RenderPopoverArgs {
  /** What's being rendered inside the popover. */
  content: React.ReactNode;
  /** The element over which the popover is positioned. */
  anchor: HTMLElement;
  /** The ID of the character. */
  currentCharId: string;
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
  const [isOpen, setIsOpen] = useState(false);
  const [popoverDimensions, setPopoverDimensions] = useState<{
    width: number;
    height: number;
  }>(computePopoverDimensions());

  const popoverRef = React.useRef<HTMLDivElement>(null);

  const api = useMemo(() => {
    const renderPopover = (args: RenderPopoverArgs) => {
      if (!popoverRef.current) return;
      const { anchor, content } = args;
      setAnchor(anchor);
      setContent(content);
      const desiredDimensions = computePopoverDimensions();
      const { position, computedDimensions } = computePosition({
        anchorElement: anchor,
        desiredDimensions: desiredDimensions,
      });
      setCoordinates(position);
      setIsOpen(true);
      setPopoverDimensions(computedDimensions);
    };

    const closePopover = () => {
      setIsOpen(false);
    };
    const openPopover = () => {
      setIsOpen(true);
    };

    return { renderPopover, closePopover, openPopover };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (anchor && popoverRef.current && isOpen) {
        const desiredDimensions = computePopoverDimensions();
        const { position, computedDimensions } = computePosition({
          anchorElement: anchor,
          desiredDimensions,
        });
        setCoordinates(position);
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
    };
  }, [coordinates, content, popoverRef, isOpen, popoverDimensions]);

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
