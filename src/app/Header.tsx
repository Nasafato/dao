"use client";
import { ThemeToggle } from "./ThemeToggle";
import Link from "next/link";

import { twJoin, twMerge } from "tailwind-merge";
import {
  BorderStyle,
  HeaderHeight,
  SoftBorderStyle,
  background,
  border,
  button,
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
        href: "/verses/chinese",
      },
      {
        name: "English",
        href: "/verses/english",
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
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const name =
    typeof link.name === "function" ? link.name(pathname) : link.name;

  let content;
  if (!link.children) {
    content = (
      <Link href={link.href} className={className}>
        {name}
      </Link>
    );
  } else {
    content = (
      <>
        <Link href={link.href}>{name}</Link>
        <button
          className={`relative ${button({
            color: "secondary",
            size: "md",
          })}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <ChevronDownIcon className="h-4 w-4" />
          {isOpen && (
            <Menu className="absolute top-6 right-0">
              {link.children.map((child) => (
                <LinkWithChildren
                  link={child}
                  key={child.href}
                  className="pr-3 py-2"
                />
              ))}
            </Menu>
          )}
        </button>
      </>
    );
  }
  return (
    <li
      key={link.href}
      className={twMerge(
        "pr-2 pl-2 hover:underline flex items-center"
        // isActive(link.href) && "underline"
      )}
    >
      {content}
    </li>
  );
}

function Menu({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={twJoin("px-1 py-1 border", border(), background(), className)}
    >
      {children}
    </div>
  );
}
