import { MoonIcon, SunIcon } from "@heroicons/react/20/solid";
import { useTheme } from "../state/theme";

export function Navbar() {
  return (
    <nav className="px-8 lg:px-24 py-8">
      <div className="m-auto max-w-xl items-center justify-between font-mono text-sm border-b border-gray-200 pb-4">
        <ModeToggle />
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
      className="group rounded-full bg-white/90 px-4 py-2 ring-1 ring-zinc-900/10 backdrop-blur transition dark:bg-zinc-950/90 dark:ring-zinc-200/10 dark:hover:ring-zinc-200/20"
      onClick={toggleMode}
    >
      <SunIcon className="h-6 w-6 fill-zinc-100 stroke-zinc-500 transition group-hover:fill-zinc-200 group-hover:stroke-zinc-700 dark:hidden [@media(prefers-color-scheme:dark)]:fill-green-50 [@media(prefers-color-scheme:dark)]:stroke-green-500 [@media(prefers-color-scheme:dark)]:group-hover:fill-green-50 [@media(prefers-color-scheme:dark)]:group-hover:stroke-green-600" />
      <MoonIcon className="hidden h-6 w-6 fill-zinc-700 stroke-zinc-500 transition dark:block [@media(prefers-color-scheme:dark)]:group-hover:stroke-zinc-400 [@media_not_(prefers-color-scheme:dark)]:fill-green-400/10 [@media_not_(prefers-color-scheme:dark)]:stroke-green-500" />
    </button>
  );
}
