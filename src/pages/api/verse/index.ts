// pages/api/post/index.ts

import { getSession } from "next-auth/react";
import prisma from "../../../lib/prisma";

import type { NextApiRequest, NextApiResponse } from "next";
import { VerseToUser } from "@prisma/client";
import { VerseToUserSchema } from "../../../types";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ message?: string; data?: VerseToUser[] | VerseToUser }>
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  // @ts-ignore
  const userId = session.userId;

  const { method } = req;
  if (method === "GET") {
    const verseToUsers = await prisma.verseToUser.findMany({
      where: { userId },
    });

    return res.status(200).json({
      data: verseToUsers,
    });
  } else if (method === "POST") {
    const { verseId, status } = VerseToUserSchema.parse(JSON.parse(req.body));
    const verseToUser = await prisma.verseToUser.upsert({
      where: {
        verseId_userId: {
          verseId,
          userId,
        },
      },
      update: {
        status,
      },
      create: {
        status,
        verseId,
        userId,
      },
    });
    return res.status(200).json({ message: "Success", data: verseToUser });
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
