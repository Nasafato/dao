"use client";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { twJoin } from "tailwind-merge";
import { Translators } from "../../../../types/materials";
import { Tooltip } from "../../../components/Tooltip";
import { DAO_COMBINED } from "../../../lib/materials";
import {
  HeadingStyle,
  SecondaryDarkModeTextStyle,
  VerseStyle,
} from "../../../styles";

export function VersesEnglish({
  translator,
}: {
  translator: (typeof Translators)[number];
}) {
  if (translator === "gou") {
    let firstWithoutTranslation = DAO_COMBINED.findIndex(
      (verse) => !verse.translations.gou
    );
    const verses = DAO_COMBINED.slice(0, firstWithoutTranslation);
    return (
      <div>
        <section className="space-y-5">
          {verses.map((verse, index) => {
            const verseId = index + 1;
            return (
              <div key={verseId} className={VerseStyle({ size: "large" })}>
                <header className="flex items-center justify-between">
                  <a
                    className={HeadingStyle()}
                    href={`#dao${verseId}`}
                    id={`dao${verseId}`}
                  >
                    <h2>Verse {verseId}</h2>
                  </a>
                  <Tooltip
                    anchor={
                      <Link
                        href={{
                          pathname: `/verses/${verseId}`,
                          hash: `#dao${verseId}`,
                          query: { prev: `/english/${translator}` },
                        }}
                        className={`
                        ${SecondaryDarkModeTextStyle}
                        text-sm flex items-center hover:underline gap-x-1 px-1
                      `}
                      >
                        Go
                        <ArrowRightIcon
                          className={twJoin(
                            "h-3 w-3",
                            SecondaryDarkModeTextStyle
                          )}
                        />
                      </Link>
                    }
                    content={"Go to verse page"}
                    side={verseId === 1 ? "bottom" : "top"}
                  />
                </header>

                {verse.translations[translator]}
              </div>
            );
          })}
        </section>
        <section className="mt-5 pb-5">
          <h2 className={HeadingStyle()}>The rest</h2>
          <p
            className={VerseStyle({
              size: "large",
            })}
          >
            I haven&apos;t translated these yet. Stay tuned.
          </p>
        </section>
      </div>
    );
  }
  return (
    <div>
      <section className="space-y-5">
        {DAO_COMBINED.map((verse, index) => {
          const verseId = index + 1;
          return (
            <div
              key={verseId}
              className={VerseStyle({
                size: "large",
              })}
            >
              <a
                className={HeadingStyle()}
                href={`#dao${verseId}`}
                id={`dao${verseId}`}
              >
                <h2>Verse {verseId}</h2>
              </a>
              {verse.translations[translator]}
            </div>
          );
        })}
      </section>
    </div>
  );
}
