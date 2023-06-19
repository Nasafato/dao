"use client";

import { useEffect } from "react";
import { initializeDb } from "../lib/localDb/db";
import { useCacheDictionary } from "../hooks";

let init = false;

export function Setup() {
  useEffect(() => {
    if (init) {
      return;
    }
    init = true;
    if (typeof window === "undefined") return;
    initializeDb();
  }, []);
  useCacheDictionary("verse");
  useCacheDictionary("description");
  return null;
}
