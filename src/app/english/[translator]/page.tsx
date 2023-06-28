"use client";

import { Translators } from "../../../../types/materials";
import { DAO_COMBINED } from "../../../lib/daoText";
import { HeadingStyle, VerseStyle } from "../../../styles";

export default async function VersesEnglish(props: {
  params: { translator: (typeof Translators)[number] };
}) {
  const { params } = props;
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
              {verse.translations[params.translator]}
            </div>
          );
        })}
      </section>
    </div>
  );
}

export async function generateStaticParams() {
  return Translators.map((translator) => ({
    translator,
  }));
}
