"use client";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import { GetStaticPropsContext } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { twMerge } from "tailwind-merge";
import { VerseDescription } from "../../../components/primary/VerseDescription";
import { VerseHeaderStyle } from "../../../components/primary/VerseHeader";
import { VerseText } from "../../../components/primary/VerseText";
import { Container } from "../../../components/shared/PageLayout";
import { DAO_COMBINED_VERSES, DAO_VERSES } from "../../../lib/daoText";
import { useVerseMemoryStatusQuery } from "../../../lib/reactQuery";
import { SecondaryDarkModeTextStyle } from "../../../styles";
import { forceQueryParamString } from "../../../utils";
import { PopoverProvider } from "../../../components/primary/PopoverProvider";

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
  const verseId = verse.id;
  return (
    <PopoverProvider>
      <Container>
        <div className="flex justify-between">
          <h4 className={VerseHeaderStyle}>第{verseId}章</h4>
          <Link
            href={`/#dao${verseId}`}
            className={twMerge(
              "hover:underline text-xs flex items-center",
              SecondaryDarkModeTextStyle
            )}
          >
            <ArrowLeftIcon
              className={twMerge("w-2 h-2 mr-1", SecondaryDarkModeTextStyle)}
            />
            Back
          </Link>
        </div>
        {/* <VerseHeader verse={verse} verseStatus={verseStatus.data ?? null} /> */}
        <VerseText text={verse.text} verseId={verse.id} />
        {/* <HorizontalRule /> */}

        <div className="text-gray-400 mt-6">简介</div>
        <VerseDescription data={description} verseId={verse.id} />
      </Container>
    </PopoverProvider>
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
