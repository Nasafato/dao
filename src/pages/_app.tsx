import "@/styles/globals.css";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { api } from "../utils/trpc";
import { useEffect } from "react";
import { initializeDb } from "../lib/localDb/db";
import { Header } from "../components/primary/Header";

function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    initializeDb();
  }, []);
  return (
    <>
      <Header />
      <main className="px-5 pb-16 lg:px-24 lg:pb-24 pt-4 lg:pt-8 mt-12">
        <Component {...pageProps} />
      </main>
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  );
}

export default api.withTRPC(App);
