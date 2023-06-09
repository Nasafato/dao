import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import { Footer } from "../components/primary/Footer";
import { Header } from "../components/primary/Header";
import { PopoverProvider } from "../components/primary/PopoverProvider";
import { Popover } from "../components/primary/VersesPopover";
import { initializeDb } from "../lib/localDb/db";
import { api } from "../utils/trpc";

function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    initializeDb();
  }, []);
  return (
    <PopoverProvider>
      <Header />
      <main className="px-5 pb-16 lg:px-24 lg:pb-24 pt-4 lg:pt-8 mt-12">
        <Component {...pageProps} />
      </main>
      <Footer />
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      <Popover />
    </PopoverProvider>
  );
}

export default api.withTRPC(App);
