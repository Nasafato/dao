export function OgLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      tw="flex p-20 h-full w-full bg-white flex-col"
      style={font("Inter 300")}
    >
      <header tw="flex text-[36px] w-full items-center">
        <div tw="font-bold flex items-center" style={font("Inter 600")}>
          <span tw="mr-2">DAODEJING </span>
          <span tw="text-[60px]" style={font("Noto Sans SC 400")}>
            道德经
          </span>
        </div>
        <div tw="grow" />
        <div tw="text-[28px]">daodejing.app</div>
      </header>

      <main tw="flex mt-10 flex-col w-full" style={font("Noto Sans SC 400")}>
        {children}
      </main>
    </div>
  );
}

export function font(fontFamily: string) {
  return { fontFamily };
}

export const VerseStyle = "text-[48px] text-gray-900";
export const TranslationStyle = "text-[28px] text-gray-900";
