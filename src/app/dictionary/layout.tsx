"use client";
import { Providers } from "../Providers";

export default function DictionaryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Providers>{children}</Providers>;
}
