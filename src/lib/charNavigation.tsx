import { z } from "zod";
import {
  usePopoverApi,
  usePopoverData,
} from "../components/primary/PopoverProvider";
import { Definition } from "../components/primary/Definition";

export const RefMap = new Map<string, HTMLElement>();
export const CharMap = new Map<string, string>();
export const charIds: string[] = [];
export function addToRefMap(charId: string, ref: HTMLElement) {
  charIds.push(charId);
  RefMap.set(charId, ref);
}

export function getNextCharId(charId: string) {
  const index = charIds.indexOf(charId);
  if (index === -1) return null;
  if (index === charIds.length - 1) return null;
  return charIds[index + 1];
}

export function getPrevCharId(charId: string) {
  const index = charIds.indexOf(charId);
  if (index === -1) return null;
  if (index === 0) return null;
  return charIds[index - 1];
}

export const CharMetaSchema = z.object({
  charId: z.string(),
});

export function useRenderNextOrPrevChar() {
  const popover = usePopoverData();
  const { renderNextChar, renderPrevChar } = useCharNavigation();
  const meta = CharMetaSchema.safeParse(popover.meta);
  console.log("meta", meta, "popover", popover);
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
          {/* <Definition.Navigation
            char={char}
            charId={charId}
            className="h-[10%]"
          /> */}
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
