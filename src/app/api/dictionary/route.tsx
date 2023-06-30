import { NextResponse } from "next/server";
import { DenormalizedDictSchema } from "../../../../types/materials";

const UniqueAllCharsDict: DenormalizedDictSchema = require("../../../materials/dictionary/uniqueAllCharsDict.json");

export const config = {
  runtime: "edge",
};

export async function GET() {
  return NextResponse.json({ data: UniqueAllCharsDict });
}
