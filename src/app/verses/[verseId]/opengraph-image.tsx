export const runtime = "edge";
export const revalidate = 60;

import { padVerseId } from "@/serverUtils";
import { ImageResponse } from "next/server";
// import { getPosts } from "@/app/get-posts";

export default async function Image({
  params,
}: {
  params: { verseId: string };
}) {
  const verseText = await fetch(
    new URL(
      `../../materials/verses/all/${padVerseId(params.verseId)}.json`,
      import.meta.url
    )
  );
  return new ImageResponse(
    (
      <div tw="flex p-10 h-full w-full bg-white flex-col">
        <header tw="flex text-[36px] w-full">
          <div tw="font-bold">
            The Daodejing (道德经): Verse {params.verseId}
          </div>
          <div tw="grow" />
          <div tw="text-[28px]">daodejing.app/verses</div>
        </header>

        <main tw="flex mt-10 flex-col w-full">
          <div tw="flex w-full text-[26px] text-gray-400 mb-3">
            {await verseText.text()}
          </div>
        </main>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
