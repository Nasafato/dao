"use client";

import { useEffect } from "react";
import { initializeDb } from "../lib/localDb/db";
import { useCacheDictionary } from "../hooks";
import { initializeKeyValueStore } from "../lib/keyValueStore";

let init = false;

export function Setup() {
  useEffect(() => {
    if (init) {
      return;
    }
    init = true;
    if (typeof window === "undefined") return;
    initializeDb();
    initializeKeyValueStore();
  }, []);
  useCacheDictionary("verse");
  useCacheDictionary("description");
  return null;
}
