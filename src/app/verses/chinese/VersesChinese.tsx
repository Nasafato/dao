"use client";
import { AuxVerseMemoryTestModal } from "../../../components/auxiliary/AuxVerseMemoryTestModal";
import { Verses } from "../../../components/primary/Verses";
import { Container } from "../../../components/shared/PageLayout";
import { DaoVerse } from "../../../types";

export function VersesChinese({ verses }: { verses: DaoVerse[] }) {
  return (
    <>
      <Container>
        <AuxVerseMemoryTestModal />
        <Verses verses={verses} />
      </Container>
    </>
  );
}
