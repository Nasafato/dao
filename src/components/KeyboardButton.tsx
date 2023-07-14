/** Looks like a keyboard button. */
export function KeyboardButton({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`
        border overflow-hidden w-6
        rounded-[5px]
        border-white  bg-white
        dark:border-black dark:bg-black
      `}
    >
      <div
        className={`
        rounded-[4px] flex items-center justify-center
        bg-black
        dark:bg-white
      `}
      >
        {children}
      </div>
      <div className="h-[3px] bg-white dark:bg-black"></div>
    </div>
  );
}
