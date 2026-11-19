/* =====================================================================
   답안지 연습 — 책(WOD)과 같은 세트를 펜슬로 쓰고 끝에 자가채점
   - 유형·등급 시간(초/문제, S·A·B·C)은 교재 등급표 비례환산 (원래 앱의 값)
   - 시계는 숨기고 "끝"을 누른 뒤에만 보여줌. 칸마다 첫 획 시각을 기록해 문제별 시간을 계산
   - 의존: concepts.js 의 CR/cpick, 메인 스크립트의 app/go/db/save/saveSession/fmt/toast/frac/dec
   ===================================================================== */
const sq=(text,answer)=>({text,answer});
function sAdd2(){const a=CR(10,99),b=CR(10,99);return sq(`${a} + ${b} =`,a+b);}
function sSub2(){let a=CR(10,99),b=CR(10,99);if(b>a)[a,b]=[b,a];return sq(`${a} − ${b} =`,a-b);}
function sAddSub2(){return Math.random()<.5?sAdd2():sSub2();}
function sAdd4(){const a=CR(1000,9999),b=CR(1000,9999);return sq(`${a} + ${b} =`,a+b);}
function sSub4(){let a=CR(1000,9999),b=CR(1000,9999);if(b>a)[a,b]=[b,a];return sq(`${a} − ${b} =`,a-b);}
function sMultiAdd(){const n=[0,0,0,0,0].map(()=>CR(10,99));return sq(n.join('+')+' =',n.reduce((x,y)=>x+y,0));}
function sMul2x1(){const a=CR(11,99),b=CR(2,9);return sq(`${a} × ${b} =`,a*b);}
function sMul3x1(){const a=CR(100,999),b=CR(2,9);return sq(`${a} × ${b} =`,a*b);}
function sMul4x1(){const a=CR(1000,9999),b=CR(2,9);return sq(`${a} × ${b} =`,a*b);}
function sMulX5(){const b=cpick([5,15,25]);const x=CR(24,196)*cpick([5,10,15,20]);return sq(`${x} × ${b} =`,x*b);}
function sMul1019(){const a=CR(11,29),b=CR(11,29);return sq(`${a} × ${b} =`,a*b);}
function sMul11(){if(Math.random()<.5){const a=CR(11,99);return sq(`${a} × 11 =`,a*11);}const t=CR(1,9),o=CR(1,9);const a=t*10+o,b=t*10+(10-o);return sq(`${a} × ${b} =`,a*b);}
function sMul2x2(){const a=CR(11,99),b=CR(11,99);return sq(`${a} × ${b} =`,a*b);}
function sFrac(){const p=fFracCmp();return {html:`${frac(p.left.n,p.left.d)}<span class="sh-sq">□</span>${frac(p.right.n,p.right.d)}`,text:`${p.left.n}/${p.left.d} □ ${p.right.n}/${p.right.d}`,answer:p.answer,cmp:true};}
function sMulCmp(){const p=fMulCmp();return {html:`<span class="sh-small">${dec(p.left.a)}×${dec(p.left.b)}</span><span class="sh-sq">□</span><span class="sh-small">${dec(p.right.c)}×${dec(p.right.d)}</span>`,text:`${p.left.a}×${p.left.b} □ ${p.right.c}×${p.right.d}`,answer:p.answer,cmp:true};}

