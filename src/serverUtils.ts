import "server-only";

export async function fetchFont(font: string): Promise<ArrayBuffer | null> {
  const API = `https://fonts.googleapis.com/css2?family=${font}`;

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

export async function fetchRelevantFont(
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
