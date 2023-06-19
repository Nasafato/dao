const cacheStrategies = require("./serviceWorker/cache");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa")({
  dest: "public",
  runtimeCaching: cacheStrategies,
});

module.exports = withBundleAnalyzer(
  withPWA({
    reactStrictMode: true,
  })
);
