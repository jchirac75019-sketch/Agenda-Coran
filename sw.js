const CACHE_NAME = 'agenda-coran-v1';
const urlsToCache = [
  '/Agenda-Coran/',
  '/Agenda-Coran/index.html',
  '/Agenda-Coran/manifest.json'
];

// Installation du Service Worker
self.addEventListener('install', event => {
  console.log('📦 Service Worker: Installation...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('✅ Cache ouvert');
      return cache.addAll(urlsToCache).catch(err => {
        console.warn('⚠️ Certains fichiers n\'ont pas pu être mis en cache:', err);
        return Promise.resolve();
      });
    })
  );
  self.skipWaiting();
});

// Activation du Service Worker
self.addEventListener('activate', event => {
  console.log('🚀 Service Worker: Activation...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Suppression ancienne cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Stratégie de cache: Network First, Fall back to Cache
self.addEventListener('fetch', event => {
  const { request } = event;
  
  // Pour les fichiers statiques (CSS, JS, images)
  if (request.url.includes('/images/') || request.url.endsWith('.css') || request.url.endsWith('.js')) {
    event.respondWith(
      caches.match(request).then(response => {
        if (response) {
          return response;
        }
        return fetch(request).then(response => {
          if (!response || response.status !== 200 || response.type === 'error') {
            return response;
          }
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, responseClone);
          });
          return response;
        }).catch(() => {
          console.log('❌ Erreur fetch:', request.url);
          return new Response('Offline - Resource not available', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
              'Content-Type': 'text/plain'
            })
          });
        });
      })
    );
  } else {
    // Pour les autres requêtes (API, HTML)
    // IMPORTANT: Seulement mettre en cache les requêtes GET, pas POST
    event.respondWith(
      fetch(request)
        .then(response => {
          if (!response || response.status !== 200) {
            return response;
          }
          
          // Vérifier que c'est une requête GET avant de mettre en cache
          if (request.method === 'GET') {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(request, responseClone);
            });
          }
          
          return response;
        })
        .catch(() => {
          return caches.match(request).then(response => {
            if (response) {
              return response;
            }
            return new Response('Offline - Please check your connection', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
        })
    );
  }
});

// Gestion des messages
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('✅ Service Worker chargé avec succès');
