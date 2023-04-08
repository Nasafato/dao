import type { NextApiRequest, NextApiResponse } from "next";
import DAO_DICT from "@/fixtures/dao-dictionary.json";
import { dictionaryEntrySchema, DictionaryEntry } from "@/types";

type DICT = Record<string, DictionaryEntry>;
const DAO_DICTIONARY = DAO_DICT as unknown as DICT;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<DictionaryEntry | { message: string }>
) {
  const fullUrl = `https://${req.headers.host}/${req.url}`;
  const { searchParams } = new URL(fullUrl);
  const word = searchParams.get("char");
  if (!word) {
    res.status(400).json({ message: "No word provided" });
    return;
  }
  const entry = DAO_DICTIONARY[word];
  if (!entry) {
    res.status(404).json({ message: "Not found" });
    return;
  }
  const validated = dictionaryEntrySchema.parse(entry);
  res.status(200).json(validated);
}
