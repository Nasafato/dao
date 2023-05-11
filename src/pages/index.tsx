import prisma from "@/lib/prisma";
import { Verse } from "@prisma/client";
import { Inter } from "next/font/google";
import { Navbar } from "../components/Navbar";
import { Verses } from "../components/Verses";

const inter = Inter({ subsets: ["latin"] });

export default function Home({ verses }: { verses: Verse[] }) {
  return (
    <>
      <Navbar />
      <main className="px-8 pb-16 lg:px-24 lg:pb-24 pt-4 lg:pt-8 ">
        <div className="z-10 w-full m-auto max-w-xl items-center justify-between font-mono text-sm">
          <Verses verses={verses} />
        </div>
      </main>
    </>
  );
}

export async function getStaticProps() {
  const verses = await prisma.verse.findMany({
    orderBy: {
      id: "asc",
    },
  });
  return {
    props: {
      verses,
    },
  };
}
