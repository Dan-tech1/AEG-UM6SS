// Service Worker pour la mise en cache
const CACHE_NAME = 'aeg-um6ss-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/about.html',
    '/events.html',
    '/activities.html',
    '/blog.html',
    '/contact.html',
    '/404.html',
    '/css/style.css',
    '/js/main.js',
    '/js/registration.js',
    '/js/utils.js',
    '/data/data.json',
    '/img/logo.png',
    '/img/logo-light.png',
    '/img/favicon.ico'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Retourne la version mise en cache, sinon fetch du réseau
                if (response) {
                    return response;
                }
                return fetch(event.request);
            }
        )
    );
});