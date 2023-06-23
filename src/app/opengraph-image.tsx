export const runtime = "edge";
export const revalidate = 60;

import { ImageResponse } from "next/server";
import VERSE_1 from "../../materials/verses/all/01.json";
// import { getPosts } from "@/app/get-posts";

export default async function MainOG() {
  return new ImageResponse(
    (
      <div tw="flex p-10 h-full w-full bg-white flex-col">
        <header tw="flex text-[36px] w-full">
          <div tw="font-bold">The Daodejing (道德经)</div>
          <div tw="grow" />
          <div tw="text-[28px]">daodejing.app</div>
        </header>

        <main tw="flex mt-10 flex-col w-full">
          <div tw="flex w-full text-[26px] text-gray-400 mb-3">{VERSE_1}</div>
        </main>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
