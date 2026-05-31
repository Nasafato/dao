import { defineConfig, globalIgnores } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

export default defineConfig([
  globalIgnores([
    "**/*.md",
    "public/sw.js",
    "public/sw.js.map",
    "public/workbox-*.js",
    "public/workbox-*.js.map",
    "public/worker-*.js",
  ]),
  {
    extends: [...nextCoreWebVitals],
    rules: {
      "react-hooks/immutability": "off",
      "react-hooks/refs": "off",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/use-memo": "off",
    },
  },
]);
