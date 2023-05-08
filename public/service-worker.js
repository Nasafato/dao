import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { StaleWhileRevalidate } from "workbox-strategies";
import { cacheData } from "../src/utils/cache";

precacheAndRoute(self.__WB_MANIFEST);

registerRoute(
  /\.(?:js|css)$/,
  new StaleWhileRevalidate({
    cacheName: "static-resources",
  })
);

registerRoute(
  /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
  new StaleWhileRevalidate({
    cacheName: "images",
  })
);

registerRoute(
  /^https:\/\/dao-worker\.daodejing\.workers\.dev\/\w+$/,
  new StaleWhileRevalidate({
    cacheName: "audio-cache",
    plugins: [
      {
        cahceWillUpdate: async ({ request, response }) => {
          if (response.ok) {
            const clonedResponse = response.clone();
            const data = await clonedResponse.json();
            await cacheData(request.url, data);
          }
          return response;
        },
      },
    ],
  })
);
