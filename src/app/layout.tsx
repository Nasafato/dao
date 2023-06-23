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
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-p-16">
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
      <Script
        id="modeScript"
        dangerouslySetInnerHTML={{
          __html: modeScript,
        }}
      />
    </html>
  );
}

export const metadata: Metadata = {
  title: "Home",
  description: "Welcome to the Daoedejing",
};

const modeScript = `
  let darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

  updateMode()
  darkModeMediaQuery.addEventListener('change', updateModeWithoutTransitions)
  window.addEventListener('storage', updateModeWithoutTransitions)

  function updateMode() {
    let isSystemDarkMode = darkModeMediaQuery.matches
    let isDarkMode = window.localStorage.isDarkMode === 'true' || (!('isDarkMode' in window.localStorage) && isSystemDarkMode)

    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

    if (isDarkMode === isSystemDarkMode) {
      delete window.localStorage.isDarkMode
    }
  }

  function disableTransitionsTemporarily() {
    document.documentElement.classList.add('[&_*]:!transition-none')
    window.setTimeout(() => {
      document.documentElement.classList.remove('[&_*]:!transition-none')
    }, 0)
  }

  function updateModeWithoutTransitions() {
    disableTransitionsTemporarily()
    updateMode()
  }
`;
