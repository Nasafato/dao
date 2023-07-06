import { Header } from "@/app/Header";
import { Providers } from "@/app/Providers";
import { Setup } from "@/app/Setup";
import { Footer } from "@/components/primary/Footer";
import { Popover } from "@/components/primary/VersesPopover";
import { MainLayoutHorizontalPaddingStyle } from "@/styles";
import "@/styles/globals.css";
import { twJoin } from "tailwind-merge";

export default function LocaleRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
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
  );
}

// const APP_NAME = "Daodejing";
// const APP_DEFAULT_TITLE = "Daodejing";
// const APP_TITLE_TEMPLATE = "%s - Daodejing";
// const APP_DESCRIPTION = "Study the Daodejing, with a dictionary and more.";

// export const metadata: Metadata = {
//   applicationName: APP_NAME,
//   title: {
//     default: APP_DEFAULT_TITLE,
//     template: APP_TITLE_TEMPLATE,
//   },
//   description: APP_DESCRIPTION,
//   manifest: "/manifest.json",
//   themeColor: "#FFFFFF",
//   appleWebApp: {
//     capable: true,
//     statusBarStyle: "default",
//     title: APP_DEFAULT_TITLE,
//     // startUpImage: [],
//   },
//   metadataBase: new URL("https://daodejing.app"),
//   formatDetection: {
//     telephone: false,
//   },
//   openGraph: {
//     type: "website",
//     siteName: APP_NAME,
//     title: {
//       default: APP_DEFAULT_TITLE,
//       template: APP_TITLE_TEMPLATE,
//     },
//     url: "https://daodejing.app",
//     description: APP_DESCRIPTION,
//   },
//   twitter: {
//     card: "summary",
//     title: {
//       default: APP_DEFAULT_TITLE,
//       template: APP_TITLE_TEMPLATE,
//     },
//     creator: "@9981apollo",
//     description: APP_DESCRIPTION,
//   },
// };
