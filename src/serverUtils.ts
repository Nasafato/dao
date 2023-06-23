export function padVerseId(verseId: string | number) {
  let verseIdNumber;
  if (typeof verseId === "string") {
    verseIdNumber = Number(verseId);
  } else {
    verseIdNumber = verseId;
  }

  return `${verseIdNumber < 10 ? "0" : ""}${verseIdNumber}`;
}
