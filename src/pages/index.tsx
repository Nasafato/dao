import Image from "next/image";
import { Inter } from "next/font/google";
import { promises as fs } from "fs";
import DAO_TEXT from "@/fixtures/dao.json";
import { Verses } from "../components/Verses";

const inter = Inter({ subsets: ["latin"] });

export default function Home({ recordings }: { recordings: string[] }) {
  return (
    <main className="px-8 py-16 lg:px-24 lg:py-24">
      <div className="z-10 w-full m-auto max-w-xl items-center justify-between font-mono text-sm">
        <Verses
          verses={DAO_TEXT.map((verse, index) => {
            const id = index + 1;
            const audio = recordings.find((file) =>
              file.includes(`dao${index < 10 ? "0" + id : id}`)
            );
            return {
              id,
              text: verse,
              audio,
              // audio: id === 1 ? audio : undefined,
            };
          })}
        />
      </div>
    </main>
  );
}

export async function getStaticProps() {
  const files = await fs.readdir(`${process.cwd()}/public/audio`);
  return { props: { recordings: files } };
}
