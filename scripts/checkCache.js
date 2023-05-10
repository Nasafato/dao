let c = await caches.open("dao-cdn-mp3");
let keys = await c.keys();
let urls = keys.map((k) => k.url);
urls;
