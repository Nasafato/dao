import { Translators } from "../../../../types/materials";
import { DAO_COMBINED } from "../../../lib/daoText";
import { HeadingStyle, VerseStyle } from "../../../styles";

export default async function VersesEnglish(props: {
  params: { translator: (typeof Translators)[number] };
}) {
  const translator = props.params.translator;
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

export async function generateStaticParams() {
  return Translators.map((translator) => ({
    translator,
  }));
}
