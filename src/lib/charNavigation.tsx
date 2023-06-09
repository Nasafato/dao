import { z } from "zod";
import { Definition } from "../components/primary/Definition";
import {
  usePopoverApi,
  usePopoverData,
} from "../components/primary/PopoverProvider";

export function buildCharId(args: {
  verseId: number;
  charIndex: number;
  context: "description" | "verse";
}) {
  const { verseId, charIndex, context } = args;
  return `${verseId}-${context}-${charIndex}`;
}

export function extractCharInfoFromId(charId: string) {
  const [verseId, context, charIndex] = charId.split("-");
  return {
    verseId: Number(verseId),
    context,
    charIndex: Number(charIndex),
  };
}

export const RefMap = new Map<string, HTMLElement>();
export const CharMap = new Map<string, string>();
export const charIds: string[] = [];
export function addToRefMap(charId: string, ref: HTMLElement) {
  charIds.push(charId);
  RefMap.set(charId, ref);
}

export function getNextCharId(charId: string, forward = true) {
  const index = charIds.indexOf(charId);
  if (index === -1) return null;
  const addend = forward ? 1 : -1;
  const nextCharId = charIds[index + addend];
  if (!nextCharId) return null;

  const isInVerseDetails = location.pathname.includes("/verse");
  if (isInVerseDetails) {
    const { verseId } = extractCharInfoFromId(charId);
    const { verseId: nextCharVerseId } = extractCharInfoFromId(nextCharId);
    if (verseId !== nextCharVerseId) {
      return null;
    }
  }

  return nextCharId;
}

export function getPrevCharId(charId: string) {
  return getNextCharId(charId, false);
}

export const CharMetaSchema = z.object({
  charId: z.string(),
});

export function useRenderNextOrPrevChar() {
  const popover = usePopoverData();
  const { renderNextChar, renderPrevChar } = useCharNavigation();
  const meta = CharMetaSchema.safeParse(popover.meta);
  let charId: string | null;
  if (meta.success) {
    charId = meta.data.charId;
  } else {
    charId = null;
  }
  return {
    renderNextChar: () => {
      if (!charId) return;
      renderNextChar(charId);
    },
    renderPrevChar: () => {
      if (!charId) return;
      renderPrevChar(charId);
    },
  };
}

export function useCharInfo() {
  const { meta } = usePopoverData();
  if (!meta) {
    return {};
  }

  const nextCharId = getNextCharId(meta.charId);
  const nextChar = nextCharId ? CharMap.get(nextCharId) : null;
  const prevCharId = getPrevCharId(meta.charId);
  const prevChar = prevCharId ? CharMap.get(prevCharId) : null;

  return {
    nextChar: nextChar
      ? {
          charId: nextCharId,
          char: nextChar,
        }
      : null,
    currChar: {
      charId: meta.charId,
      char: CharMap.get(meta.charId),
    },
    prevChar: prevChar ? { charId: prevCharId, char: prevChar } : null,
  };
}

export function useCharNavigation() {
  const { renderPopover } = usePopoverApi();
  const renderCharId = (charId?: string | null) => {
    if (!charId) return;
    const charRef = RefMap.get(charId);
    const char = CharMap.get(charId);
    if (!charRef) return;
    if (!char) return;
    renderPopover({
      anchor: charRef,
      content: (
        <Definition.Wrapper>
          <Definition char={char} />
        </Definition.Wrapper>
      ),
      meta: {
        charId,
      },
    });
  };

  return {
    renderCharId,
    renderPrevChar: (charId: string) => renderCharId(getPrevCharId(charId)),
    renderNextChar: (charId: string) => renderCharId(getNextCharId(charId)),
  };
}
