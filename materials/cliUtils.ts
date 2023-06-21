import { createInterface } from "readline";
import CliProgress from "cli-progress";
import fs from "fs";

export async function withStdinStdout(
  func: (args: NodeJS.ReadableStream) => Promise<string | void>
) {
  const inputFile = process.argv[2] || null;
  const outputFile = inputFile ? process.argv[3] || process.argv[2] : null;

  let inputStream: NodeJS.ReadableStream;
  if (inputFile) {
    inputStream = fs.createReadStream(inputFile);
  } else {
    inputStream = process.stdin;
  }

  const result = await func(inputStream);
  if (!result) {
    return;
  }

  if (outputFile) {
    await fs.promises.writeFile(outputFile, result);
  } else {
    process.stdout.write(result);
  }
}

// First, the func should take a file descriptor as an argument, which is either stdin or a file.
// Next, the func should output a readable stream or equivalent, which the wrapper function can then decide whether to write to file or stdout.

export async function processLines(input: NodeJS.ReadableStream) {
  const rl = createInterface({
    input,
    crlfDelay: Infinity,
  });

  const lines: string[] = [];
  for await (const line of rl) {
    lines.push(line.trim());
  }

  return lines;
}

export async function benchmark(
  func: (onItemComplete: () => void) => Promise<void>,
  numItems: number,
  opts: { stream?: NodeJS.WritableStream } = { stream: process.stderr }
) {
  const bar = new CliProgress.SingleBar({}, CliProgress.Presets.shades_classic);
  let itemsProcessed = 0;
  bar.start(numItems, itemsProcessed);
  const startTime = performance.now();
  const stream = opts.stream || process.stderr;

  const signalHandler = () => {
    const elapsedTime = performance.now() - startTime;
    stream.write(`\nElapsed time: ${elapsedTime.toFixed(2)}ms\n`);
    process.exit(0);
  };

  process.on("SIGINT", signalHandler);

  const onItemComplete = () => {
    itemsProcessed++;
    bar.update(itemsProcessed);
  };

  await func(onItemComplete);

  const elapsedTime = performance.now() - startTime;
  bar.stop();

  stream.write(`Elapsed time: ${elapsedTime.toFixed(2)}ms\n`);
}
