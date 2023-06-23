import { Metadata } from "next";
import Script from "next/script";
import { Header } from "./Header";
import { Setup } from "./Setup";
import "@/styles/globals.css";
import { Footer } from "../components/primary/Footer";
import { Providers } from "./Providers";
import { Popover } from "../components/primary/VersesPopover";
import { twJoin } from "tailwind-merge";
import { MainLayoutHorizontalPaddingStyle } from "../styles";
import { modeToggleEffect } from "./modeToggleEffect";
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
            __html: `(${modeToggleEffect.toString()})()`,
          }}
        />
      </head>
      <body className="bg-white text-gray-800 dark:bg-gray-950 dark:text-gray-100">
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
  title: "Home",
  description: "Welcome to the Daoedejing",
};
