export function OgLayout({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      tw="flex flex-col w-full h-full items-center justify-center bg-white"
      style={style}
    >
      <div tw="bg-black flex rounded-sm text-xl">
        <div tw="bg-white bottom-4 left-4 border-4 border-black rounded-sm px-8 py-4 text-[64px]">
          Daodejing.app
        </div>
      </div>
      <div tw="mt-[32px] flex">{children}</div>
    </div>
  );
}

export function font(fontFamily: string) {
  return { fontFamily };
}

export const VerseStyle = "text-[48px] text-gray-900";
export const TranslationStyle = "text-[28px] text-gray-900";
