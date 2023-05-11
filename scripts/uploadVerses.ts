import fs from "fs";
import path from "path";
import readline from "readline";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const fileStream = fs.createReadStream(
    path.join(__dirname, "../materials/dao.txt")
  );

  let i = 1;
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    // Each line in the input.txt file will be successively available here as `line`.
    await prisma.verse.create({
      data: {
        id: i++,
        text: line,
      },
    });
  }
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
