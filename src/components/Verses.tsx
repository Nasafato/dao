import { clsx } from "clsx";
import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { punctuation } from "../consts";
import { dictionaryEntrySchema } from "../types";
import { useQuery } from "@tanstack/react-query";
import { createPortal } from "react-dom";

type Dao = {
  id: number;
  text: string;
};

interface VerseProps {
  verses: Dao[];
}

type Popover = {
  content: React.ReactNode;
  currentCharId: string | null;
  isOpen: boolean;
  width: number;
  height: number;
  top: number;
  left: number;
};

const DefinitionPopoverContext = createContext<{
  popover: Popover;
  updatePopover: (args: any) => void;
  renderPopover: ({
    content,
    rect,
    currentCharId,
  }: {
    content: React.ReactNode;
    rect: DOMRect;
    currentCharId: string;
  }) => void;
  closePopover: () => void;
  openPopover: () => void;
}>({
  popover: {
    content: null,
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

function PopoverContextProvider({ children }: { children: React.ReactNode }) {
  const [popover, setPopover] = useState<Popover>({
    content: null,
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
    rect,
    currentCharId,
  }: {
    content: React.ReactNode;
    rect: DOMRect;
    currentCharId: string;
  }) => {
    const popoverDimensions = {
      width: 200,
      height: 160,
    };
    const currentPopoverCoordinates = {
      x: rect.left,
      y: rect.top,
    };

    for (const orientation of ["TL", "TR", "BR", "BL"]) {
      const yAxis = orientation[0];
      const xAxis = orientation[1];

      console.log("checking orientation", orientation, currentCharId);
      const buildFarthestCorner = () => {
        const farthestCorner = {
          x:
            xAxis === "L"
              ? rect.left - popoverDimensions.width
              : rect.right + popoverDimensions.width,
          y:
            yAxis === "T"
              ? rect.top - popoverDimensions.height
              : rect.bottom + popoverDimensions.height,
        };
        return farthestCorner;
      };

      const checkOverlapsViewport = (corner: { x: number; y: number }) => {
        if (yAxis === "T" && corner.y < 0) {
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
        console.log("orientation", orientation);
        // Place the popover at the position of its top leftmost corner
        const popoverTop =
          yAxis === "T" ? rect.top - popoverDimensions.height : rect.bottom;
        const popoverLeft =
          xAxis === "L" ? rect.left - popoverDimensions.width : rect.right;
        console.log("rect.top", rect.top, "popoverTop", popoverTop);
        currentPopoverCoordinates.x = popoverLeft;
        currentPopoverCoordinates.y = popoverTop;
        break;
      }
    }
    setPopover({
      isOpen: true,
      content,
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
        console.log("closing popover");
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

export function Verses({ verses }: VerseProps) {
  return (
    <PopoverContextProvider>
      <div className="space-y-4">
        {verses.map((verse) => {
          return <Verse key={verse.id} verse={verse} />;
        })}
        <Popover />
      </div>
    </PopoverContextProvider>
  );
}

function Verse({ verse }: { verse: Dao }) {
  const chars = verse.text.split("");
  const text = chars.map((char, index) => {
    if (punctuation.includes(char)) {
      return char;
    }
    return <Char key={index} char={char} charId={`${verse.id}-${index}`} />;
  });
  return (
    <div className="text-xl">
      <h2 className="text-gray-400 text-base">第{verse.id}章</h2>
      <div>{text}</div>
    </div>
  );
}

function Char({ char, charId }: { char: string; charId: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const { renderPopover, popover } = usePopover();

  return (
    <span
      ref={ref}
      onClick={() => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        renderPopover({
          content: <Definition char={char} />,
          currentCharId: charId,
          rect,
        });
      }}
      className={clsx("relative", {
        "text-green-600": popover.currentCharId === charId,
      })}
    >
      {char}
    </span>
  );
}

function Definition({ char }: { char: string }) {
  const { data } = useQuery({
    queryKey: ["definition", char],
    queryFn: async () => {
      if (!char) return;
      const r = await fetch(`/api/definition?char=${char}`);
      const result = await r.json();
      return dictionaryEntrySchema.parse(result);
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
    enabled: !!char,
  });

  return (
    <div
      className={clsx(
        "bg-white border-gray-500 border px-3 py-2 rounded-md shadow-md text-gray-800 overflow-scroll hyphens-auto h-full"
      )}
    >
      <h3>{char}</h3>
      <div className="text-sm">{data?.pinyin.join(" ")}</div>
      <ul className="list-decimal list-inside">
        {data &&
          data.definitions.english.map((def, index) => (
            <li className="text-xs" key={index}>
              {def}
            </li>
          ))}
      </ul>
      <ul>
        {data &&
          data.definitions.chinese?.map((def, index) => (
            <li className="text-xs" key={index}>
              {def}
            </li>
          ))}
      </ul>
    </div>
  );
}
