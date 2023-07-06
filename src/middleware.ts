import { NextRequest, NextResponse } from "next/server";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

let headers = { "accept-language": "en-US,en;q=0.5" };
let languages = new Negotiator({ headers }).languages();
let locales = ["en-US", "nl-NL", "nl"];
let defaultLocale = "en-US";

match(languages, locales, defaultLocale); // -> 'en-US'

// Get the preferred locale, similar to above or using a library
function getLocale(request: NextRequest) {
  let languages = new Negotiator({ headers }).languages();
  let locales = ["en-US", "nl-NL", "nl"];
  let defaultLocale = "en-US";
  const locale = match(languages, locales, defaultLocale); // -> 'en-US'
  return locale;
}

const whitelist = ["_next", ".png", "manifest.json", "api"];

export function middleware(request: NextRequest) {
  // Check if there is any supported locale in the pathname
  if (whitelist.some((name) => request.nextUrl.pathname.includes(name))) {
    return NextResponse.next();
  }
  if (request.nextUrl.pathname === "/" || request.nextUrl.pathname === "") {
    const locale = getLocale(request);
    const url = new URL(`/${locale}/verses/chinese`, request.url);
    return NextResponse.redirect(url);
  }

  const pathname = request.nextUrl.pathname;
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);

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
    "/((?!_next).*)",
    // Optional: only run on root (/) URL
    // '/'
  ],
};
