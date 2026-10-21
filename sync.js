/* =====================================================================
   기기 연동 (Firebase Firestore) — ES 모듈
   - 연동 코드(6자리) 하나를 두 기기에 넣으면 같은 문서(rooms/{code})를 읽고 쓴다.
   - 저장소 전체(JSON)를 문서 하나에 넣고, 양쪽 변경은 window.mergeData 로 합친다.
   - 오프라인이면 로컬에만 저장했다가 연결되면 올린다(Firestore 큐 + 재시도).
   ===================================================================== */
const SYNC_KEY='psatcalc_sync';
const state={code:null,ready:false,lastPush:0,lastPull:0,status:'off',unsub:null,timer:null,err:null,device:null};
const listeners=new Set();
const emit=()=>{listeners.forEach(f=>{try{f(status())}catch(e){}});if(window.onSyncStatus)try{window.onSyncStatus(status())}catch(e){}};
function status(){return {enabled:!!window.FIREBASE_CONFIG,code:state.code,status:state.status,lastPush:state.lastPush,lastPull:state.lastPull,err:state.err};}
function loadLocal(){try{return JSON.parse(localStorage.getItem(SYNC_KEY))||{}}catch(e){return{}}}
function saveLocal(o){localStorage.setItem(SYNC_KEY,JSON.stringify(o));}

let fb=null; // {db, doc, getDoc, setDoc, onSnapshot, serverTimestamp}
async function init(){
  if(!window.FIREBASE_CONFIG){state.status='off';emit();return;}
  try{
    const [{initializeApp},fs]=await Promise.all([
      import('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js'),
      import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js'),
    ]);
    const app=initializeApp(window.FIREBASE_CONFIG);
    const db=fs.getFirestore(app);
    fb={db,doc:fs.doc,getDoc:fs.getDoc,setDoc:fs.setDoc,onSnapshot:fs.onSnapshot};
    state.ready=true;
    const loc=loadLocal(); state.device=loc.device||(loc.device=Math.random().toString(36).slice(2,8),saveLocal(loc),loc.device);
    if(loc.code){await connect(loc.code,{silent:true});}
    else {state.status='idle';emit();}
  }catch(e){state.status='error';state.err='Firebase 불러오기 실패: '+(e.message||e);emit();}
}
function ref(code){return fb.doc(fb.db,'rooms',code);}

/* 코드로 연결: 원격 문서를 읽어 로컬과 병합 → 저장 → 올리기 → 실시간 구독 */
async function connect(code,opt={}){
  if(!fb)throw new Error('Firebase 설정이 없어요');
  code=String(code).replace(/\D/g,'');
  if(!/^\d{6}$/.test(code))throw new Error('6자리 숫자 코드를 입력하세요');
  state.status='connecting';state.err=null;emit();
  try{
    const snap=await Promise.race([fb.getDoc(ref(code)),new Promise((_,rej)=>setTimeout(()=>rej(new Error('서버 응답이 없어요 (인터넷 연결이나 설정값을 확인)')),10000))]);
    let local=window.load();
    if(snap.exists()&&snap.data().data){
      const remote=JSON.parse(snap.data().data);
      local=window.mergeData(local,remote);
    }
    state.code=code; const loc=loadLocal(); loc.code=code; saveLocal(loc);
    window.save(local,{noSync:true});
    await pushNow(local);
    subscribe();
    state.status='on';emit();
    return true;
  }catch(e){state.status=fb?'idle':'off';state.err='연결 실패: '+(e.message||e);emit();throw e;}
}
function newCode(){return String(Math.floor(100000+Math.random()*900000));}
async function create(){const code=newCode();await connect(code);return code;}
function disconnect(){
  if(state.unsub){state.unsub();state.unsub=null;}
  state.code=null;const loc=loadLocal();delete loc.code;saveLocal(loc);
  state.status=fb?'idle':'off';emit();
}
function subscribe(){
  if(state.unsub)state.unsub();
  state.unsub=fb.onSnapshot(ref(state.code),snap=>{
    if(!snap.exists())return;
    const d=snap.data(); if(d.device===state.device)return; // 내가 올린 것
    if(!d.data)return;
    try{
      const remote=JSON.parse(d.data), local=window.load();
      const merged=window.mergeData(local,remote);
      const changed=JSON.stringify(merged)!==JSON.stringify(local);
      if(changed){window.save(merged,{noSync:true});state.lastPull=Date.now();emit();if(window.onSyncPulled)window.onSyncPulled();}
    }catch(e){}
  },err=>{state.err='실시간 수신 오류: '+(err.message||err);emit();});
}
async function pushNow(data){
  if(!fb||!state.code)return;
  data=data||window.load();
  try{
    await fb.setDoc(ref(state.code),{data:JSON.stringify(data),updatedAt:Date.now(),device:state.device});
    state.lastPush=Date.now();state.err=null;emit();
  }catch(e){state.err='올리기 실패(연결되면 다시 시도): '+(e.message||e);emit();}
}
function schedulePush(){ // save() 직후 호출: 1.5초 묶어서 올림
  if(!fb||!state.code)return;
  clearTimeout(state.timer);state.timer=setTimeout(()=>pushNow(),1500);
}
window.Sync={init,connect,create,disconnect,pushNow,schedulePush,status,onChange:f=>{listeners.add(f);return()=>listeners.delete(f);}};
init();
