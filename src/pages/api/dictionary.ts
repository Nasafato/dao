import DAO_DICT from "./fixtures/dao-combined-dictionary.json";
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(DAO_DICT);
}
