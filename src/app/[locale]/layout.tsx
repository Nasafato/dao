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
import { Metadata } from "next";
import { SHARED_METADATA } from "@/app/sharedMetadata";

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

export const metadata: Metadata = {
  ...SHARED_METADATA,
};
