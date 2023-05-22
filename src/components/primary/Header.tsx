import { MoonIcon, SunIcon } from "@heroicons/react/20/solid";
import { useTheme } from "../../state/theme";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";

export function Header() {
  // const { data: session, status } = useSession();
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;

  let right = null;
  // if (session) {
  //   right = (
  //     <div className="flex items-center gap-x-2 text-xs">
  //       <div className="rounded-full py-2 px-3 ring-1 ring-gray-950/5">
  //         {session.user?.name ?? "No name"}
  //       </div>
  //       <button
  //         onClick={() => signOut()}
  //         className="px-2 py1 text-center hover:text-gray-500"
  //       >
  //         Sign out
  //       </button>
  //     </div>
  //   );
  // } else if (status === "loading") {
  //   right = <div className="text-xs flex items-center">Loading...</div>;
  // } else {
  //   right = (
  //     <div className="text-xs flex items-center">
  //       <Link href="/api/auth/signin" data-active={isActive("/signup")}>
  //         Log in
  //       </Link>
  //     </div>
  //   );
  // }

  return (
    <nav className="h-12 px-8 lg:px-24 py-2 fixed top-0 w-full bg-white dark:bg-gray-950 z-10 border-b border-gray-200/10">
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
