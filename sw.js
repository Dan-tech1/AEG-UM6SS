// Service Worker pour la mise en cache
const CACHE_NAME = 'aeg-um6ss-v2';
const urlsToCache = [
    '/',
    '/index.html',
    '/about.html',
    '/events.html',
    '/blog.html',
    '/blog.html',
    '/contact.html',
    '/404.html',
    'partenaires.html',
    '/css/style.css',
    '/js/main.js',
    '/js/gallery.js',
    '/data/data.json',
    '/assets/images/aeg.jpg',
    'feed.xml',
    'https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/masonry/4.2.2/masonry.pkgd.min.js',
    'openscearch.xml'
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