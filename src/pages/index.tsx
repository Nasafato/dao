import Image from "next/image";
import { Inter } from "next/font/google";
import { promises as fs } from "fs";
import DAO_TEXT from "@/fixtures/dao.json";
import { Verses } from "../components/Verses";

const inter = Inter({ subsets: ["latin"] });

export default function Home({ recordings }: { recordings: string[] }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <Verses
          verses={DAO_TEXT.map((verse, index) => {
            for (const file of recordings) {
              if (file.includes(`verse${index + 1}`)) {
                return {
                  id: index + 1,
                  text: verse,
                  audio: file,
                };
              }
            }
            return {
              id: index + 1,
              text: verse,
            };
          })}
        />
      </div>
    </main>
  );
}

export async function getStaticProps() {
  const files = await fs.readdir(`${process.cwd()}/public/audio`);
  for (const file of files) {
    console.log(file);
  }

  return { props: { recordings: files } };
}
