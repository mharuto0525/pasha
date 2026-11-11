// ぱしゃっと：ホーム画面に「インストール」できるようにするための最小のサービスワーカー。
// キャッシュはしません（いつも最新の画面を読み込みます）。
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", () => {});
