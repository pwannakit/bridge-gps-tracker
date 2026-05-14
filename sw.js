const CACHE_NAME = 'bridge-tracker-v3.7.1';
const urlsToCache = [
    './',
    './index.html',
    './manifest.json',
    'https://cdn.tailwindcss.com',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];

// ติดตั้ง Cache พื้นฐานเมื่อโหลดแอปครั้งแรก
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

// ดักจับและดึงข้อมูลจาก Cache
self.addEventListener('fetch', event => {
    // ป้องกันไม่ให้ Cache คำสั่งที่เรียกไปยัง Google Apps Script (เพื่อป้องกันการไม่ซิงค์ข้อมูล)
    if (event.request.url.includes('script.google.com')) {
        return;
    }
    
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // ถ้ามีข้อมูลใน Cache ให้ดึงมาใช้เลย (เพื่อให้แอปโหลดไวและใช้ตอนเน็ตหลุดได้)
                if (response) {
                    return response;
                }
                // ถ้าไม่มีก็ให้โหลดจากอินเทอร์เน็ตปกติ
                return fetch(event.request);
            })
    );
});
