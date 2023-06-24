export function padVerseId(verseId: string | number) {
  let verseIdNumber;
  if (typeof verseId === "string") {
    verseIdNumber = Number(verseId);
  } else {
    verseIdNumber = verseId;
  }

  return `${verseIdNumber < 10 ? "0" : ""}${verseIdNumber}`;
}

export async function fetchFont(
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

export function computeUniqueChars(text: string) {
  const map: Record<string, boolean> = {};
  for (const char of text) {
    map[char] = true;
  }
  const uniqueChars = Object.keys(map).join("");
  return uniqueChars;
}

export function convertNumberToChinese(number: number) {
  // Support 1 through 99
  const numbers = [
    "零",
    "一",
    "二",
    "三",
    "四",
    "五",
    "六",
    "七",
    "八",
    "九",
    "十",
  ] as const;
  if (number < 11) {
    return numbers[number];
  }
  const tens = Math.floor(number / 10);
  const remainder = number % 10;
  return `${tens === 1 ? "" : numbers[tens]}十${
    remainder === 0 ? "" : numbers[remainder]
  }`;
}
