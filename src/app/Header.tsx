"use client";
// import { Listbox } from "@headlessui/react";
import { Menu } from "@headlessui/react";
import { ThemeToggle } from "./ThemeToggle";
import Link from "next/link";

import { twJoin, twMerge } from "tailwind-merge";
import {
  BorderStyle,
  HeaderHeight,
  SoftBorderStyle,
  background,
  border,
  ButtonStyle,
} from "../styles";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import { usePathname } from "next/navigation";

type Link = {
  name: string | ((path: string | null) => string);
  href: string;
  children?: Link[];
};

const links: Link[] = [
  {
    name: (path: string | null) => {
      if (!path) {
        return "Verses";
      }

      if (path === "/") {
        return "Chinese";
      }
      if (path.includes("/chinese")) {
        return "Chinese";
      }
      if (path.includes("/english")) {
        return "English";
      }
      return "Verses";
    },
    href: "/",
    children: [
      {
        name: "Chinese",
        href: "/chinese",
      },
      {
        name: "English",
        href: "/english/gou",
      },
    ],
  },
  {
    name: "About",
    href: "/about",
  },
  {
    name: "Dictionary",
    href: "/dictionary",
  },
];

export function Header() {
  const urlPath = usePathname();
  // const isActive: (pathname: string) => boolean = (pathname) =>
  //   urlPath === pathname;

  let right = null;
  right = (
    <ul className="flex text-sm items-center font-sans">
      {links.map((link) => (
        <LinkWithChildren link={link} key={link.href} />
      ))}
    </ul>
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
      <div className="m-auto max-w-xl font-mono text-sm h-full flex items-center">
        <div className="flex justify-between items-center flex-1">
          <ThemeToggle />
          {right}
        </div>
      </div>
    </nav>
  );
}

function LinkWithChildren({
  link,
  className,
}: {
  link: Link;
  className?: string;
}) {
  const pathname = usePathname();
  const name =
    typeof link.name === "function" ? link.name(pathname) : link.name;

  let content;
  if (!link.children) {
    content = (
      <Link
        href={link.href}
        className={twJoin(
          pathname?.includes(link.href) ? "underline" : "",
          className
        )}
      >
        {name}
      </Link>
    );
  } else {
    content = (
      <Menu as="div" className="relative">
        <Menu.Button className="hover:underline">
          <div className="flex items-center text gap-x-1">
            {name}
            <ChevronDownIcon className="h-4 w-4" />
          </div>
        </Menu.Button>
        <Menu.Items
          className={twJoin(
            "absolute top-6 right-0 border w-32",
            border(),
            background()
          )}
        >
          <ul>
            {link.children.map((c) => {
              const isActive = pathname?.includes(c.href);
              return (
                <Menu.Item
                  key={c.href}
                  href={c.href}
                  as={Link}
                  className={twJoin(
                    "block px-3 py-2 hover:underline",
                    isActive && "bg-gray-200 dark:bg-gray-800"
                  )}
                >
                  <LinkName name={c.name} />
                </Menu.Item>
              );
            })}
          </ul>
        </Menu.Items>
      </Menu>
    );
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

function LinkName({ name }: { name: string | ((path: string) => string) }) {
  const pathname = usePathname();
  const linkName = typeof name === "function" ? name(pathname ?? "") : name;
  return <>{linkName}</>;
}
