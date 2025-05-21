// service-worker.js
const CACHE_NAME = 'plagiarism-tool-v1.0.1';
const urlsToCache = [
    '/',
    '/index.html',
    '/style-css.css',
    '/script-js.js',
    '/keys-js.js',
    '/zalo-icon.png',
    '/telegram-icon.png'
];

// Cài đặt Service Worker và lưu trữ tài nguyên
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
            .then(() => self.skipWaiting())
    );
});

// Kích hoạt Service Worker và xóa cache cũ
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Xử lý yêu cầu mạng: ưu tiên mạng, fallback về cache
self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request)
            .then(response => {
                // Lưu bản sao của tài nguyên mới vào cache
                if (response.status === 200) {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseClone);
                    });
                }
                return response;
            })
            .catch(() => {
                // Nếu không có mạng, lấy từ cache
                return caches.match(event.request);
            })
    );
});
