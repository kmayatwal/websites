// WaURL Chat Service Worker
// Place this file at the root of your website (e.g., https://yoursite.com/waurl-sw.js)
self.addEventListener('install', function(e) { self.skipWaiting(); });
self.addEventListener('activate', function(e) { e.waitUntil(self.clients.claim()); });

self.addEventListener('push', function(e) {
  if (!e.data) return;
  try {
    var payload = e.data.json();
    var options = {
      body: payload.body || '',
      icon: payload.icon || '',
      badge: payload.icon || '',
      data: payload.data || {},
      tag: 'waurl-chat-' + (payload.data && payload.data.conversationId || ''),
      renotify: true,
    };
    e.waitUntil(self.registration.showNotification(payload.title || 'New message', options));
  } catch(err) {
    console.error('[WaURL SW] Push error:', err);
  }
});

self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      for (var i = 0; i < clientList.length; i++) {
        if ('focus' in clientList[i]) return clientList[i].focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow('/');
    })
  );
});