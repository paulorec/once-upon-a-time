// Service worker do Once Upon a Time.
// Guarda a casca do app para abrir rápido e funcionar sem internet
// (as histórias já contadas ficam no aparelho). Histórias novas sempre vão à rede.
const CACHE = "oua-v14";
const CASCA = ["/", "/arte.js", "/manifest.webmanifest", "/icons/icon-192.png", "/icons/icon-512.png", "/icons/apple-touch-icon.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CASCA)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== "GET" || url.pathname.startsWith("/api/")) return;

  // Código do app (arte.js): sempre a versão nova quando há internet.
  if (url.origin === location.origin && url.pathname.endsWith(".js")) {
    e.respondWith(
      fetch(req)
        .then((res) => { const copia = res.clone(); caches.open(CACHE).then((c) => c.put(req, copia)); return res; })
        .catch(() => caches.match(req))
    );
    return;
  }

  // Página do app: tenta a versão nova primeiro; sem internet, usa a guardada.
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req)
        .then((res) => { const copia = res.clone(); caches.open(CACHE).then((c) => c.put("/", copia)); return res; })
        .catch(() => caches.match("/"))
    );
    return;
  }

  // Ícones, manifesto e fontes: usa o que já tem e atualiza por trás.
  if (url.origin === location.origin || url.hostname.endsWith("gstatic.com") || url.hostname.endsWith("googleapis.com")) {
    e.respondWith(
      caches.match(req).then((guardado) => {
        const rede = fetch(req).then((res) => {
          if (res.ok || res.type === "opaque") { const copia = res.clone(); caches.open(CACHE).then((c) => c.put(req, copia)); }
          return res;
        }).catch(() => guardado);
        return guardado || rede;
      })
    );
  }
});
