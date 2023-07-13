import "server-only";
import DAO_COMBINED from "materials/combined.json";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { verseId: string } }
) {
  const verseId = Number(params.verseId);
  const verse = DAO_COMBINED.find((verse) => verse.verseId === verseId);
  if (!verse) {
    return NextResponse.json({ error: "Verse not found" }, { status: 404 });
  }

  return NextResponse.json(verse);
}
