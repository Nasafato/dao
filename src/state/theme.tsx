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
