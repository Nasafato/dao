import { DAO_VERSES } from "@/lib/daoText";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(DAO_VERSES);
}
