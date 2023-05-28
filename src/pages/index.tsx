import { Verse } from "@prisma/client";
import { Inter } from "next/font/google";
import { AuxVerseMemoryTestModal } from "../components/auxiliary/AuxVerseMemoryTestModal";
import { Header } from "../components/primary/Header";
import { Verses } from "../components/primary/Verses";
import { IndexedDbViewer } from "../debugging/IndexedDbViewer";
import { DAO_VERSES } from "../lib/daoText";
import { INDEXED_DB_NAME, INDEXED_DB_VERSION } from "../lib/localDb/db";

const inter = Inter({ subsets: ["latin"] });

export default function Home({ verses }: { verses: Verse[] }) {
  return (
    <>
      <div className="w-full m-auto max-w-xl items-center justify-between text-sm">
        <AuxVerseMemoryTestModal />
        {/* <IndexedDbViewer
            dbName={INDEXED_DB_NAME}
            version={INDEXED_DB_VERSION}
          /> */}
        <Verses verses={verses} />
      </div>
    </>
  );
}

export async function getStaticProps() {
  return {
    props: {
      verses: DAO_VERSES,
    },
  };
}
