"use client";

import { useLocale, useTranslation } from "@/components/IntlProvider";
import { i18n } from "@/i18nConfig";
import { MenuStyle } from "@/styles";
import { Menu } from "@headlessui/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { twJoin } from "tailwind-merge";

const menuStyle = MenuStyle();

const Globe = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
    />
  </svg>
);

const LOCALE_MAP = {
  en: "English",
  zh: "中文",
} as const;

export function LocaleSwitcher() {
  const pathName = usePathname();
  const router = useRouter();
  const { t } = useTranslation();
  const activeLocale = useLocale();
  const redirectedPathName = (locale: string) => {
    if (!pathName) return "/";
    const segments = pathName.split("/");
    segments[1] = locale;
    return segments.join("/");
  };

  return (
    <Menu as="div" className="relative flex items-center ml-2">
      <Menu.Button className={`${menuStyle.button()}`}>
        <div className="flex items-center">
          <Globe className="h-4 w-4 text-gray-900 hover:text-gray-600 dark:hover:text-white dark:text-gray-200 rounded-full mr-0.5" />
        </div>
      </Menu.Button>
      <Menu.Items className={menuStyle.items()}>
        <ul>
          {i18n.locales.map((locale) => {
            const isActive = activeLocale === locale;
            return (
              <Menu.Item
                key={locale}
                href={redirectedPathName(locale)}
                onClick={() => {
                  document.cookie = `NEXT_LOCALE=${locale}; path=/;`;
                }}
                as={Link}
                className={twJoin(
                  menuStyle.item(),
                  isActive && menuStyle.activeItem()
                )}
              >
                {LOCALE_MAP[locale]}
              </Menu.Item>
            );
          })}
          <Menu.Item
            as="button"
            className={twJoin(menuStyle.item())}
            onClick={() => {
              // Clear the `LOCALE` cookie.
              document.cookie =
                "NEXT_LOCALE=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
              // Get locale from browser.
              let locale = navigator.language;
              let hasSetLocale = false;
              for (const supportedLocale of i18n.locales) {
                if (locale === supportedLocale) {
                  locale = supportedLocale;
                  hasSetLocale = true;
                  break;
                }
              }

              if (!hasSetLocale) {
                for (const supportedLocale of i18n.locales) {
                  if (locale.startsWith(supportedLocale)) {
                    locale = supportedLocale;
                    hasSetLocale = true;
                    break;
                  }
                }
              }

              if (!hasSetLocale) {
                locale = i18n.defaultLocale;
              }

              console.log("locale", locale);
              router.push(redirectedPathName(locale));
              // Redirect to the same page with the new locale.
            }}
          >
            {t("Header.LocaleSwitcher.system")}
          </Menu.Item>
        </ul>
      </Menu.Items>
    </Menu>
  );
}
