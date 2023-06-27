import { Container } from "../../../components/shared/PageLayout";
import { DAO_COMBINED } from "../../../lib/daoText";
import { VerseStyle } from "../../../styles";

export default function VersesEnglish() {
  return (
    <Container className="space-y-5">
      {DAO_COMBINED.map((verse, index) => {
        return (
          <div
            key={index + 1}
            className={VerseStyle({
              size: "large",
            })}
          >
            {verse.translations.gou ?? verse.translations.goddard}
          </div>
        );
      })}
    </Container>
  );
}
