import { useEffect, useRef } from "react";
import {
  CharMap,
  addToRefMap,
  useCharNavigation,
} from "../../lib/charNavigation";

export function VerseChar({ char, charId }: { char: string; charId: string }) {
  const { renderCharId } = useCharNavigation();
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    addToRefMap(charId, ref.current);
    CharMap.set(charId, char);
  }, [charId, char]);

  return (
    <span
      id={charId}
      ref={ref}
      onClick={() => {
        if (!ref.current) return;
        renderCharId(charId);
      }}
    >
      {char}
    </span>
  );
}
