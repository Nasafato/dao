import { processLines, withStdinStdout } from "materials/cliUtils";

async function main() {
  await withStdinStdout(async (ctx, input) => {
    const lines = await processLines(input);
    const index = build(lines);
    return JSON.stringify(index);
  });
}

function build(lines: string[]) {
  const linesWithoutTitle = lines.slice(1);
  const descriptions: string[] = [];
  for (let i = 0; i < linesWithoutTitle.length - 1; i += 2) {
    const titleLine = linesWithoutTitle[i];
    const descriptionLine = linesWithoutTitle[i + 1];
    if (descriptionLine.startsWith("《老子")) {
      console.error("Out of order");
      console.error(i, titleLine, descriptionLine);
      break;
    }
    descriptions.push(descriptionLine.replace("【解释】 ", ""));
  }

  return descriptions;
}

if (require.main === module) {
  main();
}
