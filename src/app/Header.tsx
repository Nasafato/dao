"use client";
import { MoonIcon, SunIcon } from "@heroicons/react/20/solid";
import Link from "next/link";

import { usePathname, useRouter } from "next/navigation";
import { ModeToggle } from "./ModeToggle";
import { twMerge } from "tailwind-merge";
import { SoftBorderStyle } from "../styles";

const links = [
  {
    name: "Home",
    href: "/",
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
  const isActive: (pathname: string) => boolean = (pathname) =>
    urlPath === pathname;

  let right = null;
  right = (
    <ul className="flex text-sm items-center font-sans">
      {links.map((link) => (
        <li
          key={link.href}
          className={twMerge(
            "border-r border-gray-300 pr-2 pl-2 hover:underline last-of-type:border-r-0",
            isActive(link.href) && "underline"
          )}
        >
          <Link href={link.href}>{link.name}</Link>
        </li>
      ))}
    </ul>
  );

  return (
    <nav
      className={twMerge(
        "h-12 px-5 lg:px-24 py-2 fixed top-0 w-full bg-white dark:bg-gray-950 z-20 border-b",
        SoftBorderStyle
      )}
    >
      <div className="m-auto max-w-xl font-mono text-sm h-full flex items-center">
        <div className="flex justify-between items-center flex-1">
          <ModeToggle />
          {right}
        </div>
      </div>
    </nav>
  );
}
