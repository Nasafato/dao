import { Head, Html, Main, NextScript } from "next/document";
import { Navbar } from "../components/Navbar";
import { useEffect } from "react";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-100">
        <Main />
        <div id="popover-portal"></div>
        <div id="command-palette-portal"></div>
        <NextScript />
      </body>
    </Html>
  );
}
