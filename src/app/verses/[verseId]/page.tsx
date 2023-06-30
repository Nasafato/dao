import { DAO_COMBINED } from "../../../lib/materials";
import { VerseDetails } from "./VerseDetails";

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
  return <VerseDetails verse={verse} />;
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
