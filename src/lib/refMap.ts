import { z } from "zod";

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
