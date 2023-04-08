import Image from "next/image";
import { Inter } from "next/font/google";
import DAO_TEXT from "@/fixtures/dao.json";
import { Verses } from "../components/Verses";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <Verses
          verses={DAO_TEXT.map((verse, index) => {
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
