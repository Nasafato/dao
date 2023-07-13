import "server-only";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET() {
  console.log("running");
  return NextResponse.json({ data: "Hello World" });
}
