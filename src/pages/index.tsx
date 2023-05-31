import { Inter } from "next/font/google";
import { AuxVerseMemoryTestModal } from "../components/auxiliary/AuxVerseMemoryTestModal";
import { Verses } from "../components/primary/Verses";
import { Container } from "../components/shared/PageLayout";
import { DAO_VERSES } from "../lib/daoText";
import { DaoVerse } from "../types";

const inter = Inter({ subsets: ["latin"] });

export default function Home({ verses }: { verses: DaoVerse[] }) {
  return (
    <>
      <Container>
        <AuxVerseMemoryTestModal />
        {/* <IndexedDbViewer
            dbName={INDEXED_DB_NAME}
            version={INDEXED_DB_VERSION}
          /> */}
        <Verses verses={verses} />
      </Container>
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
