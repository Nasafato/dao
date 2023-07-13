import { MoonIcon, SunIcon } from "@heroicons/react/20/solid";
import { useTheme } from "@/state/theme";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDaoStore } from "@/state/store";
import { twJoin } from "tailwind-merge";
import { BackgroundStyle, BorderStyle } from "@/styles";

const links = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Dictionary",
    href: "/dictionary",
  },
];

export function Header() {
  // const { data: session, status } = useSession();
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;

  const readerMode = useDaoStore((state) => state.readerMode);
  const setReaderMode = useDaoStore((state) => state.setReaderMode);
  const toggleReaderMode = () => {
    if (readerMode) {
      setReaderMode(false);
    } else {
      setReaderMode(true);
    }
  };

  let right = null;
  right = (
    <ul className="flex text-sm items-center font-sans">
      {links.map((link) => (
        <li
          key={link.href}
          className="first-of-type:border-r border-gray-300 pr-2 pl-2 hover:underline"
        >
          <Link href={link.href}>{link.name}</Link>
        </li>
      ))}
    </ul>
  );

  return (
    <nav
      className={twJoin(
        "h-12 px-5 lg:px-24 py-2 fixed top-0 w-full z-20 border-b",
        BackgroundStyle,
        BorderStyle
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

function ModeToggle() {
  function disableTransitionsTemporarily() {
    document.documentElement.classList.add("[&_*]:!transition-none");
    window.setTimeout(() => {
      document.documentElement.classList.remove("[&_*]:!transition-none");
    }, 0);
  }

  function toggleMode() {
    disableTransitionsTemporarily();

    let darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    let isSystemDarkMode = darkModeMediaQuery.matches;
    let isDarkMode = document.documentElement.classList.toggle("dark");

    if (isDarkMode === isSystemDarkMode) {
      delete window.localStorage.isDarkMode;
    } else {
      window.localStorage.isDarkMode = isDarkMode;
    }
  }

  return (
    <button
      type="button"
      aria-label="Toggle dark mode"
      className="group rounded-full bg-white/90 px-3 py-1 ring-1 ring-zinc-900/10 backdrop-blur transition dark:bg-zinc-950/90 dark:ring-zinc-200/10 dark:hover:ring-zinc-200/20"
      onClick={toggleMode}
    >
      <SunIcon className="h-5 w-5 fill-zinc-100 stroke-zinc-500 transition group-hover:fill-zinc-200 group-hover:stroke-zinc-700 dark:hidden [@media(prefers-color-scheme:dark)]:fill-green-50 [@media(prefers-color-scheme:dark)]:stroke-green-500 [@media(prefers-color-scheme:dark)]:group-hover:fill-green-50 [@media(prefers-color-scheme:dark)]:group-hover:stroke-green-600" />
      <MoonIcon className="hidden h-6 w-6 fill-zinc-700 stroke-zinc-500 transition dark:block [@media(prefers-color-scheme:dark)]:group-hover:stroke-zinc-400 [@media_not_(prefers-color-scheme:dark)]:fill-green-400/10 [@media_not_(prefers-color-scheme:dark)]:stroke-green-500" />
    </button>
  );
}
