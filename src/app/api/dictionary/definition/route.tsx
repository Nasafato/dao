import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const config = {
  runtime: "edge",
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const searchTerm = searchParams.get("query");
  if (!searchTerm) {
    return NextResponse.json({ data: [] });
  }
  let entries = await prisma.entry.findMany({
    where: {
      OR: [
        {
          simplified: searchTerm,
        },
        {
          traditional: searchTerm,
        },
      ],
    },
    include: {
      definitions: true,
    },
  });

  return NextResponse.json({ data: entries });
}
