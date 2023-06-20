import VersePage from "./verseIdClientPage";
import { DAO_COMBINED_VERSES, DAO_VERSES } from "../../../lib/daoText";

export async function generateStaticParams() {
  const paths = [];
  for (let i = 1; i < 81; i++) {
    paths.push({
      verseId: i.toString(),
    });
  }
  return paths;
}

async function getVerse(verseId: string) {
  const verseIdNumber = Number(verseId);
  if (isNaN(verseIdNumber)) throw new Error("Invalid verseId");
  if (verseIdNumber < 1 || verseIdNumber > 81)
    throw new Error("Invalid verseId");
  const verse = DAO_VERSES.find((v) => v.id.toString() === verseId);
  if (!verse) throw new Error("No verse");
  const description = DAO_COMBINED_VERSES[verseIdNumber - 1];
  return {
    verse,
    description,
  };
}

export default async function VerseDetailsPage({
  params,
}: {
  params: { verseId: string };
}) {
  const verseId = params.verseId;
  const { verse, description } = await getVerse(verseId);
  // @ts-ignore Screw it.
  return <VersePage verse={verse} description={description} />;
}
