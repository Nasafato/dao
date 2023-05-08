const { InjectManifest } = require("workbox-webpack-plugin");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Inject manifest
  webpack: (config, { isServer, buildId, dev }) => {
    if (!isServer && !dev) {
      config.plugins.push(
        new InjectManifest({
          swSrc: "./public/service-worker.js",
          exclude: [/\.map$/, /_app.js$/, /_document.js$/, /_error.js$/],
          maximumFileSizeToCacheInBytes: 10000000,
        })
      );
    }

    return config;
  },
};

module.exports = nextConfig;
