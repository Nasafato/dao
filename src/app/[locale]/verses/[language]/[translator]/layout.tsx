import { ButtonStyle, HeadingStyle } from "@/styles";
import { capitalize } from "@/utils";
import Link from "next/link";
import { twJoin } from "tailwind-merge";
import { Translators } from "types/materials";

export default function TranslatorLayout({
  children,
  params,
}: {
  children: any;
  params: {
    locale: string;
    language: string;
    translator: string;
  };
}) {
  return (
    <div>
      <nav className="mb-8">
        <h3 className={twJoin(HeadingStyle(), "mb-1")}>Translation</h3>
        <div className="flex items-center gap-x-2">
          {Translators.map((t) => {
            // const isActive = pathname?.includes(t) ?? false;
            const isActive = params.translator === t;
            return (
              <Link
                key={t}
                href={`/verses/english/${t}`}
                className={` ${ButtonStyle()} py-1 px-2 hover:bg-gray-200 dark:hover:bg-gray-800 ${
                  isActive ? "bg-gray-200 dark:bg-gray-800" : ""
                } `}
              >
                <span>{capitalize(t)}</span>
              </Link>
            );
          })}
        </div>
      </nav>
      {children}
    </div>
  );
}
