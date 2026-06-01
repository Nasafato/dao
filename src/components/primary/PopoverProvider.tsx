"use client";
import React, { createContext, useContext, useMemo, useState } from "react";
import colors from "tailwindcss/colors";
import { useDaoStore } from "@/state/store";

export type PopoverAnchor = {
  getBoundingClientRect: () => DOMRect;
  style?: CSSStyleDeclaration;
};

export type Popover = {
  content: React.ReactNode;
  currentCharId: string | null;
  element: PopoverAnchor | null;
  isOpen: boolean;
  width: number;
  height: number;
  top: number;
  left: number;
};

export type PopoverMeta = {
  charId: string;
  anchorCharId?: string;
  focusCharId?: string;
  selectionMode?: "character" | "range";
};

type DataContext = {
  meta: PopoverMeta | null;
  anchor: PopoverAnchor | null;
  content: React.ReactNode | null;
  isOpen: boolean;
};

type ApiContext = {
  renderPopover: (args: RenderPopoverArgs) => void;
  closePopover: (anchorElement: PopoverAnchor) => void;
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
  anchor: PopoverAnchor;
  /** Any metadata to pass */
  meta?: PopoverMeta;
}

/**
 * This is the popover provider for individual characters. It's designed to minimize re-renders when showing
 * the definition for each character. There are two contexts: one for the data and one for the API.
 *
 * The data context contains the data that's used to render the popover. The API context contains the methods
 * to control the popover state.
 *
 * I think we can add a better way for each character to know whether it's highlighted or not.
 * Right now, we imperatively update the styles of each character's element, which is not very React-y.
 *
 * The right way could be to add a state and state selectors by which each character can select only its own charId state,
 * and it will only change if it's been highlighted or not highlighted. That would solve the re-render issue.
 */
export function PopoverProvider({ children }: { children: React.ReactNode }) {
  const [anchor, setAnchor] = useState<PopoverAnchor | null>(null);
  const [content, setContent] = useState<React.ReactNode | null>(null);
  const isOpen = useDaoStore((s) => s.isPopoverOpen);
  const setIsOpen = useDaoStore((s) => s.setIsPopoverOpen);
  const [meta, setMeta] = useState<PopoverMeta | null>(null);

  const prevAnchor = React.useRef<PopoverAnchor | null>(null);

  const api = useMemo(() => {
    const renderPopover = (args: RenderPopoverArgs) => {
      const { anchor, content } = args;
      if (prevAnchor.current && prevAnchor.current !== anchor) {
        setAnchorColor(prevAnchor.current, "inherit");
        prevAnchor.current = anchor;
        setAnchorColor(anchor, colors.green["500"]);
      } else if (!prevAnchor.current) {
        prevAnchor.current = anchor;
        setAnchorColor(anchor, colors.green["500"]);
      }
      setAnchor(anchor);
      setContent(content);
      setIsOpen(true);
      setMeta(args.meta ?? null);
    };

    const closePopover = (anchorElement: PopoverAnchor) => {
      setAnchorColor(anchorElement, "inherit");
      setIsOpen(false);
    };

    return { renderPopover, closePopover };
  }, [setIsOpen]);

  const popover = useMemo(() => {
    return {
      content,
      isOpen,
      anchor,
      meta,
    };
  }, [content, isOpen, anchor, meta]);

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

function setAnchorColor(anchor: PopoverAnchor, color: string) {
  if (!anchor.style) return;
  anchor.style.color = color;
}
