import "server-only";
import { DAO_VERSES } from "@/lib/materials";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(DAO_VERSES);
}
