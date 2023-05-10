import { useEffect, useState } from "react";

export function useTheme() {
  const [theme, setTheme] = useState<string>("light");

  useEffect(() => {
    const handleStorageChange = () => {
      setTheme(localStorage.getItem("theme") ?? "light");
    };
    setTheme(localStorage.getItem("theme") ?? "light");

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    // On page load or when changing themes, best to add inline in `head` to avoid FOUC
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return {
    toggleTheme: () => {
      console.log("toggleTheme");
      const currentTheme = localStorage.theme;
      const newTheme = currentTheme === "dark" ? "light" : "dark";
      localStorage.theme = newTheme;
      setTheme(newTheme);
      if (newTheme === "dark") {
        document.documentElement.classList.add("dark");
        console.log(document.documentElement.classList);
      } else {
        document.documentElement.classList.remove("dark");
        console.log(document.documentElement.classList);
      }
    },
    theme,
  };
}
