import { z } from "zod";
import { Definition } from "@/components/primary/Definition";
import {
  usePopoverApi,
  usePopoverData,
  type PopoverAnchor,
  type PopoverMeta,
} from "@/components/primary/PopoverProvider";
import { punctuation } from "@/consts";

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
type ReaderVerseTextEntry = {
  element: HTMLElement;
  text: string;
  textNode: Text;
};

const ReaderVerseTextMap = new Map<number, ReaderVerseTextEntry>();

export function addToRefMap(charId: string, ref: HTMLElement) {
  charIds.push(charId);
  RefMap.set(charId, ref);
}

export function registerReaderVerseText(verseId: number, element: HTMLElement) {
  const textNode = findTextNode(element);
  const text = textNode?.nodeValue ?? "";
  if (!textNode || !text) return () => {};

  const entry = {
    element,
    text,
    textNode,
  };
  ReaderVerseTextMap.set(verseId, entry);

  return () => {
    if (ReaderVerseTextMap.get(verseId)?.element === element) {
      ReaderVerseTextMap.delete(verseId);
    }
  };
}

function findTextNode(element: HTMLElement) {
  for (const child of element.childNodes) {
    if (child.nodeType === Node.TEXT_NODE) {
      return child as Text;
    }
  }
  return null;
}

export function getNextCharId(charId: string, forward = true) {
  const readerNextCharId = getNextReaderCharId(charId, forward);
  if (readerNextCharId) return readerNextCharId;

  const index = charIds.indexOf(charId);
  if (index === -1) return null;
  const addend = forward ? 1 : -1;
  const nextCharId = charIds[index + addend];
  if (!nextCharId) return null;

  const parts = location.pathname.split("/");
  const isInVerseDetails = parts.some((part) => part === "verse");
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

function getNextReaderCharId(charId: string, forward = true) {
  const { verseId, context, charIndex } = extractCharInfoFromId(charId);
  if (context !== "verse") return null;
  if (!ReaderVerseTextMap.has(verseId)) return null;

  const addend = forward ? 1 : -1;
  const verseIds = Array.from(ReaderVerseTextMap.keys()).sort((a, b) => a - b);
  let verseIdIndex = verseIds.indexOf(verseId);
  let nextCharIndex = charIndex + addend;

  while (verseIdIndex >= 0 && verseIdIndex < verseIds.length) {
    const nextVerseId = verseIds[verseIdIndex];
    const entry = ReaderVerseTextMap.get(nextVerseId);
    if (!entry) return null;

    if (nextCharIndex < 0) {
      verseIdIndex -= 1;
      const prevEntry = ReaderVerseTextMap.get(verseIds[verseIdIndex]);
      nextCharIndex = prevEntry ? prevEntry.text.length - 1 : -1;
      continue;
    }

    if (nextCharIndex >= entry.text.length) {
      verseIdIndex += 1;
      nextCharIndex = 0;
      continue;
    }

    const char = entry.text[nextCharIndex];
    if (canLookupReaderChar(char)) {
      return buildCharId({
        verseId: nextVerseId,
        charIndex: nextCharIndex,
        context: "verse",
      });
    }

    nextCharIndex += addend;
  }

  return null;
}

function canLookupReaderChar(char: string) {
  return !!char.trim() && !punctuation.includes(char);
}

export const CharMetaSchema = z.object({
  charId: z.string(),
  anchorCharId: z.string().optional(),
  focusCharId: z.string().optional(),
  selectionMode: z.enum(["character", "range"]).optional(),
});

type CharMeta = z.infer<typeof CharMetaSchema>;

export function useRenderNextOrPrevChar() {
  const popover = usePopoverData();
  const { extendNextChar, extendPrevChar, renderNextChar, renderPrevChar } =
    useCharNavigation();
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
    extendNextChar: () => {
      if (!meta.success) return;
      extendNextChar(meta.data);
    },
    extendPrevChar: () => {
      if (!meta.success) return;
      extendPrevChar(meta.data);
    },
  };
}

export function useCharInfo() {
  const { meta } = usePopoverData();
  if (!meta) {
    return {};
  }

  const nextCharId = getNextCharId(meta.charId);
  const nextChar = nextCharId ? getCharFromId(nextCharId) : null;
  const prevCharId = getPrevCharId(meta.charId);
  const prevChar = prevCharId ? getCharFromId(prevCharId) : null;

  return {
    nextChar: nextChar
      ? {
          charId: nextCharId,
          char: nextChar,
        }
      : null,
    currChar: {
      charId: meta.charId,
      char: getCharFromId(meta.charId),
    },
    prevChar: prevChar ? { charId: prevCharId, char: prevChar } : null,
  };
}