const SHEET_TYPES=[
  {id:'addsub2',part:1,name:'두 자리 덧셈·뺄셈',ex:'36 + 55 / 53 − 31',gen:sAddSub2,sec:[1.75,2,2.25,2.5]},
  {id:'add4',part:1,name:'네 자리 덧셈',ex:'3666 + 2768',gen:sAdd4,sec:[3.75,4.4,5,5.6]},
  {id:'sub4',part:1,name:'네 자리 뺄셈',ex:'7851 − 3399',gen:sSub4,sec:[5.6,6.25,6.9,7.5]},
  {id:'multiadd',part:1,name:'여러 수 덧셈',ex:'41+35+29+33+31',gen:sMultiAdd,sec:[7.5,8.3,9.2,10]},
  {id:'mul2x1',part:1,name:'두 자리 × 한 자리',ex:'98 × 6',gen:sMul2x1,sec:[1.75,2,2.25,2.5]},
  {id:'mul3x1',part:1,name:'세 자리 × 한 자리',ex:'381 × 7',gen:sMul3x1,sec:[9,10,11,12]},
  {id:'mul4x1',part:1,name:'네 자리 × 한 자리',ex:'4084 × 4',gen:sMul4x1,sec:[21,24,27,30]},
  {id:'mulx5',part:1,name:'×5·15·25 (단위깨기)',ex:'315 × 15',gen:sMulX5,sec:[4,4.5,5,5.5]},
  {id:'mul1019',part:1,name:'10·20단 곱셈',ex:'14 × 15',gen:sMul1019,sec:[2,2.25,2.5,2.75]},
  {id:'mul11',part:1,name:'11단·십등일합',ex:'26 × 11 / 27 × 23',gen:sMul11,sec:[2,2.25,2.5,2.75]},
  {id:'mul2x2',part:1,name:'두 자리 × 두 자리',ex:'94 × 35',gen:sMul2x2,sec:[10.5,12,13.5,15]},
  {id:'fraccmp',part:2,name:'분수 비교',ex:'33/46 □ 41/46',gen:sFrac,sec:[7,10,12,15]},
  {id:'mulcmp',part:2,name:'곱셈 비교',ex:'7300×30.8 □ 8600×25.4',gen:sMulCmp,sec:[10,13,16,20]},
];
const SHEET_TYPE=id=>SHEET_TYPES.find(t=>t.id===id);
const gradeBySec=(secArr,count,elapsed)=>{const th=secArr.map(s=>s*count);return elapsed<=th[0]?'S':elapsed<=th[1]?'A':elapsed<=th[2]?'B':elapsed<=th[3]?'C':'D';};

/* ---------- 메뉴 ---------- */
function screenSheetMenu(){
  S.sh=S.sh||{count:20,type:'addsub2'};
  const card=t=>{const bp=bestPerProblem(t.id);const st=(db().records[t.id]||[]).filter(r=>r.mode==='sheet');const sCount=st.filter(r=>r.grade==='S').length;
    return `<button class="btn ccard" data-id="${t.id}" style="border-left-color:${t.part===1?'var(--blue)':'var(--yellow)'};padding:12px 14px">
      <div class="body"><div class="t">${t.name}</div><div class="d">${dec(t.ex)} · S ${dec((t.sec[0]*S.sh.count).toFixed(0))}초/${S.sh.count}문제${st.length?` · 세트 ${st.length}회${sCount?` (S ${sCount}회)`:''}`:''}${bp?` · 최고 ${dec(bp.toFixed(1))}초/문제`:''}</div></div>
    </button>`;};
  app().innerHTML=`
    <button class="back" id="bk">‹ 홈</button>
    <h1>📝 답안지 연습</h1><div class="sub">책 세트 그대로 펜슬로 쓰고, 끝에 직접 채점</div>
    <div class="card"><div class="sec-title" style="margin-top:0">한 세트 문제 수</div>
      <div class="seg" id="seg">${[10,20].map(o=>`<button data-c="${o}" class="${o===S.sh.count?'on':''}">${o}문제</button>`).join('')}</div>
      <div class="hint">시작을 누르면 문제가 나타나고 시계가 돌아요(화면에는 안 보임). 마지막 문제 아래 "끝"을 펜으로 치면 멈추고 정답이 나타납니다. 틀린 칸만 톡 쳐서 표시하세요.</div>
    </div>
    <div class="sec-title">PART 01 · 사칙연산</div>${SHEET_TYPES.filter(t=>t.part===1).map(card).join('')}
    <div class="sec-title">PART 02 · 분수·곱셈 비교 (답 칸에 &lt; 또는 &gt;)</div>${SHEET_TYPES.filter(t=>t.part===2).map(card).join('')}
  `;
  document.getElementById('bk').onclick=()=>go(screenHome);
  app().querySelectorAll('#seg button').forEach(b=>b.onclick=()=>{S.sh.count=+b.dataset.c;screenSheetMenu();});
  app().querySelectorAll('[data-id]').forEach(b=>b.onclick=()=>{S.sh.type=b.dataset.id;go(()=>screenSheet(b.dataset.id,S.sh.count));});
}

