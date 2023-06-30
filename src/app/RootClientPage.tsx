"use client";
import { Inter } from "next/font/google";
import { AuxVerseMemoryTestModal } from "../components/auxiliary/AuxVerseMemoryTestModal";
import { Verses } from "../components/primary/Verses";
import { Container } from "../components/shared/PageLayout";
import { DAO_VERSES } from "../lib/materials";
import { DaoVerse } from "../types";

const inter = Inter({ subsets: ["latin"] });

export function RootClientPage({ verses }: { verses: DaoVerse[] }) {
  return (
    <>
      <Container>
        <AuxVerseMemoryTestModal />
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
