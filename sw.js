/* 네트워크 우선 서비스 워커
   - 온라인이면 항상 서버에서 새 파일을 받아 보여주고(브라우저 HTTP 캐시 무시), 받은 것을 저장해 둔다
   - 오프라인이면 마지막으로 저장한 파일을 보여준다
   → 깃허브에 올린 수정이 아이패드 홈 화면 앱에도 다음 실행 때 바로 반영된다 */
const CACHE='psatcalc-files-v1';
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil((async()=>{
  const keys=await caches.keys();await Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)));
  await self.clients.claim();
})()));
self.addEventListener('fetch',e=>{
  const req=e.request;if(req.method!=='GET')return;
  const u=new URL(req.url);if(u.origin!==self.location.origin)return; // Firebase 등 외부는 그대로
  e.respondWith((async()=>{
    const cache=await caches.open(CACHE);
    try{
      const res=await fetch(req,{cache:'no-store'});
      if(res&&res.ok)cache.put(req,res.clone());
      return res;
    }catch(err){
      const hit=await cache.match(req)||(req.mode==='navigate'?await cache.match('./')||await cache.match('index.html'):null);
      if(hit)return hit;throw err;
    }
  })());
});
