import { NextResponse } from "next/server";
// @ts-ignore
import UniqueAllCharsDict from "../../../../materials/dictionary/uniqueAllCharsDict.json";

export const runtime = "edge";

export async function GET() {
  return NextResponse.json({ data: UniqueAllCharsDict });
}
