const cacheStrategies = require("./serviceWorker/cache");

/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa")({
  dest: "public",
  // customWorkerDir: "serviceWorker",
  runtimeCaching: cacheStrategies,
});

module.exports = withPWA({
  reactStrictMode: true,
});
