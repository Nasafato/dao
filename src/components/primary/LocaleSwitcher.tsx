"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { border, background, MenuStyle } from "@/styles";
import { Menu } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { twJoin } from "tailwind-merge";
import { useLocale } from "@/components/IntlProvider";
// import { i18n } from "../../../i18n-config";

const menuStyle = MenuStyle();

export function LocaleSwitcher() {
  const pathName = usePathname();
  const activeLocale = useLocale();
  const redirectedPathName = (locale: string) => {
    if (!pathName) return "/";
    const segments = pathName.split("/");
    segments[1] = locale;
    return segments.join("/");
  };

  return (
    <Menu as="div" className="relative">
      <Menu.Button className={menuStyle.button()}>
        <div className="flex items-center text gap-x-1">
          {activeLocale}
          <ChevronDownIcon className="h-4 w-4" />
        </div>
      </Menu.Button>
      <Menu.Items className={menuStyle.items()}>
        <ul>
          {["en-US", "zh"].map((locale) => {
            const isActive = activeLocale === locale;
            return (
              <Menu.Item
                key={locale}
                href={redirectedPathName(locale)}
                onClick={() => {
                  document.cookie = `NEXT_LOCALE=${locale}; path=/;`;
                  // document.cookie = "test1=Hello; SameSite=None; Secure";
                  console.log("setting cookie");
                }}
                as={Link}
                className={twJoin(
                  menuStyle.item(),
                  isActive && menuStyle.activeItem()
                )}
              >
                {locale}
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
              const locale = navigator.language;
              // Redirect to the same page with the new locale.
            }}
          >
            System
          </Menu.Item>
        </ul>
      </Menu.Items>
    </Menu>
  );
}
