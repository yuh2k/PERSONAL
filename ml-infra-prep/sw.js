'use strict';
const CACHE='ml-infra-lab-v1';
const CORE=['./','./index.html','./style.css','./curriculum.js','./app.js','./manifest.webmanifest','./icon.svg','./labs.zip'];
self.addEventListener('install',function(event){event.waitUntil(caches.open(CACHE).then(function(cache){return cache.addAll(CORE);} ).then(function(){return self.skipWaiting();}));});
self.addEventListener('activate',function(event){event.waitUntil(caches.keys().then(function(keys){return Promise.all(keys.filter(function(key){return key.startsWith('ml-infra-lab-')&&key!==CACHE;}).map(function(key){return caches.delete(key);}));}).then(function(){return self.clients.claim();}));});
self.addEventListener('fetch',function(event){if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin)return;if(event.request.mode==='navigate'){event.respondWith(fetch(event.request).catch(function(){return caches.match(new URL('./index.html',self.registration.scope).href);}));return;}event.respondWith(caches.match(event.request).then(function(cached){return cached||fetch(event.request);}));});
