// ぱしゃっと：ホーム画面にインストール＆プッシュ通知を受け取るサービスワーカー。
// キャッシュはしません（いつも最新の画面を読み込みます）。
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", () => {});

self.addEventListener("push", e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (_) {}
  e.waitUntil(self.registration.showNotification(d.title || "ぱしゃっと", {
    body: d.body || "新しいお知らせがあります",
    icon: "icon-192.png",
    badge: "icon-192.png",
    data: { url: d.url || "#/notifications" }
  }));
});

self.addEventListener("notificationclick", e => {
  e.notification.close();
  const hash = (e.notification.data && e.notification.data.url) || "#/notifications";
  e.waitUntil((async () => {
    const list = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const c of list) {
      if (c.url.startsWith(self.registration.scope)) {
        try { await c.focus(); } catch (_) {}
        c.postMessage({ type: "nav", hash });
        return;
      }
    }
    await self.clients.openWindow(self.registration.scope + hash);
  })());
});
