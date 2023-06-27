import { Container } from "../../../components/shared/PageLayout";
import { DAO_COMBINED } from "../../../lib/daoText";
import { HeadingStyle, VerseStyle } from "../../../styles";

export default function VersesEnglish() {
  return (
    <Container className="space-y-5">
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
            {verse.translations.gou ?? verse.translations.goddard}
          </div>
        );
      })}
    </Container>
  );
}
