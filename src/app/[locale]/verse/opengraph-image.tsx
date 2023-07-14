import { OgLayout, font } from "@/components/OgLayout";
import { fetchFont, fetchRelevantFont } from "@/serverUtils";
import { computeUniqueChars } from "@/utils";
import { ImageResponse } from "next/server";

export default async function RootOg() {
  const uniqueChars = computeUniqueChars("道德经");
  const notoSerifScFont = await fetchRelevantFont(uniqueChars, "Noto+Serif+SC");
  const notoSerifFont = await fetchFont("Noto+Serif");
  if (!notoSerifScFont)
    throw new Error("RootOG: Failed to fetch Noto Serif SC font");
  if (!notoSerifFont)
    throw new Error("RootOG: Failed to fetch Noto Serif font");
  return new ImageResponse(
    (
      <OgLayout style={font("Noto Serif")}>
        <div tw="flex text-[48px]" style={font("Noto Serif SC")}>
          Read the Dao. The 道德经.
        </div>
      </OgLayout>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Noto Serif SC",
          data: notoSerifScFont,
        },
        {
          name: "Noto Serif",
          data: notoSerifFont,
        },
      ],
    }
  );
}
