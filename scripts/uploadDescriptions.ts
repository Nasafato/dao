import fs from "fs";
import path from "path";
import readline from "readline";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const descriptions = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, "../materials/dao-descriptions.json"),
      "utf-8"
    )
  );

  const creates = [];
  for (let i = 0; i < 81; i++) {
    const verseId = i + 1;
    creates.push({
      verseId,
      text: descriptions[verseId],
    });
  }

  const result = await prisma.verseDescription.createMany({
    data: creates,
  });

  console.log("Created", result.count, "descriptions");
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
