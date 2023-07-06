import { ImageResponse } from "next/server";
import { twJoin } from "tailwind-merge";
import { OgLayout, VerseStyle } from "@/components/OgLayout";
import { computeUniqueChars, fetchFont } from "@/serverUtils";

export default async function DictionaryOg() {
  const uniqueChars = computeUniqueChars("道德经");
  const notoSansScFont = await fetchFont(uniqueChars, "Noto+Sans+SC");
  if (!notoSansScFont) throw new Error("Failed to fetch font");

  return new ImageResponse(
    (
      <OgLayout>
        <div tw={twJoin("flex flex-col", VerseStyle)}>
          <p>Search for characters in CEDict. Study the Dao.</p>
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
