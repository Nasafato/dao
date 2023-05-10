import { CDN_CACHE_NAME } from "../src/consts";

declare let self: ServiceWorkerGlobalScope;

// To disable all workbox logging during development, you can set self.__WB_DISABLE_DEV_LOGS to true
// https://developers.google.com/web/tools/workbox/guides/configure-workbox#disable_logging
//
// self.__WB_DISABLE_DEV_LOGS = true

// listen to message event from window
self.addEventListener("message", (event) => {
  // HOW TO TEST THIS?
  // Run this in your browser console:
  //     window.navigator.serviceWorker.controller.postMessage({command: 'log', message: 'hello world'})
  // OR use next-pwa injected workbox object
  //     window.workbox.messageSW({command: 'log', message: 'hello world'})
  console.log(event?.data);
});

self.addEventListener("push", (event) => {
  const data = JSON.parse(event?.data.text() || "{}");
  event?.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.message,
      icon: "/icons/android-chrome-192x192.png",
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event?.notification.close();
  event?.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then(function (clientList) {
        if (clientList.length > 0) {
          let client = clientList[0];
          for (let i = 0; i < clientList.length; i++) {
            if (clientList[i].focused) {
              client = clientList[i];
            }
          }
          return client.focus();
        }
        return self.clients.openWindow("/");
      })
  );
});

// In your service worker file
self.addEventListener("message", async (event) => {
  if (!event) return;

  const { action, audioUrl } = event.data;

  if (action === "cache-audio") {
    console.log("caching audio");
    const response = await fetch(audioUrl);

    // Cache the audio file using the same cache name and strategy as in your runtimeCaching configuration
    const cache = await caches.open(CDN_CACHE_NAME);
    await cache.put(audioUrl, response);

    // Send a message back to the component when caching is complete
    event.source.postMessage("audio-cached");
  }
});

// self.addEventListener("fetch", (event) => {
//   if (!event) return;

//   const { request } = event;

//   event.respondWith(
//     (async function () {
//       // Check if the request is in the cache
//       const cache = await caches.open("cross-origin-dao-audio-assets");
//       const cachedResponse = await cache.match(request.url);

//       if (cachedResponse) {
//         console.log("Serving from cache:", request.url);
//         return cachedResponse;
//       }

//       console.log("Fetching from network:", request.url);
//       const networkResponse = await fetch(request.url);
//       return networkResponse;
//     })()
//   );
// });
