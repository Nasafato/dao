"use client";
import Link from "next/link";
import { Container } from "../../components/shared/PageLayout";
import { button } from "../../styles";
import { usePathname } from "next/navigation";
import { Translators } from "../../../types/materials";
import { capitalize } from "../../utils";

export default function VersesEnglishLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <Container>
      <div>
        <label>Translation</label>
        <div className="flex items-center gap-x-2">
          {Translators.map((t) => (
            <Link key={t} href={`/english/${t}`} className={`${button()}`}>
              <span>{capitalize(t)}</span>
            </Link>
          ))}
        </div>
      </div>
      {children}
    </Container>
  );
}
