import { useTheme } from "../state/theme";

export function Navbar() {
  const { toggleTheme, theme } = useTheme();
  return (
    <nav className="px-8 lg:px-24 py-8">
      <div className="m-auto max-w-xl items-center justify-between font-mono text-sm border-b border-gray-200">
        <button
          onClick={() => toggleTheme()}
          className="hover:text-gray-600 dark:hover:text-gray-300"
        >
          {theme === "light" ? "Light" : "Dark"}
        </button>
      </div>
    </nav>
  );
}
