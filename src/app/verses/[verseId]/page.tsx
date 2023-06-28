import VersePage from "./verseIdClientPage";
import { DAO_COMBINED, DAO_VERSES } from "../../../lib/daoText";

export default async function VerseDetailsPage({
  params,
}: {
  params: { verseId: string };
}) {
  const verseId = params.verseId;
  const verseIdNumber = Number(verseId);
  if (isNaN(verseIdNumber)) throw new Error("Invalid verseId");
  if (verseIdNumber < 1 || verseIdNumber > 81)
    throw new Error("Invalid verseId");
  const verse = DAO_COMBINED.find((v) => v.verseId.toString() === verseId);
  if (!verse) throw new Error("No verse");
  return <VersePage verse={verse} />;
}

export async function generateStaticParams() {
  const paths = [];
  for (let i = 1; i < 81; i++) {
    paths.push({
      verseId: i.toString(),
    });
  }
  return paths;
}
