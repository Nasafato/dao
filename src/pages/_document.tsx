import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <div id="popover-portal"></div>
        <div id="command-palette-portal"></div>
        <NextScript />
      </body>
    </Html>
  );
}