/* ---------- 답안지 ---------- */
function screenSheet(typeId,count){
  const t=SHEET_TYPE(typeId);
  const probs=[];for(let i=0;i<count;i++)probs.push(t.gen());
  const st={typeId,count,probs,started:false,start:0,end:0,first:Array(count).fill(null),strokes:Array(count).fill(0),wrong:Array(count).fill(false),phase:'ready'};
  S.sheet=st;
  const cols=count>=20?2:1;const rows=Math.ceil(count/cols);
  app().innerHTML=`
    <div class="prog"><span>${t.name} · ${count}문제</span><span class="sub" style="margin:0">S ${dec((t.sec[0]*count).toFixed(0))}초</span>
      <span style="display:flex;gap:14px;align-items:center"><button class="sh-undo" id="sh-undo" title="마지막 획 지우기" style="display:none">↶ 지우기</button><button class="back" id="quit" style="padding:0;font-size:14px">나가기</button></span></div>
    <button class="btn primary big center" id="sh-start" style="margin-top:6px">시작 ▶</button>
    <div class="sh-wrap" id="sh-wrap">
    <div class="sh-grid cols${cols} t-${typeId}" id="sh-grid" style="grid-template-rows:repeat(${rows},auto)">
      ${probs.map((p,i)=>`<div class="sh-row" data-i="${i}"><span class="sh-n">${i+1}</span><span class="sh-q" id="q${i}"><span class="ph">·  ·  ·</span></span><div class="sh-box"><div class="sh-ans"></div></div></div>`).join('')}
    </div>
    <canvas id="sh-ink"></canvas>
    </div>
    <button class="btn big center" id="sh-end" disabled style="opacity:.4">끝 ■</button>
    <div class="row" id="sh-after" style="display:none"><button class="btn primary center" id="sh-confirm">채점 확정 ✔</button><button class="btn center" id="sh-again">다시 ↻</button></div>
    <div class="hint" id="sh-hint" style="text-align:center">시작을 누르면 문제가 보입니다</div>
  `;
  document.getElementById('quit').onclick=()=>{if(st.phase!=='solving'||confirm('푸는 중인 세트를 버릴까요?'))go(screenSheetMenu);};
  document.getElementById('sh-start').onclick=()=>{
    st.started=true;st.start=performance.now();st.phase='solving';
    probs.forEach((p,i)=>{const q=document.getElementById('q'+i);q.innerHTML=p.html||p.text;if(!p.html&&p.text.length>11)q.classList.add('long');});
    document.getElementById('sh-start').style.display='none';
    const e=document.getElementById('sh-end');e.disabled=false;e.style.opacity='1';e.classList.add('primary');
    document.getElementById('sh-hint').textContent='다 풀면 "끝"을 펜으로 톡';
    document.getElementById('sh-wrap').classList.add('solving');
    document.getElementById('sh-undo').style.display='';
    setupInk(st);
  };
  document.getElementById('sh-end').onpointerdown=ev=>{ev.preventDefault();if(st.phase!=='solving')return;st.end=performance.now();st.phase='grading';enterGrading(st);};
  document.getElementById('sh-again').onclick=()=>go(()=>screenSheet(typeId,count));
  document.getElementById('sh-confirm').onclick=()=>finishSheet(st);
}
/* 답안지 전체를 덮는 필기 면. 종이처럼 아무 데나 쓰고, 첫 획이 어느 문제 줄 위에서 시작됐는지로 시간을 잰다. */
function setupInk(st){
  const wrap=document.getElementById('sh-wrap'),c=document.getElementById('sh-ink');
  const dpr=window.devicePixelRatio||1;
  const W=wrap.clientWidth,H=wrap.clientHeight;c.width=W*dpr;c.height=H*dpr;c.style.width=W+'px';c.style.height=H+'px';
  const ctx=c.getContext('2d');ctx.scale(dpr,dpr);ctx.lineCap='round';ctx.lineJoin='round';ctx.strokeStyle='#fff';
  const wr=wrap.getBoundingClientRect();
  // 줄 영역(래퍼 기준 좌표) 캐시 → 히트테스트
  const rows=[...wrap.querySelectorAll('.sh-row')].map(r=>{const b=r.getBoundingClientRect();const k=W/wr.width;return {i:+r.dataset.i,x:(b.left-wr.left)*k,y:(b.top-wr.top)*k,w:b.width*k,h:b.height*k};});
  const hit=(x,y)=>{let best=null,bd=1e9;for(const r of rows){const inside=x>=r.x&&x<=r.x+r.w&&y>=r.y&&y<=r.y+r.h;if(inside)return r.i;const dx=x<r.x?r.x-x:x>r.x+r.w?x-r.x-r.w:0,dy=y<r.y?r.y-y:y>r.y+r.h?y-r.y-r.h:0;const d=dx*dx+dy*dy;if(d<bd){bd=d;best=r.i;}}return best;};
  const pos=e=>{const r=c.getBoundingClientRect();const k=W/r.width;return [(e.clientX-r.left)*k,(e.clientY-r.top)*k];};
  st.ink={strokes:[],cur:null};
  const penSeen=()=>S.penSeen||localStorage.getItem('psatcalc_pen')==='1';
  const allow=e=>{if(e.pointerType==='pen'){if(!S.penSeen){S.penSeen=true;try{localStorage.setItem('psatcalc_pen','1')}catch(_){}}return true;}
    if(e.pointerType==='touch'){if(S.pr&&S.pr.pen)return false;if(penSeen())return false;return true;} return true;};
  const width=e=>e.pointerType==='pen'?1.6+2.6*(e.pressure||0.5):2.6;
  const drawSeg=(a,b,w)=>{ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(a[0],a[1]);const mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2;ctx.quadraticCurveTo(a[0],a[1],mx,my);ctx.lineTo(b[0],b[1]);ctx.stroke();};
  c.onpointerdown=e=>{if(st.phase!=='solving'||!allow(e))return;e.preventDefault();c.setPointerCapture(e.pointerId);
    const p=pos(e);const i=hit(p[0],p[1]);
    if(i!==null){if(st.first[i]===null)st.first[i]=performance.now();st.strokes[i]++;}
    st.ink.cur={row:i,pts:[p],w:width(e)};ctx.lineWidth=st.ink.cur.w;ctx.beginPath();ctx.arc(p[0],p[1],st.ink.cur.w/2,0,Math.PI*2);ctx.fillStyle='#fff';ctx.fill();};
  c.onpointermove=e=>{const s=st.ink.cur;if(!s)return;e.preventDefault();
    let evs=e.getCoalescedEvents?e.getCoalescedEvents():[];if(!evs||!evs.length)evs=[e];
    for(const ev of evs){const p=pos(ev);const last=s.pts[s.pts.length-1];if(Math.hypot(p[0]-last[0],p[1]-last[1])<0.7)continue;drawSeg(last,p,s.w);s.pts.push(p);}};
  c.onpointerup=c.onpointercancel=e=>{const s=st.ink.cur;if(!s)return;st.ink.strokes.push(s);st.ink.cur=null;};
  const redraw=()=>{ctx.clearRect(0,0,W,H);for(const s of st.ink.strokes){ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(s.pts[0][0],s.pts[0][1],s.w/2,0,Math.PI*2);ctx.fill();for(let k=1;k<s.pts.length;k++)drawSeg(s.pts[k-1],s.pts[k],s.w);}};
  document.getElementById('sh-undo').onpointerdown=e=>{e.preventDefault();e.stopPropagation();if(st.phase!=='solving')return;const s=st.ink.strokes.pop();if(!s)return;if(s.row!==null){st.strokes[s.row]=Math.max(0,st.strokes[s.row]-1);}redraw();};
  st.ink.redraw=redraw;
}
function enterGrading(st){
  const e=document.getElementById('sh-end');e.style.display='none';
  document.getElementById('sh-wrap').classList.add('grading'); // 필기 면은 보이되 터치는 줄로 통과
  document.getElementById('sh-undo').style.display='none';
  document.getElementById('sh-after').style.display='';
  document.getElementById('sh-hint').innerHTML=`걸린 시간 <b>${fmt(st.end-st.start)}</b> · 틀린 칸을 톡 쳐서 표시한 뒤 "채점 확정"`;
  app().querySelectorAll('.sh-row').forEach(row=>{
    const i=+row.dataset.i,p=st.probs[i];
    row.querySelector('.sh-ans').textContent=p.cmp?p.answer:String(p.answer);
    if(st.strokes[i]===0){st.wrong[i]=true;row.classList.add('wrong','none');}
    row.onclick=()=>{st.wrong[i]=!st.wrong[i];row.classList.toggle('wrong',st.wrong[i]);};
  });
}
function finishSheet(st){
  const t=SHEET_TYPE(st.typeId);
  const elapsed=(st.end-st.start)/1000;
  const correct=st.wrong.filter(w=>!w).length;
  // 문제별 시간: 첫 획 시각 순서대로, 다음 첫 획(또는 끝)까지
  const order=st.first.map((ts,i)=>({i,ts})).filter(x=>x.ts!==null).sort((a,b)=>a.ts-b.ts);
  const per=Array(st.count).fill(null);
  order.forEach((x,k)=>{const next=k+1<order.length?order[k+1].ts:st.end;per[x.i]=(next-x.ts)/1000;});
  if(order.length){per[order[0].i]+= (order[0].ts-st.start)/1000;} // 첫 문제는 시작부터
  const g=gradeBySec(t.sec,st.count,elapsed);
  const rec={date:today(),ts:Date.now(),sec:Math.round(elapsed*10)/10,total:st.count,correct,grade:g,partial:false,mode:'sheet',per:per.map(v=>v===null?null:Math.round(v*10)/10)};
  const prevBest=bestPerProblem(st.typeId);
  saveSession(st.typeId,rec);
  const isPB=correct===st.count&&(prevBest===null||elapsed/st.count<prevBest);
  // 느린 문제 보관 (S 기준의 1.5배 넘거나 중앙값의 2배 넘는 문제)
  const vals=per.filter(v=>v!==null).sort((a,b)=>a-b);const med=vals.length?vals[Math.floor(vals.length/2)]:0;
  const d=db();d.slow=d.slow||{};const arr=d.slow[st.typeId]=d.slow[st.typeId]||[];
  per.forEach((v,i)=>{if(v!==null&&(v>t.sec[0]*1.5&&v>med*1.6))arr.push({q:st.probs[i].text,a:st.probs[i].answer,sec:Math.round(v*10)/10,wrong:st.wrong[i],ts:Date.now()});});
  d.slow[st.typeId]=arr.slice(-60);save(d);
  screenSheetResult(st,rec,g,isPB,prevBest,per);
}
function screenSheetResult(st,rec,g,isPB,prevBest,per){
  const t=SHEET_TYPE(st.typeId);const th=t.sec.map(s=>s*st.count);
  const maxv=Math.max(...per.filter(v=>v!==null),1);
  const avg=rec.sec/st.count;
  app().innerHTML=`
    <button class="back" id="bk">‹ 답안지 연습</button>
    <h1>${t.name} · ${st.count}문제</h1>
    <div class="grade g${g}">${g}</div>
    ${isPB?`<div style="text-align:center;margin-bottom:12px"><span class="pb-tag">🎉 신기록! ${prevBest?dec(prevBest.toFixed(1))+'→':''}${dec(avg.toFixed(1))}초/문제</span></div>`:''}
    <div class="grid3">
      <div class="stat y"><div class="n">${fmt(rec.sec*1000)}</div><div class="l">걸린 시간</div></div>
      <div class="stat b"><div class="n">${rec.correct}/${rec.total}</div><div class="l">정답</div></div>
      <div class="stat p"><div class="n">${dec(avg.toFixed(1))}<span style="font-size:13px">초</span></div><div class="l">문제당</div></div>
    </div>
    <div class="hint" style="text-align:center">기준 S ${dec(th[0].toFixed(0))}초 · A ${dec(th[1].toFixed(0))}초 · B ${dec(th[2].toFixed(0))}초 · C ${dec(th[3].toFixed(0))}초${g!=='S'?` · S까지 <b style="color:var(--yellow)">${dec((rec.sec-th[0]).toFixed(1))}초</b> 더`:''}</div>
    <div class="sec-title">문제별 시간 (첫 획 기준)</div>
    <div class="card">${st.probs.map((p,i)=>{const v=per[i];const slow=v!==null&&v>t.sec[0]*1.5;return `
      <div class="bar" style="margin:4px 0"><span class="lb" style="width:auto;min-width:120px;font-weight:600;${st.wrong[i]?'color:var(--red)':''}">${i+1}. ${p.text}${st.wrong[i]?' ✕':''}</span>
      <div class="tr"><div style="width:${v===null?0:Math.round(v/maxv*100)}%;background:${slow?'var(--red)':st.wrong[i]?'var(--orange)':'var(--green)'}"></div></div>
      <span class="nn" style="width:52px">${v===null?'-':dec(v.toFixed(1))+'초'}</span></div>`;}).join('')}
      <div class="hint">빨간 막대: S 기준(${dec(t.sec[0])}초/문제)의 1.5배를 넘긴 문제. 이런 문제는 따로 모아 두었다가 나중에 "느린 문제 세트"로 다시 풀 수 있어요.</div>
    </div>
    <button class="btn primary big center" id="again">같은 유형 한 세트 더 ↻</button>
    <button class="btn big center" id="menu">다른 유형</button>
    <button class="btn center" id="home">홈으로</button>
  `;
  document.getElementById('bk').onclick=()=>go(screenSheetMenu);
  document.getElementById('menu').onclick=()=>go(screenSheetMenu);
  document.getElementById('home').onclick=()=>go(screenHome);
  document.getElementById('again').onclick=()=>go(()=>screenSheet(st.typeId,st.count));
  if(isPB)toast('🎉 신기록!');
}
