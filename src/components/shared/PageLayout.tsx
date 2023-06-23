import { twJoin } from "tailwind-merge";

export function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) {
  return (
    <div
      className={twJoin(
        "w-full m-auto max-w-xl items-center justify-between text-sm",
        className
      )}
    >
      {children}
    </div>
  );
}
