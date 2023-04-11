import DAO_DICT from "@/fixtures/dao-dictionary.json";
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const fullUrl = `https://${req.headers.host}/${req.url}`;
  res.status(200).json(DAO_DICT);
}
