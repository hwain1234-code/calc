/* =====================================================================
   집중 연습 문제 틀 — 환율 · 인구 X명당 Y · 시속 · 연비
   - 각 주제(topic)는 템플릿 함수 배열. 호출마다 새 문제를 돌려준다.
   - 문제 형식: {kind:'num'|'ox'|'choice', html, ans, unit?, why, tol?, choices?}
     · num    : 숫자 입력. ans 숫자, tol 상대오차(기본 0.6%)
     · ox     : O/X. ans true/false
     · choice : 보기 중 하나. choices 배열, ans 는 정답 index
   - concepts.js 의 CR, cpick, cshuffle, N, Nd, htable, F 를 사용한다.
   ===================================================================== */
const FUEL={'휘발유':1200,'경유':1000,'LPG':800};
const rough=()=>Math.random()<.35; // 35%는 어림이 필요한 실전형 숫자
const fmtH=h=>{ // 시간 표시: 2.5 → 2시간 30분
  const hh=Math.floor(h), mm=Math.round((h-hh)*60); return mm?`${hh}시간 ${mm}분`:`${hh}시간`;};

const PRACTICE={
  fx:{name:'환율',icon:'💱',color:'var(--yellow)',desc:'원/달러·원/100엔·교차환율',tpl:[
    ()=>{const r=rough();const d=r?CR(37,480):cpick([100,200,300,500]);const k=r?CR(1080,1420):cpick([1000,1100,1200,1300]);
      return {kind:'num',html:`환율이 <b>${N(k)}원/달러</b>일 때, ${N(d)}달러짜리 물건의 원화 가격은?`,ans:d*k,unit:'원',tol:r?.02:0,
        why:`달러(분모)를 알고 원(분자)을 구하니 곱한다: ${N(d)} × ${N(k)} = ${N(d*k)}원${r?' (어림: 약 '+N(Math.round(d*k/10000)*10000)+'원)':''}`};},
    ()=>{const k=cpick([1100,1200,1250,1300]);const d=cpick([150,240,320,450,600]);const w=d*k;
      return {kind:'num',html:`환율이 <b>${N(k)}원/달러</b>일 때, ${N(w)}원은 몇 달러인가?`,ans:d,unit:'달러',
        why:`원(분자)을 알고 달러(분모)를 구하니 나눈다: ${N(w)} ÷ ${N(k)} = ${N(d)}달러`};},
    ()=>{const j=cpick([20000,35000,50000,80000,120000]);const jk=cpick([900,950,1000,1100]);
      return {kind:'num',html:`환율이 <b>${N(jk)}원/100엔</b>일 때, ${N(j)}엔은 몇 원인가?`,ans:j/100*jk,unit:'원',
        why:`"100엔당 ${N(jk)}원"이므로 엔을 100으로 나눈 뒤 곱한다: ${N(j)} ÷ 100 × ${N(jk)} = ${N(j/100*jk)}원. (원/100엔을 원/엔으로 착각해 100배 크게 계산하는 함정)`};},
    ()=>{const uk=cpick([1100,1200,1300,1400]);const ck=cpick([150,175,200,210]);
      return {kind:'num',html:`원/달러 환율이 <b>${N(uk)}</b>, 원/위안 환율이 <b>${N(ck)}</b>일 때, 위안/달러 환율은? (소수 둘째 자리까지)`,ans:uk/ck,unit:'위안/달러',tol:.01,
        why:`(원/달러) ÷ (원/위안) = 위안/달러. 원이 약분된다: ${N(uk)} ÷ ${N(ck)} = ${N(Math.round(uk/ck*100)/100)}위안/달러`};},
    ()=>{const d=cpick([50,80,120,200]);const uk=cpick([1200,1300,1400]);const jk=cpick([1000,1050,1400]);
      return {kind:'num',html:`환율이 <b>${N(uk)}원/달러</b>, <b>${N(jk)}원/100엔</b>일 때, ${N(d)}달러는 몇 엔인가?`,ans:d*uk/jk*100,unit:'엔',tol:.01,
        why:`달러 → 원 → 엔 순서. ${N(d)} × ${N(uk)} = ${N(d*uk)}원, 원을 100엔당 가격으로 나누면 ${N(d*uk)} ÷ ${N(jk)} = ${N(Math.round(d*uk/jk*100)/100)} (100엔 묶음) → × 100 = ${N(Math.round(d*uk/jk*100))}엔`};},
    ()=>{const usd=cpick([28,30,35,40])*1000, cny=cpick([22,26,30,34])*10000, jpy=cpick([280,320,380,450])*10000;
      const uk=CR(1050,1400), ck=CR(160,215), jk=CR(900,1150);
      const vals=[usd*uk,cny*ck,jpy/100*jk]; const names=['미국기업','중국기업','일본기업'];
      const hi=vals.indexOf(Math.max(...vals));
      return {kind:'choice',html:`연봉이 미국기업 <b>${N(usd)}달러</b>, 중국기업 <b>${N(cny)}위안</b>, 일본기업 <b>${N(jpy)}엔</b>이고 환율이 ${N(uk)}원/달러, ${N(ck)}원/위안, ${N(jk)}원/100엔일 때, 원화 환산 연봉이 가장 많은 기업은?`,choices:names,ans:hi,
        why:`각각 환율을 곱한다(엔은 100으로 나눈 뒤). 미국 ${N(Math.round(vals[0]/10000))}만원 · 중국 ${N(Math.round(vals[1]/10000))}만원 · 일본 ${N(Math.round(vals[2]/10000))}만원 → ${names[hi]}. 어림: 달러 ${Math.round(usd/1000)}천 × ${Math.round(uk/100)/10}천 ≈ ${Math.round(usd*uk/1e7)}천만`};},
    ()=>{const t=Math.random()<.5;const a=cpick([1100,1200]),b=a+100;
      return {kind:'ox',html:`원/달러 환율이 ${N(a)}원에서 ${N(b)}원으로 오르면, 같은 달러 가격의 수입품 원화 가격은 <b>${t?'오른다':'내린다'}</b>.`,ans:t,
        why:`원/달러가 오르면 1달러를 사는 데 원이 더 든다 = 원화 가치 하락 = 수입품 원화 가격 상승. ${N(a)}→${N(b)}은 약 ${Math.round(100/a*100)/10}% 상승.`};},
    ()=>{const usd=cpick([100,200,300,500]);const uk=cpick([1200,1300,1400]);const ck=cpick([150,200,250]);
      return {kind:'num',html:`미국에서 ${N(usd)}달러인 물건이 중국에서도 원화 기준으로 같은 가격이라면, 위안화 가격은? (환율 ${N(uk)}원/달러, ${N(ck)}원/위안)`,ans:usd*uk/ck,unit:'위안',tol:.01,
        why:`원화 가격 ${N(usd)} × ${N(uk)} = ${N(usd*uk)}원 → 위안으로 바꾸려면 나눈다: ${N(usd*uk)} ÷ ${N(ck)} = ${N(Math.round(usd*uk/ck*100)/100)}위안`};},
    ()=>{const t=Math.random()<.5;const jk=cpick([1000,1100]);
      return {kind:'ox',html:`환율이 ${N(jk)}원/100엔일 때, 1엔은 <b>${t?N(jk/100):N(jk)}원</b>이다.`,ans:t,
        why:`"원/100엔"은 100엔 묶음의 가격. 1엔 = ${N(jk)} ÷ 100 = ${N(jk/100)}원.`};},
  ]},

  perx:{name:'인구 X명당 Y',icon:'👥',color:'var(--purple)',desc:'10만명당·천명당·1인당',tpl:[
    ()=>{const r=rough();const pop=r?CR(180,4900):cpick([500,800,1000,1200,2000,2500,3000,4000,5000]);const rate=r?CR(7,48):cpick([5,10,15,20,25,30,40,50]);
      const tot=Math.round(rate*pop/10);return {kind:'num',html:`인구 <b>${N(pop)}만명</b>인 나라의 인구 10만명당 자살자 수가 <b>${rate}명</b>이다. 연간 자살자 수는?${r?' (어림 ±2%)':''}`,ans:tot,unit:'명',tol:r?.02:0,
        why:`총 수를 구하니 곱한다. 묶음 수 = ${N(pop)}만 ÷ 10만 = ${N(pop/10)} → ${rate} × ${N(pop/10)} = ${N(Math.round(tot))}명`};},
    ()=>{const rate=cpick([20,30,40,50,100,200,300]);const k=cpick([30,60,120,200,300,450,500]);const tot=rate*k;
      return {kind:'num',html:`인구 10만명당 취업자 수가 <b>${N(rate)}명</b>이고, 취업자가 모두 <b>${N(tot)}명</b>이다. 인구는 몇 만명인가?`,ans:k*10,unit:'만명',
        why:`인구를 구하니 나눈다. 묶음 수 = ${N(tot)} ÷ ${N(rate)} = ${N(k)} → 인구 = ${N(k)} × 10만 = ${N(k*10)}만명 (총 수보다 훨씬 커져야 정상)`};},
    ()=>{const r=rough();const pop=r?CR(250,4800):cpick([300,600,1200,2000,3000,4000]);const rate=r?CR(6,45):cpick([5,10,20,25,30,40]);const tot=Math.round(rate*pop/10);
      return {kind:'num',html:`연간 교통사고 사망자가 <b>${N(tot)}명</b>, 인구가 <b>${N(pop)}만명</b>이다. 인구 10만명당 사망자 수는?`,ans:tot/(pop/10),unit:'명',tol:r?.02:0,
        why:`비율을 구하니 나눈다. 묶음 수 = ${N(pop)}만 ÷ 10만 = ${N(pop/10)} → ${N(tot)} ÷ ${N(pop/10)} = ${N(Math.round(tot/(pop/10)*10)/10)}명`};},
    ()=>{const rate=cpick([20,30,45,60,80]);const t=Math.random()<.5;const alt=t?rate/100:rate/10;
      return {kind:'ox',html:`인구 10만명당 ${rate}명은 인구 <b>1,000명당 ${N(alt)}명</b>과 같다.`,ans:t,
        why:`10만명 → 1,000명은 100분의 1 묶음이므로 값도 100으로 나눈다: ${rate} ÷ 100 = ${N(rate/100)}명. (10으로 나누면 1만명당 값)`};},
    ()=>{const rate=cpick([20,50,80,100,250]);return {kind:'num',html:`인구 10만명당 <b>${rate}명</b>은 몇 %인가? (소수 셋째 자리까지)`,ans:rate/1000,unit:'%',tol:.001,
        why:`%는 100명당. 10만명당은 100명당의 1,000배 묶음이므로 1,000으로 나눈다: ${rate} ÷ 1,000 = ${N(rate/1000)}%`};},
    ()=>{const A={tot:CR(8,60)*100,pop:cpick([800,1200,2000,2500,3000])},B={tot:CR(8,60)*100,pop:cpick([600,1000,1500,2000,4000])};
      const ra=A.tot/A.pop*10, rb=B.tot/B.pop*10; if(Math.abs(ra-rb)<0.3)B.tot+=500; const ra2=A.tot/A.pop*10, rb2=B.tot/B.pop*10;
      const t=ra2>rb2;const claim=Math.random()<.5;
      return {kind:'ox',html:`${htable(['','A 국','B 국'],[['연간 자살자 수(명)',N(A.tot),N(B.tot)],['인구(만명)',N(A.pop),N(B.pop)]])}인구 10만명당 자살자 수는 <b>${claim?'A':'B'}국</b>이 더 많다.`,ans:claim===t,
        why:`A국 ${N(A.tot)} ÷ ${N(A.pop/10)}묶음 = ${N(Math.round(ra2*10)/10)}명, B국 ${N(B.tot)} ÷ ${N(B.pop/10)}묶음 = ${N(Math.round(rb2*10)/10)}명 → ${t?'A':'B'}국이 많다. (분수 비교: 총 수 ÷ 인구 끼리 좌우 비교해도 됨)`};},
    ()=>{const names=['A 국','B 국','C 국'];const rows=names.map(()=>({tot:CR(5,80)*100,pop:cpick([500,1000,1500,2000,3000,4000,5000])}));
      const rates=rows.map(r=>r.tot/r.pop*10);const hi=rates.indexOf(Math.max(...rates));
      return {kind:'choice',html:`${htable(['',...names],[['연간 사망자 수(명)',...rows.map(r=>N(r.tot))],['인구(만명)',...rows.map(r=>N(r.pop))]])}인구 10만명당 사망자 수가 가장 많은 나라는?`,choices:names,ans:hi,
        why:rows.map((r,i)=>`${names[i]} ${N(r.tot)} ÷ ${N(r.pop/10)} = ${N(Math.round(rates[i]*10)/10)}`).join(' · ')+` → ${names[hi]}`};},
    ()=>{const g=cpick([3,4,5,6])*cpick([100,1000]);const pop=cpick([500,1000,2000,5000]);
      return {kind:'num',html:`GDP가 <b>${N(g)}조원</b>, 인구가 <b>${N(pop)}만명</b>이다. 1인당 GDP는 몇 만원인가?`,ans:g*1e12/(pop*1e4)/1e4,unit:'만원',
        why:`1인당 = GDP ÷ 인구. ${N(g)}조원 = ${N(g*1e4)}억원, 인구 ${N(pop)}만명 → ${N(g*1e4)}억 ÷ ${N(pop)}만 = ${N(g*1e4/pop)}만원 (억 ÷ 만 = 만)`};},
    ()=>{const d=cpick([2,3,4,5]),pop=cpick([200,500,1000,2000]);
      return {kind:'num',html:`인구 1,000명당 의사 수가 <b>${d}명</b>인 나라의 인구가 <b>${N(pop)}만명</b>이다. 의사 수는?`,ans:d*pop*10,unit:'명',
        why:`묶음 수 = ${N(pop)}만 ÷ 1,000 = ${N(pop*10)} → ${d} × ${N(pop*10)} = ${N(d*pop*10)}명 (인구가 만명 단위, X가 1,000이면 묶음 수 = 인구(만명) × 10)`};},
  ]},

  speed:{name:'시속',icon:'🚗',color:'var(--blue)',desc:'거리·시간·속도, 분 단위 환산',tpl:[
    ()=>{const v=cpick([40,50,60,80,90,100,120]);const t=cpick([1,1.5,2,2.5,3,4]);
      return {kind:'num',html:`시속 <b>${v}km</b>로 <b>${fmtH(t)}</b> 달리면 몇 km를 가는가?`,ans:v*t,unit:'km',
        why:`거리 = 속도 × 시간 = ${v} × ${Nd(t)} = ${N(v*t)}km (시간을 알고 km를 구하니 곱한다)`};},
    ()=>{const r=rough();const v=r?CR(45,115):cpick([40,50,60,80,100]);const d=r?CR(60,420):v*cpick([1.5,2,2.5,3,4]);
      return {kind:'num',html:`시속 <b>${v}km</b>로 <b>${N(d)}km</b>를 가면 몇 시간 걸리는가? (소수로, 예: 2.5)`,ans:d/v,unit:'시간',tol:r?.02:0,
        why:`시간 = 거리 ÷ 속도 = ${N(d)} ÷ ${v} = ${N(Math.round(d/v*100)/100)}시간 = ${fmtH(d/v)}`};},
    ()=>{const v=cpick([40,50,60,75,90,100,120]);const d=cpick([5,10,15,20,30]);
      return {kind:'num',html:`시속 <b>${v}km</b>인 자동차가 <b>${d}km</b>를 가는 데 걸리는 시간은 몇 분인가?`,ans:d/v*60,unit:'분',tol:.01,
        why:`${d} ÷ ${v} = ${N(Math.round(d/v*1000)/1000)}시간 → × 60 = ${N(Math.round(d/v*60*10)/10)}분. (시속 60km = 1분에 1km 를 기준으로 비례해도 됨)`};},
    ()=>{const v=cpick([60,72,80,90,100,120]);const m=cpick([10,15,20,30,40,45,50]);
      return {kind:'num',html:`시속 <b>${v}km</b>로 <b>${m}분</b> 달린 거리는?`,ans:v*m/60,unit:'km',tol:.01,
        why:`분을 시간으로: ${m}분 = ${N(Math.round(m/60*1000)/1000)}시간 → ${v} × ${m}/60 = ${N(Math.round(v*m/60*10)/10)}km`};},
    ()=>{const d=cpick([120,180,240,300]);const t=cpick([1.5,2,2.5,3,4]);
      return {kind:'num',html:`<b>${N(d)}km</b>를 <b>${fmtH(t)}</b>에 갔다. 평균 시속은?`,ans:d/t,unit:'km/h',
        why:`속도 = 거리 ÷ 시간 = ${N(d)} ÷ ${Nd(t)} = ${N(d/t)}km/h`};},
    ()=>{const names=['자동차 A','자동차 B','자동차 C'];const vs=cshuffle([50,60,80,90,100,120]).slice(0,3);const hi=vs.indexOf(Math.max(...vs));
      return {kind:'choice',html:`${htable(['',...names],[['속도(km/h)',...vs.map(N)]])}1km를 가는 데 걸리는 시간이 가장 <b>짧은</b> 자동차는?`,choices:names,ans:hi,
        why:`1km당 시간 = 1 ÷ 속도. 속도가 빠를수록 짧다 → ${names[hi]} (${vs[hi]}km/h, 1km에 ${N(Math.round(60/vs[hi]*100)/100)}분)`};},
    ()=>{const t=Math.random()<.5;const v=cpick([60,90,120]);const m=cpick([20,30,40]);const right=v*m/60;const shown=t?right:v*m/60*cpick([1.5,2,0.5]);
      return {kind:'ox',html:`시속 ${v}km로 ${m}분 달리면 <b>${N(shown)}km</b>를 간다.`,ans:t,
        why:`${m}분은 ${m}/60시간이므로 ${v} × ${m}/60 = ${N(right)}km. 분을 시간으로 바꾸지 않고 곱하면 틀린다.`};},
    ()=>{const d=cpick([30,45,60,90]);const m=cpick([30,40,45,50,60,90]);
      return {kind:'num',html:`<b>${d}km</b> 떨어진 곳에 <b>${m}분</b> 안에 도착하려면 시속 최소 몇 km로 가야 하는가?`,ans:d/(m/60),unit:'km/h',tol:.01,
        why:`속도 = 거리 ÷ 시간 = ${d} ÷ (${m}/60) = ${d} × 60/${m} = ${N(Math.round(d/(m/60)*10)/10)}km/h`};},
    ()=>{const t=Math.random()<.5;return {kind:'ox',html:`같은 거리를 갈 때 절반은 시속 60km, 나머지 절반은 시속 120km로 달리면 전체 평균 시속은 <b>${t?'90km보다 낮다':'90km이다'}</b>.`,ans:t,
        why:`평균 속도는 총 거리 ÷ 총 시간. 각 60km씩이라면 1시간 + 0.5시간 = 1.5시간에 120km → 80km/h. 느린 구간에서 시간을 더 쓰므로 단순 평균(90)보다 낮다.`};},
  ]},

  fuel:{name:'연비',icon:'⛽',color:'var(--mint)',desc:'연료·거리·연비·연료비',tpl:[
    ()=>{const r=rough();const e=r?CR(9,19):cpick([8,10,12,15,16,20]);const d=r?CR(90,480):e*cpick([10,15,20,25,30]);
      return {kind:'num',html:`연비 <b>${e}km/L</b>인 자동차로 <b>${N(d)}km</b>를 가려면 연료가 몇 L 필요한가?`,ans:d/e,unit:'L',tol:r?.02:0,
        why:`연료 = 거리 ÷ 연비 = ${N(d)} ÷ ${e} = ${N(Math.round(d/e*100)/100)}L (km를 알고 L를 구하니 나눈다)`};},
    ()=>{const e=cpick([8,10,12,15,18,20]);const l=cpick([15,20,25,30,40,50]);
      return {kind:'num',html:`연비 <b>${e}km/L</b>인 자동차에 연료 <b>${l}L</b>가 있다. 갈 수 있는 거리는?`,ans:e*l,unit:'km',
        why:`거리 = 연비 × 연료 = ${e} × ${l} = ${N(e*l)}km (L를 알고 km를 구하니 곱한다)`};},
    ()=>{const l=cpick([10,15,20,25,30]);const e=cpick([8,10,12,15,16,20]);
      return {kind:'num',html:`연료 <b>${l}L</b>로 <b>${N(e*l)}km</b>를 달렸다. 연비는?`,ans:e,unit:'km/L',
        why:`연비 = 거리 ÷ 연료 = ${N(e*l)} ÷ ${l} = ${e}km/L`};},
    ()=>{const f=cpick(Object.keys(FUEL));const e=cpick([8,10,12,15,16,20]);const d=e*cpick([10,15,20,25,30]);
      return {kind:'num',html:`${f} 자동차(연비 <b>${e}km/L</b>)로 <b>${N(d)}km</b>를 달릴 때 연료비는? (${f} ${N(FUEL[f])}원/L)`,ans:d/e*FUEL[f],unit:'원',
        why:`연료 = ${N(d)} ÷ ${e} = ${N(d/e)}L → 연료비 = ${N(d/e)}L × ${N(FUEL[f])}원/L = ${N(d/e*FUEL[f])}원`};},
    ()=>{const f=cpick(Object.keys(FUEL));const e=cpick([8,10,12,15,16,20]);
      return {kind:'num',html:`${f} 자동차(연비 <b>${e}km/L</b>, ${N(FUEL[f])}원/L)의 <b>1km당 연료비</b>는?`,ans:FUEL[f]/e,unit:'원',tol:.01,
        why:`1km에 드는 연료 = 1/${e}L → 연료비 = ${N(FUEL[f])} ÷ ${e} = ${N(Math.round(FUEL[f]/e*10)/10)}원. (연비의 역수 × 단가)`};},
    ()=>{const names=['자동차 A','자동차 B','자동차 C'];const fs=cshuffle(Object.keys(FUEL));const es=[cpick([8,10,12]),cpick([10,12,15]),cpick([12,15,20])];
      const cost=es.map((e,i)=>100/e*FUEL[fs[i]]);const hi=cost.indexOf(Math.max(...cost));
      return {kind:'choice',html:`${htable(['',...names],[['유종',...fs],['연비(km/L)',...es.map(N)]])}100km 주행 시 연료비가 가장 <b>많이</b> 드는 자동차는? (휘발유 1,200·경유 1,000·LPG 800원/L)`,choices:names,ans:hi,
        why:names.map((n,i)=>`${n} 100÷${es[i]}=${N(Math.round(100/es[i]*10)/10)}L × ${N(FUEL[fs[i]])} = ${N(Math.round(cost[i]))}원`).join(' · ')+` → ${names[hi]}`};},
    ()=>{const e=cpick([10,12,15,16]);const T=cpick([30,40,45,50,60]);const d=cpick([400,500,600,700,800]);const max=e*T;const t=max<d;
      return {kind:'ox',html:`연비 <b>${e}km/L</b>, 연료탱크 <b>${T}L</b>인 자동차로 <b>${N(d)}km</b>를 가면 중간에 적어도 한 번은 주유해야 한다.`,ans:t,
        why:`가득 채우면 ${e} × ${T} = ${N(max)}km까지 간다. ${N(d)}km ${t?'>':'≤'} ${N(max)}km → ${t?'주유 필요':'주유 없이 가능'}`};},
    ()=>{const e=cpick([8,10,12.5,16,20,25]);return {kind:'num',html:`연비 <b>${Nd(e)}km/L</b>인 자동차가 <b>1km</b>를 가는 데 드는 연료는 몇 <b>ml</b>인가?`,ans:1000/e,unit:'ml',tol:.01,
        why:`연비를 뒤집으면 1/${Nd(e)} L/km = ${N(Math.round(1/e*1000)/1000)}L = ${N(Math.round(1000/e))}ml. (km/L의 역수가 L/km)`};},
    ()=>{const d1=cpick([60,90,120]),f1=cpick([5,6,8,10]),d2=cpick([80,100,150]),f2=cpick([8,10,12]);
      return {kind:'num',html:`A→B 구간 <b>${d1}km</b>에 연료 <b>${f1}L</b>, B→C 구간 <b>${d2}km</b>에 연료 <b>${f2}L</b>를 썼다. 전체 구간의 주행 연비는? (소수 둘째 자리까지)`,ans:(d1+d2)/(f1+f2),unit:'km/L',tol:.01,
        why:`전체 연비 = 총 거리 ÷ 총 연료 = (${d1}+${d2}) ÷ (${f1}+${f2}) = ${d1+d2} ÷ ${f1+f2} = ${N(Math.round((d1+d2)/(f1+f2)*100)/100)}km/L. 구간 연비의 단순 평균이 아니다.`};},
    ()=>{const f=cpick(Object.keys(FUEL));const cost=cpick([12000,18000,24000,30000]);const e=cpick([10,12,15,20]);
      return {kind:'num',html:`${f} 자동차(연비 <b>${e}km/L</b>)에 연료비로 <b>${N(cost)}원</b>을 썼다. 주행거리는? (${f} ${N(FUEL[f])}원/L)`,ans:cost/FUEL[f]*e,unit:'km',
        why:`연료 = ${N(cost)} ÷ ${N(FUEL[f])} = ${N(cost/FUEL[f])}L → 거리 = ${N(cost/FUEL[f])} × ${e} = ${N(cost/FUEL[f]*e)}km`};},
  ]},
};
/* =====================================================================
   비중 확인 도구 6가지 (교재 76~77쪽 형식: 부분/전체 표 + "비중은 N% 이상이다" 정오판단)
   숫자는 기준선 근처(±2~12%)로 만들어 도구 없이는 애매하게 한다.
   ===================================================================== */
