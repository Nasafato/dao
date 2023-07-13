export const runtime = "edge";
export const revalidate = 60;

import { fetchFont } from "@/serverUtils";
import { computeUniqueChars, convertNumberToChinese } from "@/utils";
import { ImageResponse } from "next/server";
import { twJoin } from "tailwind-merge";
import { TRANSLATIONS_COMBINED as TRANSLATIONS } from "@/lib/materials";
import {
  OgLayout,
  TranslationStyle,
  VerseStyle,
  font,
} from "@/components/OgLayout";
import { DAO_VERSES } from "@/lib/materials";

export default async function VerseDetailsOG({
  params,
}: {
  params: { verseId: string };
}) {
  const inter300 = fetch(
    new URL(
      `../../../../../node_modules/@fontsource/inter/files/inter-latin-300-normal.woff`,
      import.meta.url
    )
  ).then((res) => res.arrayBuffer());

  const inter600 = fetch(
    new URL(
      `../../../../../node_modules/@fontsource/inter/files/inter-latin-600-normal.woff`,
      import.meta.url
    )
  ).then((res) => res.arrayBuffer());

  const robotoMono400 = fetch(
    new URL(
      `../../../../../node_modules/@fontsource/roboto-mono/files/roboto-mono-latin-400-normal.woff`,
      import.meta.url
    )
  ).then((res) => res.arrayBuffer());

  const verse = DAO_VERSES.find((v) => v.id.toString() === params.verseId);
  if (!verse) {
    throw new Error("No verse");
  }

  const header = "第" + convertNumberToChinese(verse.id) + "章";
  const uniqueChars = computeUniqueChars(verse.text + "道德经" + header);
  const notoSansScFont = await fetchFont(uniqueChars, "Noto+Sans+SC");
  if (!notoSansScFont) throw new Error("Failed to fetch font");

  return new ImageResponse(
    (
      <OgLayout>
        <h2
          tw="text-[42px] font-bold flex items-center"
          style={font("Inter 600")}
        >
          <span tw="mr-6 text-[28px]">VERSE {verse.id}</span>
          <span style={font("Noto Sans SC 400")}>({header})</span>
        </h2>
        <div tw="w-full text-[24px] text-gray-800 mb-8 flex">
          <div tw={VerseStyle}>{verse.text}</div>
        </div>
        <div tw={twJoin("w-full mb-10", TranslationStyle)}>
          {TRANSLATIONS[Number(params.verseId) - 1].gou}
        </div>
      </OgLayout>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Inter 300", data: await inter300 },
        { name: "Inter 600", data: await inter600 },
        { name: "Roboto Mono 400", data: await robotoMono400 },
        { name: "Noto Sans SC 400", data: notoSansScFont },
      ],
    }
  );
}
