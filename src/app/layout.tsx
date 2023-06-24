import "@/styles/globals.css";
import { Metadata } from "next";
import { twJoin } from "tailwind-merge";
import { Footer } from "../components/primary/Footer";
import { Popover } from "../components/primary/VersesPopover";
import { MainLayoutHorizontalPaddingStyle } from "../styles";
import { Header } from "./Header";
import { Providers } from "./Providers";
import { Setup } from "./Setup";
import { themeEffect } from "./theme-effect";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-p-16">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(${themeEffect.toString()})()`,
          }}
        />
      </head>

      <body>
        <Providers>
          <Header />
          <Setup />
          <main
            className={twJoin(
              MainLayoutHorizontalPaddingStyle,
              "pb-16 lg:pb-24 pt-4 lg:pt-8 mt-12"
            )}
          >
            {children}
          </main>
          <Footer />
          <Popover></Popover>
        </Providers>
        <div id="popover-portal"></div>
        <div id="command-palette-portal"></div>
      </body>
    </html>
  );
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
    title: "Daodejing",
    images: [
      {
        url: "https://daodejing.app/opengraph-image",
      },
    ],
    description: "Study the Daodejing, with a dictionary and more.",
    card: "summary_large_image",
    site: "@daodejingapp",
    creator: "@9981apollo",
  },
  themeColor: "transparent",
  metadataBase: new URL("https://daodejing.app"),
};
