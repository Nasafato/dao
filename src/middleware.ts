import { NextRequest, NextResponse } from "next/server";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

let locales = ["en-US", "zh", "nl"];
let defaultLocale = "en-US";

// Get the preferred locale, similar to above or using a library
function getLocale(request: NextRequest) {
  let languages = new Negotiator({
    headers: Object.fromEntries(new Map(request.headers).entries()),
  }).languages();
  const locale = match(languages, locales, defaultLocale); // -> 'en-US'
  return locale;
}

export function middleware(request: NextRequest) {
  const localeCookie = request.cookies.get("NEXT_LOCALE");
  const locale = localeCookie?.value ?? getLocale(request);
  if (request.nextUrl.pathname === "/" || request.nextUrl.pathname === "") {
    const url = new URL(`/${locale}/verses/chinese`, request.url);
    return NextResponse.redirect(url);
  }

  const pathname = request.nextUrl.pathname;
  const pathnameIsMissingLocale = locales.every(
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
    "/((?!_next|.*.json|.*\\..*).*)",
    // Optional: only run on root (/) URL
    // '/'
  ],
};
