const C='ides-v13';
const FILES=['./','./index.html','./data.js','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
 const u=new URL(e.request.url);
 if(u.origin!==self.location.origin)return; // HF 음성 모델 등 외부는 통과(OPFS가 보관)
 if(e.request.method!=='GET')return;
 e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(r=>r||fetch(e.request).then(res=>{
  if(res.ok){const cp=res.clone();caches.open(C).then(c=>c.put(e.request,cp))}
  return res}).catch(()=>caches.match('./index.html'))));
});
