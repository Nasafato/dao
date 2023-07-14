import { About } from "@/components/About";
import { Metadata } from "next";

export default function AboutPage() {
  return <About />;
}

export const metadata: Metadata = {
  title: "Daodejing",
  description: "Study the Daodejing, with a dictionary and more.",
  openGraph: {
    title: "Daodejing",
    description: "Study the Daodejing, with a dictionary and more.",
    url: "https://daodejing.app",
    siteName: "Daodejing",
  },
  twitter: {
    card: "summary_large_image",
    site: "@daodejingapp",
    creator: "@9981apollo",
  },
  themeColor: "transparent",
  metadataBase: new URL("https://daodejing.app"),
};
