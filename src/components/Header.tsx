"use client";
import NextLink from "next/link";
import { ThemeToggle } from "./ThemeToggle";

import { useIntl, useLocale, wrapIntl } from "@/components/IntlProvider";
import { HeaderHeight, border } from "@/styles";
import { getNestedValue } from "@/utils";
import { usePathname } from "next/navigation";
import { twJoin, twMerge } from "tailwind-merge";
import { MenuLink } from "@/components/primary/MenuLink";
import { Link, LinkWithChildren } from "@/types";
import { LocaleSwitcher } from "@/components/primary/LocaleSwitcher";

const links: Link[] = [
  {
    key: "Header.Verses.base",
    name: <VersesLinkName />,
    href: "/",
    children: [
      {
        key: "Header.Verses.chinese",
        name: wrapIntl("Header.Verses.chinese"),
        href: "/verses/chinese",
      },
      {
        key: "Header.Verses.english",
        name: wrapIntl("Header.Verses.english"),
        href: "/verses/english/gou",
      },
    ],
  },
  {
    key: "Header.About",
    name: wrapIntl("Header.About"),
    href: "/about",
  },
  {
    key: "Header.Dictionary",
    name: wrapIntl("Header.Dictionary"),
    href: "/dictionary",
  },
];

export function Header() {
  let right = null;
  right = (
    <>
      <ul className="flex text-sm items-center font-sans">
        {links.map((link) => (
          <LinkWithChildren link={link} key={link.href} />
        ))}
      </ul>
      {/* <LocaleSwitcher /> */}
    </>
  );

  return (
    <nav
      className={twMerge(
        HeaderHeight,
        "px-5 lg:px-24 py-2 fixed top-0 w-full bg-white dark:bg-gray-950 z-20 border-b",
        border()
        // SoftBorderStyle
      )}
    >
      <div className="m-auto max-w-xl text-sm h-full flex items-center">
        <div className="flex justify-between items-center flex-1">
          <ThemeToggle />
          {right}
        </div>
      </div>
    </nav>
  );
}

function VersesLinkName() {
  const dict = useIntl();
  const path = usePathname();
  let name;
  const baseName = getNestedValue(dict, "Header.Verses.base");
  const chineseName = getNestedValue(dict, "Header.Verses.chinese");
  const englishName = getNestedValue(dict, "Header.Verses.english");
  if (!path) {
    name = baseName;
  } else if (path === "/") {
    name = chineseName;
  } else if (path.includes("/verses/chinese")) {
    name = chineseName;
  } else if (path.includes("/verses/english")) {
    name = englishName;
  } else {
    name = baseName;
  }

  return <>{name as string}</>;
}

function LinkWithChildren({
  link,
  className,
}: {
  link: Link;
  className?: string;
}) {
  const locale = useLocale();
  const pathname = usePathname();
  let content;
  if (!link.children) {
    content = (
      <NextLink
        href={`/${locale}/${link.href}`}
        className={twJoin(
          pathname?.includes(link.href) ? "underline" : "",
          className
        )}
      >
        {link.name}
      </NextLink>
    );
  } else {
    content = <MenuLink link={link as LinkWithChildren} />;
  }
  return (
    <li
      key={link.href}
      className={twMerge("pr-2 pl-2 hover:underline flex items-center")}
    >
      {content}
    </li>
  );
}
