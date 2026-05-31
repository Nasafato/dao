import { VersesEnglish } from "@/components/primary/VersesEnglish";
import { Container } from "@/components/shared/PageLayout";
import { Translators } from "types/materials";

export default async function VersesTranslation(
  props: {
    params: Promise<{
      translator: string;
      language: string;
    }>;
  }
) {
  const params = await props.params;
  const { language, translator } = params;
  switch (language) {
    default:
    case "english":
      return (
        <Container>
          <VersesEnglish
            translator={translator as (typeof Translators)[number]}
          />
        </Container>
      );
  }
}

export async function generateStaticParams() {
  return Translators.map((translator) => ({
    translator,
  }));
}
