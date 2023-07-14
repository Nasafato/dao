import { SHARED_METADATA } from "@/app/sharedMetadata";
import { themeEffect } from "@/app/theme-effect";
import "@/styles/globals.css";
import { Analytics } from "@vercel/analytics/react";
import { Metadata, ResolvingMetadata } from "next";

export default function LocaleRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-p-16">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(${themeEffect.toString()})()`,
          }}
        />
      </head>

      <body>
        {children}
        <div id="popover-portal"></div>
        <div id="command-palette-portal"></div>
        <Analytics />
      </body>
    </html>
  );
}

export async function generateMetadata(
  { params, ...rest }: { params: { locale: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  console.log(params, rest);
  console.log("locale", params.locale);

  return {
    ...SHARED_METADATA,
  };
}
