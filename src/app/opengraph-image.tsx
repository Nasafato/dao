export const runtime = "edge";
export const revalidate = 60;

import { ImageResponse } from "next/server";
import { DAO_VERSES } from "../lib/materials";
import { TRANSLATIONS_COMBINED as TRANSLATIONS } from "../lib/materials";
import { twJoin } from "tailwind-merge";
import { fetchFont } from "../serverUtils";
import { OgLayout } from "../components/OgLayout";

export default async function MainOG() {
  const inter300 = fetch(
    new URL(
      `../../node_modules/@fontsource/inter/files/inter-latin-300-normal.woff`,
      import.meta.url
    )
  ).then((res) => res.arrayBuffer());

  const inter600 = fetch(
    new URL(
      `../../node_modules/@fontsource/inter/files/inter-latin-600-normal.woff`,
      import.meta.url
    )
  ).then((res) => res.arrayBuffer());

  const robotoMono400 = fetch(
    new URL(
      `../../node_modules/@fontsource/roboto-mono/files/roboto-mono-latin-400-normal.woff`,
      import.meta.url
    )
  ).then((res) => res.arrayBuffer());

  const VERSE_1 = DAO_VERSES[0].text;
  const chars = VERSE_1 + "道德经";
  const map: Record<string, boolean> = {};
  for (const char of chars) {
    map[char] = true;
  }
  const uniqueChars = Object.keys(map).join("");
  const notoSansScFont = await fetchFont(uniqueChars, "Noto+Sans+SC");
  if (!notoSansScFont) throw new Error("Failed to fetch font");

  return new ImageResponse(
    (
      <OgLayout>
        <div tw="w-full text-[24px] text-gray-800 mb-8 flex">
          <div tw={VerseStyle}>{VERSE_1}</div>
        </div>
        <div tw={twJoin("w-full mb-10", TranslationStyle)}>
          {TRANSLATIONS[0].gou}
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

const VerseStyle = "text-[48px] text-gray-900";
const TranslationStyle = "text-[28px] text-gray-900";
