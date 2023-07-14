import { SHARED_METADATA } from "@/app/sharedMetadata";
import { VersesChinese } from "@/components/VersesChinese";
import { VersesEnglish } from "@/components/primary/VersesEnglish";
import { ResolvingMetadata, Metadata } from "next";
import { Languages } from "types/materials";

export default async function Verses({
  params,
}: {
  params: { language: (typeof Languages)[number] };
}) {
  const language = params.language;
  switch (language) {
    case "english":
      return <VersesEnglish translator="gou" />;
    case "chinese":
    default: {
      const versesArray = (await import("materials/verses/dao.json")).default;
      const verses = Array.from(versesArray).map((value, index) => {
        return {
          text: value,
          id: index + 1,
        };
      });
      return <VersesChinese verses={verses} />;
    }
  }
}

export async function generateStaticParams() {
  return Languages.map((language) => ({ language }));
}

export async function generateMetadata(
  { params, ...rest }: { params: { locale: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  return {
    ...SHARED_METADATA,
  };
}
