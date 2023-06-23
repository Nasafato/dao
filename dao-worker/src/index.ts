/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export interface Env {
  DAO_BUCKET: R2Bucket;
}

const worker = {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const url = new URL(request.url);
    const key = url.pathname.slice(1);
    switch (request.method) {
      case "GET":
        const object = await env.DAO_BUCKET.get(key);

        if (object === null) {
          return new Response("Not found", { status: 404 });
        }

        const headers = new Headers();
        object.writeHttpMetadata(headers);
        headers.set("etag", object.httpEtag);

        if (key.endsWith(".mp3")) {
          headers.set("Accept-Ranges", "bytes");
          headers.set("Content-Type", "audio/mpeg");
          headers.set("Content-Length", object.size.toString());
          headers.set("Content-Range", `bytes 0-${object.size - 1}/*`);
        }

        const origin = request.headers.get("origin");
        if (origin && isAllowedOrigin(origin)) {
          headers.set("Access-Control-Allow-Origin", origin);
          headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
          headers.set("Access-Control-Allow-Headers", "Content-Type");
          headers.set("Access-Control-Allow-Credentials", "true");
        }

        console.log("url", url);
        return new Response(object.body, { headers });
      default:
        return new Response("Method Not Allowed", {
          status: 405,
          headers: {
            Allow: "GET",
          },
        });
    }
  },
};

export default worker;

function isAllowedOrigin(origin: string) {
  if (!origin) {
    return false;
  }
  const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    /^https:\/\/dao.*nasafato\.vercel\.app$/,
    "https://daodejing.app",
  ];

  return allowedOrigins.some((allowedOrigin) =>
    typeof allowedOrigin === "string"
      ? origin === allowedOrigin
      : origin.match(allowedOrigin)
  );
}
