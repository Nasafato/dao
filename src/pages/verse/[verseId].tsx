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
import {
  VerseHeader,
  VerseHeaderStyle,
} from "../../components/primary/VerseHeader";
import { CDN_URL } from "../../consts";
import { Container } from "../../components/shared/PageLayout";
import {
  ArrowLeftCircleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "@heroicons/react/20/solid";

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
  const verseId = verse.id;
  const verseStatus = useVerseMemoryStatusQuery({ verseId });
  return (
    <Container>
      <div className="flex justify-between">
        <h4 className={VerseHeaderStyle}>第{verseId}章</h4>
        <Link
          href={`/#dao${verseId}`}
          className="hover:underline text-xs text-gray-600 flex items-center"
        >
          <ArrowLeftIcon className="text-gray-500 w-2 h-2 mr-1" />
          Back
        </Link>
      </div>
      {/* <VerseHeader verse={verse} verseStatus={verseStatus.data ?? null} /> */}
      <VerseText text={verse.text} verseId={verse.id} />
      {/* <HorizontalRule /> */}

      <div className="text-gray-400 mt-6">简介</div>
      <VerseDescription data={description} verseId={verse.id} />
    </Container>
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
