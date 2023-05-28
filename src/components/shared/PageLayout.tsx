export function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full m-auto max-w-xl items-center justify-between text-sm">
      {children}
    </div>
  );
}
