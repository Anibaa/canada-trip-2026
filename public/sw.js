// Offline support for the trip: pages are network-first (fresh forecast when online, last copy
// when not); build assets and photos are cache-first. "Save for offline" pre-downloads everything.
const CACHE = "canada-loop-v2";
const PAGES = ["/", "/today", "/itinerary", "/vancouver", "/toronto", "/montreal", "/transport"];
// next.config.ts limits image widths; phones request 828 (2x screens) or 1080 (3x screens).
const PHONE_WIDTHS = ["828", "1080"];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches
      .open(CACHE)
      .then((c) => c.addAll(PAGES))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

function put(req, res) {
  if (res && res.ok) {
    const copy = res.clone();
    caches.open(CACHE).then((c) => c.put(req, copy));
  }
  return res;
}

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req)
        .then((res) => put(url.pathname, res))
        .catch(() =>
          caches.match(url.pathname).then((m) => m || caches.match("/")),
        ),
    );
    return;
  }

  const p = url.pathname;
  if (p.startsWith("/_next/static/") || p.startsWith("/_next/image") || p.startsWith("/places/") || p.startsWith("/icon")) {
    e.respondWith(caches.match(req).then((m) => m || fetch(req).then((res) => put(req, res))));
    return;
  }

  e.respondWith(fetch(req).then((res) => put(req, res)).catch(() => caches.match(req)));
});

self.addEventListener("message", (e) => {
  if (e.data === "save-all") e.waitUntil(saveAll(e.source));
});

async function saveAll(client) {
  const reply = (m) => client && client.postMessage(m);
  try {
    const cache = await caches.open(CACHE);
    const assets = new Set();
    for (const page of PAGES) {
      const res = await fetch(page, { cache: "reload" });
      if (!res.ok) continue;
      await cache.put(page, res.clone());
      const html = (await res.text()).replace(/&amp;/g, "&");
      for (const m of html.matchAll(/"(\/_next\/static\/[^"?]+)"/g)) assets.add(m[1]);
      for (const m of html.matchAll(/(\/_next\/image\?url=[^\s",]+?&w=(\d+)&q=\d+)/g)) {
        if (PHONE_WIDTHS.includes(m[2])) assets.add(m[1]);
      }
    }
    const list = [...assets];
    let done = 0;
    reply({ type: "save-progress", done, total: list.length });
    // A few at a time so a phone on hotel Wi-Fi doesn't choke.
    for (let i = 0; i < list.length; i += 6) {
      await Promise.all(
        list.slice(i, i + 6).map(async (u) => {
          if (!(await cache.match(u))) {
            try {
              const r = await fetch(u);
              if (r.ok) await cache.put(u, r);
            } catch {}
          }
          done++;
        }),
      );
      reply({ type: "save-progress", done, total: list.length });
    }
    reply({ type: "save-done", total: list.length });
  } catch {
    reply({ type: "save-error" });
  }
}
