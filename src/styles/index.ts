import { tv } from "tailwind-variants";

/** The text that shows up in the top-right of each verse. */
export const SecondaryDarkModeTextStyle =
  "text-gray-500 group-hover:text-gray-400 hover:text-gray-400 dark:text-gray-300 dark:group-hover:text-gray-400 dark:hover:text-gray-400";
/** Icon size and styling. */
export const SecondaryButtonStyle = `h-4 w-4 ${SecondaryDarkModeTextStyle}`;
export const SecondaryButtonPadding = "p-1";

export const SoftBorderStyle = "border-gray-200/10 dark:border-gray-200/10";
export const BorderStyle = "border-gray-500 dark:border-gray-200/10";
export const TextStyle = "text-gray-900 dark:text-gray-100";

export const BackgroundStyle = "bg-white dark:bg-gray-950";

export const LayoutPaddingStyle = "px-5 lg:px-24 py-2";
export const MainLayoutHorizontalPaddingStyle = "px-5 lg:px-24";

export const IconButtonColor =
  "text-gray-500 dark:text-gray-300 hover:bg-gray-200 hover:dark:bg-gray-700";
export const HeaderHeight = "h-12";
export const FooterHeight = "h-14";

export const button = tv({
  base: `
    text-gray-900 hover:text-gray-700
    dark:text-gray-500 dark:hover:text-gray-400
  `,
  variants: {
    color: {
      primary: "",
      secondary: "",
    },
    size: {
      sm: "h-4 w-4",
    },
  },
});
