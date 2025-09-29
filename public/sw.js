// Упрощенный Service Worker для быстрой загрузки статики
const CACHE_NAME = 'translator-static-v1';
const STATIC_ASSETS = [
  '/manifest.webmanifest',
  '/icon-192.png',
  '/icon-512.png',
  '/icon-192-maskable.png',
  '/icon-512-maskable.png',
  '/apple-touch-icon.png',
  '/apple-touch-icon-120.png',
  '/apple-touch-icon-152.png',
  '/splash-640x1136.png',
  '/splash-750x1334.png',
  '/splash-1242x2688.png',
  '/splash-1536x2048.png',
  '/splash-1179x2556.png',
  '/splash-1206x2622.png',
  '/splash-1290x2796.png',
  '/splash-1320x2868.png',
];

// Установка - кэшируем только статические ресурсы
self.addEventListener('install', function(event) {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .catch(function(error) {
        console.error('Service Worker: Cache failed', error);
      })
  );
});

// Активация - очищаем старые кэши
self.addEventListener('activate', function(event) {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Перехват запросов - кэшируем только статику
self.addEventListener('fetch', function(event) {
  // Кэшируем только статические ресурсы (изображения, иконки, манифест)
  if (event.request.destination === 'image' || 
      event.request.url.includes('/manifest.webmanifest') ||
      event.request.url.includes('/icon-') ||
      event.request.url.includes('/apple-touch-icon') ||
      event.request.url.includes('/splash-')) {
    
    event.respondWith(
      caches.match(event.request)
        .then(function(response) {
          // Возвращаем из кэша или загружаем и кэшируем
          return response || fetch(event.request).then(function(fetchResponse) {
            // Кэшируем только успешные ответы
            if (fetchResponse.status === 200) {
              const responseClone = fetchResponse.clone();
              caches.open(CACHE_NAME).then(function(cache) {
                cache.put(event.request, responseClone);
              });
            }
            return fetchResponse;
          });
        })
    );
  }
  // Для остальных запросов (API, HTML) - обычная загрузка без кэширования
});