const RCTX=[ // 부분/전체 문맥
  {p:'부채',w:'자산',u:'억원',col:'회사',s:c=>`${c}의 자산 대비 부채 비율은`},
  {p:'확정건수',w:'신청건수',u:'건',col:'분야',s:c=>`${c}의 신청건수 대비 확정건수의 비율은`},
  {p:'사망자',w:'사상자',u:'명',col:'지역',s:c=>`${c}의 사상자 중 사망자의 비율은`},
  {p:'현금자산',w:'유동자산',u:'억원',col:'회사',s:c=>`${c}의 유동자산 중 현금자산의 비율은`},
  {p:'검거건수',w:'발생건수',u:'건',col:'범죄',s:c=>`${c}의 발생건수 대비 검거건수의 비율은`},
  {p:'수출액',w:'총매출액',u:'백만원',col:'기업',s:c=>`${c}의 총매출액 중 수출액의 비중은`},
  {p:'여성 임원',w:'전체 임원',u:'명',col:'기관',s:c=>`${c}의 전체 임원 중 여성 임원의 비율은`},
  {p:'재생에너지',w:'총발전량',u:'GWh',col:'국가',s:c=>`${c}의 총발전량 중 재생에너지 비중은`},
];
const RCTX2=[ // 관계성: 두 부분으로 나뉘는 문맥
  {a:'남학생',b:'여학생',u:'명',col:'학교',s:c=>`${c} 학생 중 남학생의 비율은`},
  {a:'찬성',b:'반대',u:'명',col:'지역',s:c=>`${c} 응답자 중 찬성의 비율은`},
  {a:'국내 매출',b:'해외 매출',u:'억원',col:'회사',s:c=>`${c}의 전체 매출 중 국내 매출의 비중은`},
  {a:'정규직',b:'비정규직',u:'명',col:'기업',s:c=>`${c}의 근로자 중 정규직의 비율은`},
];
const COLS=(n,label)=>['A','B','C','D','E','F'].slice(0,n).map(x=>`${x}${label}`);
// 전체값(4~5자리 자연스러운 수)과 기준선 근처 부분값
const genWhole=()=>cpick([CR(1200,9800),CR(10500,89900)]);
const nearRatio=th=>{const sign=Math.random()<.5?-1:1;return th*(1+sign*(CR(2,12)/100));};
const pct1=x=>Nd((Math.round(x*10)/10).toString())+'%';
// 표 + 문장 공통 조립
function ratioQ(ctx,n,th,fn,why,opt={}){
  const cols=COLS(n,ctx.col);const rows=cols.map(()=>{const w=genWhole();const p=Math.round(w*nearRatio(th)/100);return {p,w};});
  const i=CR(0,n-1),{p,w}=rows[i];const r=p/w*100;
  if(Math.abs(r-th)<0.15)rows[i].p+=Math.round(w*0.01); // 거의 같으면 살짝 띄움
  const r2=rows[i].p/w*100;const ans=r2>=th;
  const tbl=htable(['',...cols],[[`${ctx.p}(${ctx.u})`,...rows.map(x=>N(x.p))],[`${ctx.w}(${ctx.u})`,...rows.map(x=>N(x.w))]]);
  return {kind:'ox',html:`${tbl}${ctx.s(cols[i])} <b>${th}% 이상</b>이다.`,ans,why:why(rows[i].p,w,th,ans)+` (실제 ${pct1(r2)})`};
}
Object.assign(PRACTICE,{
  pretty:{name:'예쁜 배율',icon:'①',color:'var(--orange)',desc:'20%=5배 · 25%=4배 · 50%=2배',group:'ratio',tpl:[
    ()=>{const th=cpick([20,25,50]),k={20:5,25:4,50:2}[th];
      return ratioQ(cpick(RCTX),cpick([3,4]),th,null,(p,w,th,ans)=>`${th}% 이상인지 = 전체가 부분의 ${k}배가 <b>안 되는지</b>. ${N(p)} × ${k} = ${N(p*k)} vs 전체 ${N(w)} → 전체가 ${w<p*k?'더 작으니 '+k+'배가 안 됨':'더 크니 '+k+'배가 넘음'} → ${th}% ${ans?'이상 O':'미만 X'}`);},
  ]},
  digits:{name:'수 배열',icon:'②',color:'var(--orange)',desc:'10%=수배열 · 15%=수배열의 1.5배',group:'ratio',tpl:[
    ()=>{const th=cpick([10,15,15]);
      return ratioQ(cpick(RCTX),cpick([3,4]),th,null,(p,w,th,ans)=>th===10
        ?`10% 이상인지 = 부분의 수 배열(×10)이 전체보다 큰지. ${N(p)} → ${N(p*10)} vs ${N(w)} → ${p*10>=w?'크다':'작다'} → ${ans?'10% 이상 O':'10% 미만 X'}`
        :`15% 이상인지 = 부분의 수 배열(×10)이 전체의 1.5배 이상인지. ${N(p*10)} vs ${N(w)} × 1.5 = ${N(w*1.5)} → ${p*10>=w*1.5?'이상':'미만'} → ${ans?'15% 이상 O':'15% 미만 X'}`);},
  ]},
  relation:{name:'관계성',icon:'③',color:'var(--orange)',desc:'전체가 없을 때: 나머지와 몇 배인지',group:'ratio',tpl:[
    ()=>{const ctx=cpick(RCTX2);const th=cpick([20,40,50,60,80,90]);const n=cpick([4,5,6]);const cols=COLS(n,ctx.col);
      const rows=cols.map(()=>{const x=cpick([CR(300,2500),CR(3000,19000)]);const a=Math.round(x*nearRatio(th)/100);return {a,b:x-a};});
      const i=CR(0,n-1),{a,b}=rows[i];const r=a/(a+b)*100;const ans=r>=th;
      const rule={20:`B(나머지)가 A의 4배가 안 되는지: ${N(a)}×4=${N(a*4)} vs ${N(b)}`,40:`나머지가 A의 1.5배가 안 되는지: ${N(a)}×1.5=${N(a*1.5)} vs ${N(b)}`,50:`A가 나머지보다 큰지: ${N(a)} vs ${N(b)}`,60:`A가 나머지의 1.5배 이상인지: ${N(b)}×1.5=${N(b*1.5)} vs ${N(a)}`,80:`A가 나머지의 4배 이상인지: ${N(b)}×4=${N(b*4)} vs ${N(a)}`,90:`A가 나머지의 9배 이상인지: ${N(b)}×9=${N(b*9)} vs ${N(a)}`}[th];
      const tbl=htable(['',...cols],[[`${ctx.a}(${ctx.u})`,...rows.map(x=>N(x.a))],[`${ctx.b}(${ctx.u})`,...rows.map(x=>N(x.b))]]);
      return {kind:'ox',html:`${tbl}${ctx.s(cols[i])} <b>${th}% 이상</b>이다.`,ans,why:`전체(${N(a+b)})를 구하지 말고 두 부분의 배수로 본다. ${th}% 이상인지 = ${rule} → ${ans?'이상 O':'미만 X'} (실제 ${pct1(r)})`};},
  ]},
  split:{name:'수 쪼개기',icon:'④',color:'var(--orange)',desc:'앞자리 분수 + 나머지 분수로 나눠 보기',group:'ratio',tpl:[
    ()=>{const th=cpick([30,40,45,55,60,65,70]);
      return ratioQ(cpick(RCTX),cpick([3,4]),th,null,(p,w,th,ans)=>{const unit=w>=10000?1000:100;const w0=Math.floor(w/unit)*unit,wr=w-w0;const need0=w0*th/100,needr=wr*th/100;
        return `전체를 ${N(w0)} + ${N(wr)}로 쪼갠다. ${N(w0)}의 ${th}% = ${N(need0)}, ${N(wr)}의 ${th}% = ${N(Math.round(needr*10)/10)} → 합 ${N(Math.round((need0+needr)*10)/10)} vs 부분 ${N(p)} → ${ans?'부분이 크니 이상 O':'부분이 작으니 미만 X'}`;});},
  ]},
  ideal:{name:'이상적인 수',icon:'⑤',color:'var(--orange)',desc:'2/3·3/4 같은 예쁜 분수와 비교',group:'ratio',tpl:[
    ()=>{const ctx=cpick(RCTX);const n=cpick([3,4]);const cols=COLS(n,ctx.col);
      const IDEAL=[[1,3,'1/3',33.3],[1,2,'1/2',50],[3,5,'3/5',60],[2,3,'2/3',66.7],[3,4,'3/4',75],[4,5,'4/5',80]];
      const rows=cols.map(()=>{const [a,b,name,val]=cpick(IDEAL);const k=cpick([1,2,3])*1000;const d0=b*k,n0=a*k;
        const side=Math.random()<.5?1:-1;const th=Math.round(val)+side*cpick([2,3,5]); // 이상적 비율 근처의 기준선
        const rem=CR(100,999);const remN=Math.round(rem*(th/100)*(side>0?1-CR(5,20)/100:1+CR(5,20)/100)); // 나머지 분수도 같은 쪽으로
        return {p:n0+Math.min(remN,rem),w:d0+rem,n0,d0,name,val,th};});
      const i=CR(0,n-1),row=rows[i];const r=row.p/row.w*100;const ans=r>=row.th;
      const tbl=htable(['',...cols],[[`${ctx.p}(${ctx.u})`,...rows.map(x=>N(x.p))],[`${ctx.w}(${ctx.u})`,...rows.map(x=>N(x.w))]]);
      const remP=row.p-row.n0,remW=row.w-row.d0;
      return {kind:'ox',html:`${tbl}${ctx.s(cols[i])} <b>${row.th}% 이상</b>이다.`,ans,why:`앞자리로 이상적인 분수를 만든다: ${N(row.n0)}/${N(row.d0)} = ${row.name} ≈ ${pct1(row.val)} → ${row.th}%보다 ${row.val>=row.th?'크다':'작다'}. 나머지 ${N(remP)}/${N(remW)} ≈ ${pct1(remP/remW*100)}도 같은 쪽이므로 전체도 ${ans?'이상 O':'미만 X'} (실제 ${pct1(r)})`};},
  ]},
  twice:{name:'곱하기',icon:'⑥',color:'var(--orange)',desc:'35·45·55·65·75%는 두 배로',group:'ratio',tpl:[
    ()=>{const th=cpick([35,45,55,65,75]),k2=th*2;
      return ratioQ(cpick(RCTX),cpick([4,5]),th,null,(p,w,th,ans)=>`${th}%는 애매하니 두 배로: 부분×2가 전체의 ${k2}%${k2>100?' ('+(k2/100)+'배)':''} 이상인지. ${N(p)}×2 = ${N(p*2)} vs ${N(w)}의 ${k2}% = ${N(Math.round(w*k2/100))} → ${ans?'이상 O':'미만 X'}`);},
  ]},
});
/* ---------- 구성비 · %p (교재 77쪽 예제 01~03 형식) ---------- */
const CCTX=[ // 전체 + 구성 항목
  {tot:'보유세',items:['재산세','도시계획세','공동시설세','종합부동산세'],u:'백만원'},
  {tot:'총지출',items:['인건비','임대료','재료비','기타'],u:'백만원'},
  {tot:'비유동자산',items:['투자자산','유형자산','무형자산','기타자산'],u:'백만원'},
  {tot:'전체 응답자',items:['매우 만족','만족','보통','불만족'],u:'명'},
];
// 비중 s(%)인 항목을 포함해 total을 4개 항목으로 나눔 (항목 합 = total)
function compose(total,idx,s){
  const target=Math.round(total*s/100);let rest=total-target;const parts=[0,0,0,0];parts[idx]=target;
  const others=[0,1,2,3].filter(i=>i!==idx);const w=others.map(()=>CR(2,10));const ws=w.reduce((a,b)=>a+b,0);
  others.forEach((i,k)=>{parts[i]=k<2?Math.round(rest*w[k]/ws):0;});parts[others[2]]=rest-parts[others[0]]-parts[others[1]];
  return parts;
}
const shareWhy=(p,w)=>`${N(p)}/${N(w)} ≈ ${pct1(p/w*100)}`;
Object.assign(PRACTICE,{
  compo:{name:'구성비·%p',icon:'⑦',color:'var(--orange)',desc:'연도별·회사별 구성 표, 비중의 %p 변화',group:'ratio',tpl:[
    // a. 연도별 구성 표 → 특정 연도 항목 비중 N% 이상
    ()=>{const ctx=cpick(CCTX.slice(0,2));const y0=CR(2016,2020);const years=[0,1,2,3].map(i=>String(y0+i));const th=cpick([15,20,25,30,35,40,45,50]);
      const yi=CR(0,3),ii=CR(0,3);const data=years.map((_,y)=>{const total=CR(12000,25000);const s=y===yi?nearRatio(th):CR(8,45);return {total,parts:compose(total,ii,s)};});
      const p=data[yi].parts[ii],w=data[yi].total;const ans=p/w*100>=th;
      const tbl=htable(['',...years],[[ctx.tot,...data.map(d=>N(d.total))],...ctx.items.map((it,i)=>[it,...data.map(d=>N(d.parts[i]))])]);
      return {kind:'ox',html:`(단위: ${ctx.u})${tbl}${years[yi]}년 ${ctx.tot} 중 ${ctx.items[ii]}의 비중은 <b>${th}% 이상</b>이다.`,ans,why:`${shareWhy(p,w)} → ${ans?'이상 O':'미만 X'}. (${th}%는 ${th===20?'전체가 부분의 5배가 안 되는지':th===25?'전체가 부분의 4배가 안 되는지':th===50?'부분×2 vs 전체':th%10===5?'부분×2를 '+th*2+'%와 비교':'수 쪼개기'}로 빠르게)`};},
    // b. 연도별 구성 표 → 항목 비중이 전년대비 N%p 이상 증가
    ()=>{const ctx=cpick(CCTX.slice(0,2));const y0=CR(2016,2020);const years=[0,1,2,3].map(i=>String(y0+i));const th=cpick([5,10,15]);
      const yi=CR(1,3),ii=CR(0,3);const s0=CR(15,40);const s1=s0+th*(1+(Math.random()<.5?-1:1)*CR(15,50)/100);
      const data=years.map((_,y)=>{const total=CR(12000,25000);const s=y===yi?s1:y===yi-1?s0:CR(10,45);return {total,parts:compose(total,ii,s)};});
      const a=data[yi-1],b=data[yi];const sa=a.parts[ii]/a.total*100,sb=b.parts[ii]/b.total*100;const ans=sb-sa>=th;
      const tbl=htable(['',...years],[[ctx.tot,...data.map(d=>N(d.total))],...ctx.items.map((it,i)=>[it,...data.map(d=>N(d.parts[i]))])]);
      return {kind:'ox',html:`(단위: ${ctx.u})${tbl}${years[yi]}년 ${ctx.tot} 중 ${ctx.items[ii]}의 비중은 전년대비 <b>${th}%p 이상</b> 증가했다.`,ans,why:`${years[yi-1]}년 ${shareWhy(a.parts[ii],a.total)}, ${years[yi]}년 ${shareWhy(b.parts[ii],b.total)} → 차이 ${pct1(sb-sa).replace('%','%p')} → ${ans?'이상 O':'미만 X'}. (요령: 전년 비중에 ${th}%p를 더한 ${pct1(sa+th)}와 올해 비중을 비교)`};},
    // c. 회사별 구성 표 → 회사 항목 비중 N% 이상
    ()=>{const ctx=CCTX[2];const cols=COLS(4,'회사');const th=cpick([15,20,25,30,35,40,45,50]);
      const ci=CR(0,3),ii=CR(0,3);const data=cols.map((_,c)=>{const total=CR(80000,250000);const s=c===ci?nearRatio(th):CR(8,45);return {total,parts:compose(total,ii,s)};});
      const p=data[ci].parts[ii],w=data[ci].total;const ans=p/w*100>=th;
      const tbl=htable(['',...cols],[[ctx.tot,...data.map(d=>N(d.total))],...ctx.items.map((it,i)=>[it,...data.map(d=>N(d.parts[i]))])]);
      return {kind:'ox',html:`(단위: ${ctx.u})${tbl}${cols[ci]}의 ${ctx.tot} 중 ${ctx.items[ii]}의 비중은 <b>${th}% 이상</b>이다.`,ans,why:`${shareWhy(p,w)} → ${ans?'이상 O':'미만 X'}`};},
    // d. 회사별 구성 표 → 두 회사 간 비중 차 N%p 이상
    ()=>{const ctx=CCTX[2];const cols=COLS(4,'회사');const th=cpick([5,10,15]);
      const [c1,c2]=cshuffle([0,1,2,3]).slice(0,2);const ii=CR(0,3);const s2=CR(12,40);const s1=s2+th*(1+(Math.random()<.5?-1:1)*CR(15,50)/100);
      const data=cols.map((_,c)=>{const total=CR(80000,250000);const s=c===c1?s1:c===c2?s2:CR(8,45);return {total,parts:compose(total,ii,s)};});
      const a=data[c1],b=data[c2];const sa=a.parts[ii]/a.total*100,sb=b.parts[ii]/b.total*100;const ans=sa-sb>=th;
      const tbl=htable(['',...cols],[[ctx.tot,...data.map(d=>N(d.total))],...ctx.items.map((it,i)=>[it,...data.map(d=>N(d.parts[i]))])]);
      return {kind:'ox',html:`(단위: ${ctx.u})${tbl}${cols[c1]}의 ${ctx.tot} 중 ${ctx.items[ii]}의 비중은 ${cols[c2]} 대비 <b>${th}%p 이상</b> 높다.`,ans,why:`${cols[c1]} ${shareWhy(a.parts[ii],a.total)}, ${cols[c2]} ${shareWhy(b.parts[ii],b.total)} → 차이 ${pct1(sa-sb).replace('%','%p')} → ${ans?'이상 O':'미만 X'}. (요령: ${cols[c2]} 비중에 ${th}%p를 더한 ${pct1(sb+th)}와 비교)`};},
    // e. 검거/발생 연도별 → 비중의 전년대비 N%p 증가
    ()=>{const y0=CR(2016,2020);const years=[0,1,2,3].map(i=>String(y0+i));const th=cpick([5,10,15,20]);const yi=CR(1,3);
      const s0=CR(35,60);const s1=s0+th*(1+(Math.random()<.5?-1:1)*CR(15,50)/100);
      const data=years.map((_,y)=>{const w=CR(3500,9800);const s=y===yi?s1:y===yi-1?s0:CR(35,75);return {w,p:Math.round(w*s/100)};});
      const a=data[yi-1],b=data[yi];const sa=a.p/a.w*100,sb=b.p/b.w*100;const ans=sb-sa>=th;
      const tbl=htable(['',...years],[['검거건수(건)',...data.map(d=>N(d.p))],['발생건수(건)',...data.map(d=>N(d.w))]]);
      return {kind:'ox',html:`${tbl}${years[yi]}년 발생건수 대비 검거건수의 비중은 전년대비 <b>${th}%p 이상</b> 증가했다.`,ans,why:`${years[yi-1]}년 ${shareWhy(a.p,a.w)}, ${years[yi]}년 ${shareWhy(b.p,b.w)} → 차이 ${pct1(sb-sa).replace('%','%p')} → ${ans?'이상 O':'미만 X'}. (요령: 전년 비중 + ${th}%p = ${pct1(sa+th)} 와 올해 비중 비교, 또는 올해 분모의 ${pct1(sa+th)}를 분자와 비교)`};},
  ]},
});
PRACTICE.fx.group=PRACTICE.perx.group=PRACTICE.speed.group=PRACTICE.fuel.group='unit';
const PGROUPS=[{id:'unit',name:'분수 단위',desc:'환율·X명당·시속·연비'},{id:'ratio',name:'비중 확인 도구 (교재 76~77쪽)',desc:'기준선 근처 숫자를 도구로 빠르게 판정'}];
const PTOPICS=Object.keys(PRACTICE);
