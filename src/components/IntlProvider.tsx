"use client";
import { Dict } from "@/types";
import { getNestedValue } from "@/utils";
import { createContext, useContext } from "react";

export const IntlContext = createContext<IntlContextType>({
  locale: "en",
  dict: {},
});

export type IntlContextType = {
  locale: string;
  dict: Dict;
};

export function IntlContextProvider({
  children,
  locale,
  dict,
}: {
  children: React.ReactNode;
  locale: string;
  dict: Dict;
}) {
  return (
    <IntlContext.Provider value={{ dict, locale }}>
      {children}
    </IntlContext.Provider>
  );
}

export function useIntl(key?: string) {
  const ctx = useContext(IntlContext);
  const { dict } = ctx;
  if (!key) {
    return dict;
  }

  const value = getNestedValue(dict, key);

  return value;
}

export function useTranslation() {
  const ctx = useContext(IntlContext);
  const t = (key: string) => {
    const { dict } = ctx;
    const value = getNestedValue(dict, key);
    return (value as string) ?? "";
  };

  return { t };
}

export function wrapIntl(key: string) {
  const IntlText = () => {
    const name = useIntl(key);
    return <>{name}</>;
  };
  return <IntlText />;
}

export function useLocale() {
  const ctx = useContext(IntlContext);
  const { locale } = ctx;
  return locale;
}
