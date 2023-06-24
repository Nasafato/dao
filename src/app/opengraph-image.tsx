export const runtime = "edge";
export const revalidate = 60;

import { ImageResponse } from "next/server";
import VERSE_1 from "../../materials/verses/all/01.json";
import VERSE_2 from "../../materials/verses/all/02.json";
import TRANSLATIONS from "../../materials/translations/translations.json";
import { twJoin } from "tailwind-merge";

async function fetchFont(
  text: string,
  font: string
): Promise<ArrayBuffer | null> {
  const API = `https://fonts.googleapis.com/css2?family=${font}&text=${encodeURIComponent(
    text
  )}`;

  const css = await (
    await fetch(API, {
      headers: {
        // Make sure it returns TTF.
        "User-Agent":
          "Mozilla/5.0 (BB10; Touch) AppleWebKit/537.1+ (KHTML, like Gecko) Version/10.0.0.1337 Mobile Safari/537.1+",
      },
    })
  ).text();

  const resource = css.match(
    /src: url\((.+)\) format\('(opentype|truetype)'\)/
  );

  if (!resource) return null;

  const res = await fetch(resource[1]);

  return res.arrayBuffer();
}

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

  const chars = VERSE_1 + VERSE_2 + "道德经";
  const map: Record<string, boolean> = {};
  for (const char of chars) {
    map[char] = true;
  }
  const uniqueChars = Object.keys(map).join("");
  const notoSansScFont = await fetchFont(uniqueChars, "Noto+Sans+SC");
  if (!notoSansScFont) throw new Error("Failed to fetch font");

  return new ImageResponse(
    (
      <div
        tw="flex p-20 h-full w-full bg-white flex-col"
        style={font("Inter 300")}
      >
        <header tw="flex text-[36px] w-full items-center">
          <div tw="font-bold flex items-center" style={font("Inter 600")}>
            <span tw="mr-2">DAODEJING </span>
            <span tw="text-[60px]" style={font("Noto Sans SC 400")}>
              道德经
            </span>
          </div>
          <div tw="grow" />
          <div tw="text-[28px]">daodejing.app</div>
        </header>

        <main tw="flex mt-10 flex-col w-full" style={font("Noto Sans SC 400")}>
          <div tw="w-full text-[24px] text-gray-800 mb-8 flex">
            <div tw={VerseStyle}>{VERSE_1}</div>
          </div>
          <div tw={twJoin("w-full mb-10", TranslationStyle)}>
            {TRANSLATIONS[0].gou}
          </div>
        </main>
      </div>
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

// lil helper for mroe succinct styles
function font(fontFamily: string) {
  return { fontFamily };
}

const el = (
  <div className="flex p-10 h-full w-full bg-white flex-col">
    <header className="flex text-[28px] w-full">
      <div className="font-bold" style={font("Inter 600")}>
        {/* The Daodejing <span style={font("Noto Sans SC 400")}>(道德经)</span> */}
      </div>
      <div className="grow" />
      <div className="text-[24px]">daodejing.app</div>
    </header>

    <main className="flex mt-10 flex-col w-full">
      <div className="flex w-full text-[20px] text-gray-400 mb-3"></div>
    </main>
  </div>
);
