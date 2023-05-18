import { prisma } from "@/lib/prisma";
import { Verse } from "@prisma/client";
import { Inter } from "next/font/google";
import { Header } from "../components/primary/Header";
import { Verses } from "../components/primary/Verses";
import { AuxVerseMemoryTestModal } from "../components/auxiliary/AuxVerseMemoryTestModal";
import { useDaoStore } from "../state/store";
import { IndexedDbViewer } from "../debugging/IndexedDbViewer";
import { VerseMemoryStatus } from "../lib/localSchema";
import { INDEXED_DB_NAME, INDEXED_DB_VERSION } from "../lib/localDb";

const inter = Inter({ subsets: ["latin"] });

export default function Home({ verses }: { verses: Verse[] }) {
  return (
    <>
      <Header />
      <main className="px-8 pb-16 lg:px-24 lg:pb-24 pt-4 lg:pt-8 mt-12">
        <div className="z-10 w-full m-auto max-w-xl items-center justify-between font-mono text-sm">
          <AuxVerseMemoryTestModal />
          <IndexedDbViewer
            dbName={INDEXED_DB_NAME}
            version={INDEXED_DB_VERSION}
          />
          <Verses verses={verses} />
        </div>
      </main>
    </>
  );
}

export async function getStaticProps() {
  let verses;
  // try {
  //   verses = await prisma.verse.findMany({
  //     orderBy: {
  //       id: "asc",
  //     },
  //   });
  // } catch (err) {
  //   console.error(err);
  const daoText = await import("../fixtures/dao.json");
  verses = Array.from(daoText).map((value, index) => {
    return {
      text: value,
      id: index + 1,
    };
  });
  // }
  return {
    props: {
      verses,
    },
  };
}