export function useCharNavigation() {
  const { renderPopover } = usePopoverApi();
  const renderCharId = (
    charId?: string | null,
    options?: {
      anchorCharId?: string;
      focusCharId?: string;
      selectionMode?: PopoverMeta["selectionMode"];
    }
  ) => {
    if (!charId) return;
    const charRef = RefMap.get(charId);
    const char = getCharFromId(charId);
    if (!char) return;

    const anchorCharId = options?.anchorCharId ?? charId;
    const focusCharId = options?.focusCharId ?? charId;
    const selectionMode = options?.selectionMode ?? "character";
    const readerRange =
      selectionMode === "range"
        ? getReaderSelectionRange(anchorCharId, focusCharId)
        : getReaderCharRange(charId);

    if (readerRange) {
      document.documentElement.dataset.readerCharacterSelection = "true";
      selectRange(readerRange);
      const focusRange = getReaderCharRange(focusCharId);
      const anchorRange = focusRange ?? readerRange;
      if (!getRangeRect(anchorRange)) return;
      CharMap.set(charId, char);
      renderPopover({
        anchor: createVirtualAnchor(anchorRange),
        content: (
          <Definition.Wrapper>
            <Definition char={char} />
          </Definition.Wrapper>
        ),
        meta: {
          anchorCharId,
          charId,
          focusCharId,
          selectionMode,
        },
      });
      return;
    }

    if (!charRef) return;

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

  const extendSelection = (meta: CharMeta, forward: boolean) => {
    const anchorCharId = meta.anchorCharId ?? meta.charId;
    const focusCharId = meta.focusCharId ?? meta.charId;
    const nextFocusCharId = getNextCharId(focusCharId, forward);
    if (!nextFocusCharId) return;
    if (!getReaderSelectionRange(anchorCharId, nextFocusCharId)) return;

    renderCharId(nextFocusCharId, {
      anchorCharId,
      focusCharId: nextFocusCharId,
      selectionMode:
        anchorCharId === nextFocusCharId ? "character" : "range",
    });
  };

  return {
    extendPrevChar: (meta: CharMeta) => extendSelection(meta, false),
    extendNextChar: (meta: CharMeta) => extendSelection(meta, true),
    renderCharId,
    renderPrevChar: (charId: string) => renderCharId(getPrevCharId(charId)),
    renderNextChar: (charId: string) => renderCharId(getNextCharId(charId)),
  };
}

function getCharFromId(charId: string) {
  const mappedChar = CharMap.get(charId);
  if (mappedChar) return mappedChar;

  const { verseId, context, charIndex } = extractCharInfoFromId(charId);
  if (context !== "verse") return null;

  const entry = ReaderVerseTextMap.get(verseId);
  return entry?.text[charIndex] ?? null;
}

export function getReaderCharRange(charId: string) {
  const { verseId, context, charIndex } = extractCharInfoFromId(charId);
  if (context !== "verse") return null;

  const entry = ReaderVerseTextMap.get(verseId);
  if (!entry) return null;
  if (charIndex < 0 || charIndex >= entry.text.length) return null;

  const range = document.createRange();
  range.setStart(entry.textNode, charIndex);
  range.setEnd(entry.textNode, charIndex + 1);
  return range;
}

function getReaderSelectionRange(anchorCharId: string, focusCharId: string) {
  const anchor = extractCharInfoFromId(anchorCharId);
  const focus = extractCharInfoFromId(focusCharId);
  if (anchor.context !== "verse" || focus.context !== "verse") return null;
  if (anchor.verseId !== focus.verseId) return null;

  const entry = ReaderVerseTextMap.get(anchor.verseId);
  if (!entry) return null;
  if (anchor.charIndex < 0 || anchor.charIndex >= entry.text.length) return null;
  if (focus.charIndex < 0 || focus.charIndex >= entry.text.length) return null;

  const startIndex = Math.min(anchor.charIndex, focus.charIndex);
  const endIndex = Math.max(anchor.charIndex, focus.charIndex) + 1;
  const range = document.createRange();
  range.setStart(entry.textNode, startIndex);
  range.setEnd(entry.textNode, endIndex);
  return range;
}

function getRangeRect(range: Range) {
  const rect = Array.from(range.getClientRects()).find(
    (rect) => rect.width > 0 && rect.height > 0
  );
  if (!rect) return null;

  return DOMRect.fromRect({
    x: rect.x,
    y: rect.y,
    width: rect.width,
    height: rect.height,
  });
}

function selectRange(range: Range) {
  const selection = window.getSelection();
  if (!selection) return;

  selection.removeAllRanges();
  selection.addRange(range);
}

function createVirtualAnchor(range: Range): PopoverAnchor {
  const fallbackRect = getRangeRect(range) ?? new DOMRect();

  return {
    getBoundingClientRect: () => getRangeRect(range) ?? fallbackRect,
  };
}
