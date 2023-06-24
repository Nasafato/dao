import {
  OgLayout,
  TranslationStyle,
  VerseStyle,
} from "../../components/OgLayout";
import { ImageResponse } from "next/server";
import { computeUniqueChars, fetchFont } from "../../serverUtils";
import { twJoin } from "tailwind-merge";

export default async function DictionaryOg() {
  const uniqueChars = computeUniqueChars("道德经");
  const notoSansScFont = await fetchFont(uniqueChars, "Noto+Sans+SC");
  if (!notoSansScFont) throw new Error("Failed to fetch font");

  return new ImageResponse(
    (
      <OgLayout>
        <div tw={twJoin("flex flex-col max-w-sm", VerseStyle)}>
          <p>Search for characters in CEDict.</p>
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
