import type { Metadata } from "next";

const APP_NAME = "Daodejing";
const APP_DEFAULT_TITLE = "Daodejing";
const APP_TITLE_TEMPLATE = "%s - Daodejing";
const APP_DESCRIPTION = "Study the Daodejing, with a dictionary and more.";

export const SHARED_METADATA: Metadata = {
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
  },
  metadataBase: new URL("https://daodejing.app"),
  formatDetection: {
    telephone: false,
  },
  openGraph: {
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
