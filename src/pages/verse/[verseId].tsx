import { GetStaticPropsContext } from "next";
import { DAO_COMBINED_VERSES, DAO_VERSES } from "../../lib/daoText";
import { Verse } from "../../components/primary/Verse";
import { useVerseMemoryStatusQuery } from "../../lib/reactQuery";
import { VerseText } from "../../components/primary/VerseText";
import { forceQueryParamString } from "../../utils";
import { VerseDescription } from "../../components/primary/VerseDescription";
import { HorizontalRule } from "../../components/shared/HorizontalRule";
import Link from "next/link";
import { useRouter } from "next/router";

export default function VersePage({
  verse,
  description,
}: {
  verse: { id: number; text: string };
  description: {
    translations: { [key: string]: string };
    description: string;
  };
}) {
  const router = useRouter();
  const verseStatus = useVerseMemoryStatusQuery({ verseId: verse.id });
  return (
    <div>
      <div>第{verse.id}章</div>
      <VerseText text={verse.text} verseId={verse.id} />
      <HorizontalRule />
      <div className="mb-4">
        <button
          // href={"/"}
          className="hover:underline text-xs"
          onClick={() => router.back()}
        >
          Back
        </button>
      </div>
      <div className="text-gray-400">简介</div>
      <VerseDescription data={description} verseId={verse.id} />
    </div>
  );
}

export async function getStaticProps({ params }: GetStaticPropsContext) {
  const verseId = forceQueryParamString(params?.verseId);
  if (!verseId) {
    throw new Error("No verseId");
  }
  const verseIdNumber = parseInt(verseId);
  const verse = DAO_VERSES.find((v) => v.id.toString() === params?.verseId);
  const description = DAO_COMBINED_VERSES[verseIdNumber - 1];
  return {
    props: {
      verse,
      description,
    },
  };
}

export async function getStaticPaths() {
  const paths = [];
  for (let i = 1; i < 81; i++) {
    paths.push({
      params: { verseId: i.toString() },
    });
  }
  return {
    paths,
    fallback: false,
  };
}
