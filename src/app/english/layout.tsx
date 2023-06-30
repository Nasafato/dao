"use client";
import Link from "next/link";
import { Container } from "../../components/shared/PageLayout";
import { HeadingStyle, ButtonStyle } from "../../styles";
import { usePathname } from "next/navigation";
import { Translators } from "../../../types/materials";
import { capitalize } from "../../utils";
import { twJoin } from "tailwind-merge";

export default function VersesEnglishLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <Container>
      <nav className="mb-8">
        <h3 className={twJoin(HeadingStyle(), "mb-1")}>Translation</h3>
        <div className="flex items-center gap-x-2">
          {Translators.map((t) => {
            const isActive = pathname?.includes(t) ?? false;
            return (
              <Link
                key={t}
                href={`/english/${t}`}
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
    </Container>
  );
}
