import { themeEffect } from "@/app/theme-effect";
import "@/styles/globals.css";
import { Analytics } from "@vercel/analytics/react";
import { Metadata } from "next";

export default function LocaleRootLayout({
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
        {children}
        <div id="popover-portal"></div>
        <div id="command-palette-portal"></div>
        <Analytics />
      </body>
    </html>
  );
}

const APP_NAME = "Daodejing";
const APP_DEFAULT_TITLE = "Daodejing";
const APP_TITLE_TEMPLATE = "%s - Daodejing";
const APP_DESCRIPTION = "Study the Daodejing, with a dictionary and more.";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  themeColor: "#FFFFFF",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  metadataBase: new URL("https://daodejing.app"),
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    images: "https://daodejing.b-cdn.net/og-image.png",
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    url: "https://daodejing.app",
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    creator: "@9981apollo",
    description: APP_DESCRIPTION,
  },
};
