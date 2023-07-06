"use client";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { PopoverProvider } from "@/components/primary/PopoverProvider";
import { VerseDescription } from "@/components/primary/VerseDescription";
import { VerseHeaderStyle } from "@/components/primary/VerseHeader";
import { VerseText } from "@/components/primary/VerseText";
import { Container } from "@/components/shared/PageLayout";
import { SecondaryDarkModeTextStyle } from "@/styles";
import { VerseCombined } from "types/materials";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

export function VerseDetails({ verse }: { verse: VerseCombined }) {
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
          <Suspense
            fallback={
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
                  className={twMerge(
                    "w-3 h-3 mr-1",
                    SecondaryDarkModeTextStyle
                  )}
                />
                Back
              </Link>
            }
          >
            <LinkWithSearchParams verseId={verseId} />
          </Suspense>
        </div>
        <VerseText text={verse.verse} verseId={verse.verseId} />
        <VerseDescription data={verse} verseId={verse.verseId} />
      </Container>
    </PopoverProvider>
  );
}

function LinkWithSearchParams({ verseId }: { verseId: number }) {
  const searchParams = useSearchParams();
  const prevLink = searchParams?.get("prev");

  return (
    <Link
      href={{
        pathname: prevLink ? prevLink : "/chinese",
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
  );
}
