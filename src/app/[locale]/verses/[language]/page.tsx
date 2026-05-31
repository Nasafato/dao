import { SHARED_METADATA } from "@/app/sharedMetadata";
import { VersesChinese } from "@/components/VersesChinese";
import { VersesEnglish } from "@/components/primary/VersesEnglish";
import { Metadata } from "next";
import { Languages } from "types/materials";

export default async function Verses(props: {
  params: Promise<{ language: (typeof Languages)[number] }>;
}) {
  const { language } = await props.params;
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

export async function generateMetadata(): Promise<Metadata> {
  return {
    ...SHARED_METADATA,
  };
}
