"use client";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { PopoverProvider } from "../../../components/primary/PopoverProvider";
import { VerseDescription } from "../../../components/primary/VerseDescription";
import { VerseHeaderStyle } from "../../../components/primary/VerseHeader";
import { VerseText } from "../../../components/primary/VerseText";
import { Container } from "../../../components/shared/PageLayout";
import { SecondaryDarkModeTextStyle } from "../../../styles";

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
          <h4 className={VerseHeaderStyle}>
            <a id={`dao${verseId}`} href={`#dao${verseId}`}>
              第{verseId}章
            </a>
          </h4>
          <Link
            href={{
              pathname: "/",
              hash: `#dao${verseId}`,
            }}
            className={twMerge(
              "hover:underline flex items-center px-1",
              SecondaryDarkModeTextStyle
            )}
          >
            <ArrowLeftIcon
              className={twMerge("w-3 h-3 mr-1", SecondaryDarkModeTextStyle)}
            />
            Back
          </Link>
        </div>
        <VerseText text={verse.text} verseId={verse.id} />
        <div className="text-gray-400 mt-6">简介</div>
        <VerseDescription data={description} verseId={verse.id} />
      </Container>
    </PopoverProvider>
  );
}
