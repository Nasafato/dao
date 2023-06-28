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
import { VerseCombined } from "../../../../types/materials";

export default function VersePage({ verse }: { verse: VerseCombined }) {
  const verseId = verse.verseId;
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
              pathname: "/chinese",
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
        <VerseText text={verse.verse} verseId={verse.verseId} />
        <VerseDescription data={verse} verseId={verse.verseId} />
      </Container>
    </PopoverProvider>
  );
}
