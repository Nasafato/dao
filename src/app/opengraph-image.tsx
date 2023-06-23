export const runtime = "edge";
export const revalidate = 60;

import { ImageResponse } from "next/server";
import VERSE_1 from "../../materials/verses/all/01.json";
import VERSE_2 from "../../materials/verses/all/02.json";
import TRANSLATIONS from "../../materials/translations/translations.json";
// import { getPosts } from "@/app/get-posts";

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

  const notoSans400 = fetch(
    new URL(
      `../..//node_modules/@fontsource/noto-sans-sc/files/noto-sans-sc-chinese-simplified-400-normal.woff`,
      import.meta.url
    )
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        tw="flex p-10 h-full w-full bg-white flex-col"
        style={font("Inter 300")}
      >
        <header tw="flex text-[36px] w-full">
          <div tw="font-bold flex" style={font("Inter 600")}>
            Daodejing 道德经
          </div>
          <div tw="grow" />
          <div tw="text-[28px]">daodejing.app</div>
        </header>

        <main tw="flex mt-10 flex-col w-full" style={font("Noto Sans SC 400")}>
          <div tw="w-full text-[24px] text-gray-800 mb-3 flex">
            <div tw="text-[32px]">{VERSE_1.slice(0, 30)}</div>
            <div tw="self-end">...</div>
          </div>
          <div tw="w-full text-[26px] text-gray-800 mb-6">
            {TRANSLATIONS[0].gou}
          </div>
          <div tw="w-full text-[26px] text-gray-800 mb-3 flex">
            <div tw="text-[32px]">{VERSE_2.slice(0, 30)}</div>
            <div tw="self-end">...</div>
          </div>
          <div tw="w-full text-[26px] text-gray-800 mb-3">
            {TRANSLATIONS[1].gou}
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
        { name: "Noto Sans SC 400", data: await notoSans400 },
      ],
    }
  );
}

// lil helper for mroe succinct styles
function font(fontFamily: string) {
  return { fontFamily };
}

const el = (
  <div className="flex p-10 h-full w-full bg-white flex-col">
    <header className="flex text-[28px] w-full">
      <div className="font-bold" style={font("Inter 600")}>
        The Daodejing <span style={font("Noto Sans SC 400")}>(道德经)</span>
      </div>
      <div className="grow" />
      <div className="text-[24px]">daodejing.app</div>
    </header>

    <main className="flex mt-10 flex-col w-full">
      <div className="flex w-full text-[20px] text-gray-400 mb-3"></div>
    </main>
  </div>
);
