import { DAO_CDN_MP3_CACHE, CDN_URL } from "../src/consts";

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
    const cache = await caches.open(DAO_CDN_MP3_CACHE);
    await cache.put(audioUrl, response);

    // Send a message back to the component when caching is complete
    event.source.postMessage("audio-cached");
  }
});

const DAO_CDN_MP3_PATTERN =
  /^https:\/\/dao-worker\.daodejing\.workers\.dev\/.*\.mp3$/;

self.addEventListener("fetch", (event) => {
  if (!event) return;

  const { request } = event;
  console.log("request", request);
  if (request.url.match(DAO_CDN_MP3_PATTERN)) {
    console.log("matched mp3 pattern", request.mode);
    event.respondWith(
      (async function () {
        // Check if the request is in the cache
        const cache = await caches.open(DAO_CDN_MP3_CACHE);
        const corsRequest = new Request(request, { mode: "cors" });
        const cachedResponse = await cache.match(corsRequest);
        if (cachedResponse) {
          console.log("Serving from cache:", corsRequest);
          return cachedResponse;
        }
        console.log("Fetching from network:", corsRequest);
        const networkResponse = await fetch(corsRequest);
        console.log("Cors request mode: ", corsRequest.mode);
        await cache.put(corsRequest, networkResponse.clone());
        const keys = await cache.keys();
        console.log(
          "Cache keys: ",
          keys.map((key) => key.url),
          keys.map((key) => key.mode)
        );
        return networkResponse;
      })()
    );
  }
});
