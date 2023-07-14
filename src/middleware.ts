import { NextRequest, NextResponse } from "next/server";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { Locale, i18n } from "@/i18nConfig";

// Get the preferred locale, similar to above or using a library
function getLocale(request: NextRequest) {
  let languages = new Negotiator({
    headers: Object.fromEntries(new Map(request.headers).entries()),
  }).languages();
  const locale = match(
    languages,
    i18n.locales as unknown as string[],
    i18n.defaultLocale
  ); // -> 'en-US'
  return locale;
}

export function middleware(request: NextRequest) {
  const localeCookie = request.cookies.get("NEXT_LOCALE");
  let locale;
  const cookieValue = (localeCookie?.value ?? "") as Locale;
  if (i18n.locales.includes(cookieValue)) {
    locale = localeCookie?.value;
  } else {
    locale = getLocale(request);
  }
  if (request.nextUrl.pathname === "/" || request.nextUrl.pathname === "") {
    const url = new URL(`/${locale}/verses/chinese`, request.url);
    return NextResponse.redirect(url);
  }

  const pathname = request.nextUrl.pathname;
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    // e.g. incoming request is /products
    // The new URL is now /en-US/products
    return NextResponse.redirect(
      new URL(`/${locale}/${pathname}`, request.url)
    );
  }
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    // "/((?!api|_next|.*..*).*)/",
    // "/((?!api|_next|.*\\..*).*|manifest.json)",
    "/((?!_next|.*.json|api|opengraph-image|.*\\..*).*)",
    // Optional: only run on root (/) URL
    // '/'
  ],
};
