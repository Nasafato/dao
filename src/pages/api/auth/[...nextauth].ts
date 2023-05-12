// pages/api/auth/[...nextauth].ts

import { NextApiHandler } from "next";
import NextAuth, { AuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GitHubProvider from "next-auth/providers/github";
import { prisma } from "../../../lib/prisma";
import { authOptions } from "../../../server/auth";

const authHandler: NextApiHandler = (req, res) =>
  NextAuth(req, res, authOptions);

export default authHandler;

// export const authOptions: AuthOptions = {
//   providers: [
//     GitHubProvider({
//       clientId: process.env.GITHUB_ID ?? "",
//       clientSecret: process.env.GITHUB_SECRET ?? "",
//     }),
//   ],
//   adapter: PrismaAdapter(prisma),
//   secret: process.env.SECRET,
//   callbacks: {
//     async session({ session, user, token }) {
//       if (session.user) {
//         return { ...session, userId: user.id };
//       }
//       return session;
//     },
//   },
// };
