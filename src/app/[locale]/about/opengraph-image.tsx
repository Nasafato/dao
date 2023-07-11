import { OgLayout } from "@/components/OgLayout";
import { fetchFont } from "@/serverUtils";
import { computeUniqueChars } from "@/utils";
import { ImageResponse } from "next/server";
import { twJoin } from "tailwind-merge";

export default async function AboutOg() {
  const uniqueChars = computeUniqueChars("道德经");
  const notoSansScFont = await fetchFont(uniqueChars, "Noto+Sans+SC");
  if (!notoSansScFont) throw new Error("Failed to fetch font");

  return new ImageResponse(
    (
      <OgLayout>
        <div tw={twJoin("flex flex-col text-gray-900 text-[40px]")}>
          <p>
            The 道德经 (Dao De Jing) is a foundational Chinese text, compiled
            over 2000 years ago. It is short, terse, and often very difficult to
            parse.
          </p>
          <p>Read it at your own peril.</p>
        </div>
      </OgLayout>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [{ name: "Noto Sans SC 400", data: notoSansScFont }],
    }
  );
}
