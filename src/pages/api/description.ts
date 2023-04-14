import type { NextApiRequest, NextApiResponse } from "next";
import DAO_COMBINED from "./fixtures/dao-combined.json";

import * as z from "zod";

export type DaoVerseType = z.infer<typeof DaoVerse>;
export const DaoVerse = z.object({
  text: z.string(),
  description: z.string(),
  index: z.number(),
});

const DaoVersesIndex = z.array(DaoVerse);
type DaoVersesIndexType = z.infer<typeof DaoVersesIndex>;

const DaoCombined = DaoVersesIndex.parse(DAO_COMBINED);

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<string | { message: string }>
) {
  const fullUrl = `https://${req.headers.host}/${req.url}`;
  const { searchParams } = new URL(fullUrl);
  const verseId = Number.parseInt(searchParams.get("verseId") ?? "");
  if (!verseId || Number.isNaN(verseId) || typeof verseId !== "number") {
    res.status(400).json({ message: "No verse ID provided" });
    return;
  }
  const entry = DaoCombined[verseId - 1];
  if (!entry) {
    res.status(404).json({ message: "Not found" });
    return;
  }

  res.status(200).json(entry.description);
}
