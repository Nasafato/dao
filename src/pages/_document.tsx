import { Html, Head, Main, NextScript } from "next/document";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <div id="popover-portal"></div>
        <NextScript />
      </body>
    </Html>
  );
}
