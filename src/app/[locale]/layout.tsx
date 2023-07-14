import { Header } from "@/components/Header";
import { Providers } from "@/components/Providers";
import { Setup } from "@/components/Setup";
import { IntlContextProvider } from "@/components/IntlProvider";
import { Footer } from "@/components/primary/Footer";
import { Popover } from "@/components/primary/VersesPopover";
import { getDictionary } from "@/locales/getDictionary";
import { MainLayoutHorizontalPaddingStyle } from "@/styles";
import "@/styles/globals.css";
import { twJoin } from "tailwind-merge";
import { i18n } from "@/i18nConfig";

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ locale }));
}

export default async function LocaleRootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: {
    locale: string;
  };
}) {
  const dict = await getDictionary(locale);
  return (
    <IntlContextProvider locale={locale} dict={dict}>
      <Providers>
        <Header />
        <Setup />
        <main
          className={twJoin(
            MainLayoutHorizontalPaddingStyle,
            "pb-28 lg:pb-32 pt-4 lg:pt-8 mt-12"
          )}
        >
          {children}
        </main>
        <Footer />
        <Popover></Popover>
      </Providers>
    </IntlContextProvider>
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
