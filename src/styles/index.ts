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
export const BottomSpacing = "bottom-14";
export const verticalSpacing = tv({
  base: `bottom-14`,
  variants: {
    orientation: {
      bottom: "bottom-14 top-auto",
      top: "top-14 bottom-auto",
    },
  },
});

export const background = tv({
  base: `
    bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100
  `,
  variants: {
    color: {
      default: "bg-white dark:bg-gray-950",
      invert: `
        bg-gray-950 dark:bg-white
        dark:text-gray-900 text-gray-100
      `,
    },
  },
  defaultVariants: {
    color: "default",
  },
});

export const button = tv({
  base: `
    justify-center flex items-center
    rounded-sm
  `,
  variants: {
    color: {
      primary:
        "text-gray-900 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-400",
      secondary: `
        text-gray-400 hover:text-gray-500 iv:dark:text-gray-400 iv:dark:hover:text-gray-500
        dark:hover:text-gray-200 iv:text-gray-200 iv:hover:text-gray-500
      `,
      icon: `
        text-gray-900 hover:text-gray-900
        dark:text-gray-500 dark:hover:text-gray-500
        hover:bg-gray-200 hover:dark:bg-gray-700
      `,
    },
    ring: {
      true: `
        ring-1
        ring-gray-200 dark:ring-gray-200 
        hover:ring-gray-500 hover:dark-ring-gray-500
      `,
    },
    rounded: {
      none: "rounded-none",
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
      full: "rounded-full",
    },
    size: {
      sm: "h-4 w-4",
      md: "h-5 w-5",
      lg: "h-6 w-6",
    },
  },
  defaultVariants: {
    color: "primary",
    size: "md",
    rounded: "none",
  },
});

export const border = tv({
  base: `border-gray-950 dark:border-gray-200/50`,
});
