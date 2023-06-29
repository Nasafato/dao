import { createInterface } from "readline";
import CliProgress from "cli-progress";
import fs from "fs";
import path from "path";
import stream from "stream";

type Ctx = {
  inputFile: string | null;
  inputFilePath: string | null;
  inputStream: stream.Readable;
  outputFile: string | null;
  outputFilePath: string | null;
};
export async function withStdinStdout(
  func: (
    ctx: Ctx,
    args: stream.Readable
  ) => Promise<string | AsyncIterable<any> | stream.Readable | null | void>
) {
  const inputFile = process.argv[2] || null;
  const outputFile = inputFile ? process.argv[3] || process.argv[2] : null;

  const inputFilePath = inputFile ? path.join(__dirname, inputFile) : null;
  const outputFilePath = outputFile ? path.join(__dirname, outputFile) : null;
  let inputStream: stream.Readable;
  if (inputFilePath) {
    inputStream = fs.createReadStream(inputFilePath);
  } else {
    inputStream = process.stdin;
  }

  const ctx = {
    inputFile,
    inputFilePath,
    inputStream,
    outputFile,
    outputFilePath,
  };
  let result = await func(ctx, inputStream);
  if (!result) {
    return;
  }

  const outputStream: stream.Writable = outputFilePath
    ? fs.createWriteStream(outputFilePath)
    : process.stdout;
  if (typeof result === "string") {
    outputStream.write(result);
  } else {
    for await (const item of result) {
      outputStream.write(item);
    }
  }
  if (outputStream !== process.stdout) {
    outputStream.end();
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

export async function* stringToIterable(s: string) {
  const chunkSize = 50;
  for (let i = 0; i < s.length; i += chunkSize) {
    yield s.slice(i, i + chunkSize);
  }
}

// export async function* chunkReadableStream(
//   stream: NodeJS.ReadableStream,
//   chunkSize: number
// ) {
//   let chunk = Buffer.alloc(0);
//   for await (const data of stream) {
//     chunk += data;
//     if (chunk.length >= chunkSize) {
//       yield chunk;
//       chunk = "";
//     }
//   }
//   yield chunk;
// }
