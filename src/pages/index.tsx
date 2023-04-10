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
            const id = index + 1;
            const audio = recordings.find((file) =>
              file.includes(`dao${index < 10 ? "0" + id : id}`)
            );
            return {
              id,
              text: verse,
              audio,
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
