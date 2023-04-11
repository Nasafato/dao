import DAO_TEXT from "@/fixtures/dao.json";
import { Inter } from "next/font/google";
import { Verses } from "../components/Verses";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className="px-8 py-16 lg:px-24 lg:py-24">
      <div className="z-10 w-full m-auto max-w-xl items-center justify-between font-mono text-sm">
        <Verses
          verses={DAO_TEXT.map((verse, index) => {
            const id = index + 1;
            return {
              id,
              text: verse,
            };
          })}
        />
      </div>
    </main>
  );
}
