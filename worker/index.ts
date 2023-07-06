import { DAO_CDN_MP3_CACHE } from "@/consts";

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

// const DAO_CDN_MP3_PATTERN =
//   /^https:\/\/dao-worker\.daodejing\.workers\.dev\/.*\.mp3$/;
const DAO_CDN_MP3_PATTERN =
  /^https:\/\/dao-worker\.daodejing\.workers\.dev\/.*\.mp3$/;
const BUNNY_CDN_MP3_PATTERN = /^https:\/\/daodejing\.b-cdn\.net\/.*\.mp3$/;

self.addEventListener("fetch", (event) => {
  if (!event) return;

  const { request } = event;
  // console.log("request", request);
  if (
    request.url.match(DAO_CDN_MP3_PATTERN) ||
    request.url.match(BUNNY_CDN_MP3_PATTERN)
  ) {
    // console.log("matched mp3 pattern", request.mode);
    event.respondWith(
      (async function () {
        // Check if the request is in the cache
        const cache = await caches.open(DAO_CDN_MP3_CACHE);
        const corsRequest = new Request(request, { mode: "no-cors" });
        const cachedResponse = await cache.match(corsRequest);
        if (cachedResponse) {
          // console.log("Serving from cache:", corsRequest);
          return cachedResponse;
        }
        // console.log("Fetching from network:", corsRequest);
        const networkResponse = await fetch(corsRequest);
        // console.log("Cors request mode: ", corsRequest.mode);
        await cache.put(corsRequest, networkResponse.clone());
        const keys = await cache.keys();
        // console.log(
        //   "Cache keys: ",
        //   keys.map((key) => key.url),
        //   keys.map((key) => key.mode)
        // );
        return networkResponse;
      })()
    );
  }
});
