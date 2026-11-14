const app = document.querySelector('#app');
const icons = {
 arrow:'<path d="M4 12h15m-5-5 5 5-5 5"/>',
 check:'<path d="m5 12 4 4L19 6"/>',
 shield:'<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6z"/><path d="m8 12 3 3 5-6"/>',
 globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c5 5 5 13 0 18-5-5-5-13 0-18"/>',
 server:'<rect x="4" y="3" width="16" height="7" rx="2"/><rect x="4" y="14" width="16" height="7" rx="2"/><path d="M8 6.5h.01M8 17.5h.01M12 7h4m-4 11h4"/>',
 spark:'<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5zM20 2v4m-2-2h4"/>',
 layers:'<path d="m12 3 10 5-10 5L2 8zM3 12l9 5 9-5M3 16l9 5 9-5"/>',
 log:'<path d="M6 3h12v18H6zM9 7h6m-6 5h6m-6 5h4"/>',
 lock:'<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2"/>',
 info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5m0-9h.01"/>',
 menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
 back:'<path d="M20 12H5m5-5-5 5 5 5"/>'
};
const icon = name => `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]||icons.shield}</svg>`;
const brand=()=>'<span class="brand"><span class="brand-mark" aria-hidden="true"><i></i><i></i></span><span>xWAF<span class="brand-dot">.</span></span></span>';
let disposeConsole;
let currentPage='';
let selectedStep=0;
let pendingDomain='';
let routeSequence=0;

function renderLanding(){
 app.innerHTML=`
 <header class="site-header"><div class="wrap header-inner">
 <a href="#/" aria-label="xWAF 홈">${brand()}</a><span class="brand-small">CLOUD<br>WEB SECURITY</span>
 <nav class="header-nav" id="header-nav" aria-label="주요 메뉴"><a href="#features">핵심 기능</a><a href="#how-it-works">연결 방법</a><a href="#faq">자주 묻는 질문</a></nav>
 <div class="header-actions"><a href="#/login">로그인</a><a href="#/login" class="btn btn-sm">시작하기 ${icon('arrow')}</a></div>
 <button class="menu-button" aria-label="메뉴 열기" aria-expanded="false" aria-controls="header-nav">${icon('menu')}</button>
 </div></header>
 <main id="main">
 <section class="hero"><div class="wrap hero-grid">
 <div class="hero-text"><div class="eyebrow"><span class="status-dot"></span>AI POWERED CLOUD WAF</div>
 <h1>도메인을 연결하면,<br><em>웹 보안</em>이<br>시작됩니다.</h1>
 <p class="hero-copy">웹사이트와 원본 서버를 등록하고 CNAME으로 연결하세요.<br>xWAF가 웹사이트 앞에서 공격을 탐지하고 차단합니다.</p>
 <div class="hero-buttons"><a class="btn" href="#/app/connect">내 도메인 연결하기 ${icon('arrow')}</a><a class="btn btn-outline" href="#/app/overview">콘솔 미리보기</a></div>
 <div class="hero-benefits"><span>${icon('check')}간편한 CNAME 연결</span><span>${icon('check')}도메인별 보안 정책</span><span>${icon('check')}Powered by PLURA</span></div>
 <p class="hero-note">도메인 확인과 HTTPS 준비를 마친 뒤, DNS 연결 확인 후 보호를 시작합니다.</p></div>
 <div class="hero-preview"><div class="protection-card">
 <div class="preview-toolbar"><div class="window-dots"><i></i><i></i><i></i></div><span class="preview-label"><span class="status-dot"></span>YOUR SECURITY, CONNECTED</span></div>
 <div class="preview-body"><div class="preview-domain"><span class="domain-icon">${icon('globe')}</span><div>www.example.com<small>웹사이트 보안 상태</small></div><span class="pill"><span class="status-dot"></span>보호 중 · 예시</span></div>
 <div class="routing-visual" role="img" aria-label="방문자의 정상 요청은 xWAF를 거쳐 원본 서버로 전달되고 공격 요청은 xWAF에서 차단됩니다. 구성 예시입니다."><div class="route-end"><span class="circle">${icon('globe')}</span>방문자</div><div class="route-line"></div><div class="route-center">${icon('shield')}<span>xWAF</span></div><div class="route-line right"></div><div class="route-end"><span class="circle">${icon('server')}</span>원본 서버</div><div class="route-blocked">공격 요청 차단</div></div>
 <div class="traffic-mini"><div><small>분석한 웹 요청</small><strong>128,430</strong></div><div><small>차단한 위협</small><strong>1,284</strong></div><svg class="sparkline" viewBox="0 0 78 35" fill="none" aria-hidden="true"><path d="M1 28 10 22 16 25 25 13 33 19 42 7 50 14 58 8 66 12 77 2" stroke="currentColor" stroke-width="2"/></svg></div>
 <div class="activity-line">${icon('shield')}<span>SQL Injection 탐지</span><strong>요청 차단</strong></div>
 <div class="activity-line">${icon('lock')}<span>HTTPS 연결 확인</span><strong>정상 연결</strong></div>
 </div></div><div class="preview-caption"><span>샘플 데이터 · 실제 트래픽과 무관한 화면 예시</span><span>Powered by PLURA</span></div></div>
 </div></section>
 <div class="wrap under-hero"><span>BUILT FOR YOUR WEB</span><strong>기업 웹사이트</strong><strong>온라인 서비스</strong><strong>API 서비스</strong><strong>여러 도메인을 운영하는 팀</strong></div>

 <section class="section" id="features"><div class="wrap"><div class="section-head"><div><div class="eyebrow">SECURITY WITH CONTEXT</div><h2>공격은 막고,<br>판단의 근거는 남깁니다.</h2></div><p class="section-description">웹 요청을 깊이 살펴보고, 서비스에 맞게 대응하세요.<br>PLURA의 보안 기술을 간편한 클라우드 경험으로 제공합니다.</p></div>
 <div class="feature-grid">
 <article class="feature-item"><div class="feature-icon">${icon('shield')}</div><h3>웹 공격은 앞에서 차단</h3><p>SQL Injection, XSS 등 웹 공격을 분석하고 설정한 보안 정책에 따라 차단합니다.</p><span class="feature-number">01 / PROTECT</span></article>
 <article class="feature-item"><div class="feature-icon">${icon('spark')}</div><h3>AI로 공격 의도까지 분석</h3><p>원본 웹 요청과 응답을 바탕으로 우회형 페이로드와 의심스러운 흐름을 분석합니다.</p><span class="feature-number">02 / ANALYZE</span></article>
 <article class="feature-item"><div class="feature-icon">${icon('layers')}</div><h3>도메인마다 알맞은 보호</h3><p>여러 웹사이트의 연결 상태와 원본 서버, 보안 정책을 한곳에서 관리합니다.</p><span class="feature-number">03 / CONTROL</span></article>
 <article class="feature-item"><div class="feature-icon">${icon('log')}</div><h3>명확하게 남기는 공격 근거</h3><p>탐지·차단 내역을 확인하고 PLURA-XDR 연계로 공격의 흐름을 이어서 살펴봅니다.</p><span class="feature-number">04 / UNDERSTAND</span></article>
 </div></div></section>

 <section class="section how-section" id="how-it-works"><div class="wrap"><div class="how-header"><div><div class="eyebrow">FROM DOMAIN TO DEFENSE</div><h2>복잡한 도입 과정은 줄이고,<br>세 단계로 연결하세요.</h2></div><a href="#/app/connect" class="text-link">연결 과정 체험 ${icon('arrow')}</a></div>
 <div class="steps-layout"><div class="step-list" role="tablist" aria-label="xWAF 연결 단계">
 <button class="step-tab active" data-step="0" role="tab" aria-selected="true" aria-controls="step-panel" id="step-tab-0"><span class="step-num">1</span><span><h3>보호할 웹사이트를 등록하세요</h3><p>도메인과 원본 서버 주소를 입력합니다.<br>도메인 확인과 HTTPS 연결을 준비합니다.</p></span></button>
 <button class="step-tab" data-step="1" role="tab" aria-selected="false" aria-controls="step-panel" id="step-tab-1" tabindex="-1"><span class="step-num">2</span><span><h3>DNS에 CNAME을 연결하세요</h3><p>기존 DNS에서 안내된 레코드를 등록합니다.<br>네임서버 전체를 바꾸지 않아도 됩니다.</p></span></button>
 <button class="step-tab" data-step="2" role="tab" aria-selected="false" aria-controls="step-panel" id="step-tab-2" tabindex="-1"><span class="step-num">3</span><span><h3>연결 확인 후 보호를 시작하세요</h3><p>연결·인증서·보안 정책 상태를 확인하고,<br>웹사이트의 보안 현황을 살펴보세요.</p></span></button>
 </div><div class="step-demo" id="step-panel" role="tabpanel" aria-labelledby="step-tab-0" tabindex="0"></div></div>
 <p class="how-footnote">일반 서브도메인의 연결 예시입니다. 루트 도메인은 DNS 제공자의 지원 방식을 먼저 확인합니다.</p>
 </div></section>

 <section class="section console-section"><div class="wrap console-intro"><div><div class="eyebrow">ONE CONSOLE. EVERY DOMAIN.</div><h2>웹사이트는 여러 개여도,<br>관리는 한곳에서.</h2><p>회사 홈페이지부터 서비스와 API까지.<br>도메인마다 다른 보안 설정을 하나의 콘솔에서 관리하세요.</p><ul class="benefit-list"><li>${icon('check')}도메인별 연결·인증서 상태 확인</li><li>${icon('check')}탐지 모드와 차단 모드 설정</li><li>${icon('check')}공격 이벤트와 원본 요청 확인</li></ul><div class="console-cta"><a href="#/app/overview" class="text-link">내 보안 콘솔 둘러보기 ${icon('arrow')}</a></div></div>
 <div class="console-shot"><div class="shot-header">${icon('layers')}<strong>내 도메인</strong><span class="pill">화면 예시</span></div><div class="shot-body"><div class="shot-domainrow">${icon('globe')}<div>www.example.com<small>홈페이지 · 차단 모드</small></div><span class="pill">보호 중</span></div><div class="shot-domainrow">${icon('globe')}<div>app.example.com<small>웹 서비스 · 차단 모드</small></div><span class="pill">보호 중</span></div><div class="shot-domainrow">${icon('globe')}<div>api.example.com<small>API · 탐지 모드</small></div><span class="pill">탐지 중</span></div><div class="shot-chart"><span class="shot-chart-label">웹 요청 추이 · 샘플 데이터</span><svg viewBox="0 0 430 70" preserveAspectRatio="none" fill="none" aria-hidden="true"><path d="m0 58 16-8 13 5 17-19 14 10 14-14 16 5 20-13 15 9 16-15 14 7 16-14 16 5 14-12 20 7 16-9 17 6 16-9 20 9 18-14 17 7 15-5 17 6 20-10 16 4 13-6v60H0z" fill="#e1edcd"/><path d="m0 58 16-8 13 5 17-19 14 10 14-14 16 5 20-13 15 9 16-15 14 7 16-14 16 5 14-12 20 7 16-9 17 6 16-9 20 9 18-14 17 7 15-5 17 6 20-10 16 4 13-6" stroke="#83a75a" stroke-width="1.5"/></svg></div></div></div>
 </div></section>

 <section class="evidence-section"><div class="wrap evidence-grid"><div><div class="eyebrow">POWERED BY PLURA</div><h2>웹에서 막고,<br>서버에서 확인합니다.</h2><p>xWAF에서 시작한 보안 분석을 PLURA-XDR로 확장하세요.<br>웹 요청과 서버 내부 행위를 함께 살펴보면 공격의 흐름이 보입니다.</p></div><div><div class="product-chain"><div class="product-node active">xWAF<small>웹 공격 탐지·차단</small></div><span class="chain-arrow">+</span><div class="product-node">PLURA-EDR<small>서버 내부 행위 분석</small></div><span class="chain-arrow">→</span><div class="product-node">PLURA-XDR<small>통합 분석·대응</small></div></div><div class="edr-note">${icon('info')}<span>웹셸 생성·실행 및 침투 이후 서버 내부 행위 대응을 위해<br>해당 웹서버에 PLURA-EDR 설치가 필요합니다.</span></div></div></div></section>

 <section class="section" id="faq"><div class="wrap faq-layout"><div class="faq-intro"><div class="eyebrow">GOOD TO KNOW</div><h2>시작하기 전에,<br>궁금한 점을 확인하세요.</h2><p>웹 보안의 시작을 더 간단하게.</p></div><div class="faq-list">
 <details><summary>도메인을 등록하면 바로 보호되나요?</summary><p>도메인 소유권, HTTPS 인증서, 원본 서버 연결과 보안 정책 준비가 완료되어야 합니다. 안내된 CNAME을 DNS에 등록하고 연결이 확인되면 보호를 시작할 수 있습니다. 콘솔에서 각 단계의 상태를 확인합니다. 이 사이트의 콘솔은 설정 흐름을 체험하는 미리보기입니다.</p></details>
 <details><summary>기존 DNS 서비스를 바꿔야 하나요?</summary><p>기존 DNS 서비스를 유지하면서 보호할 호스트에 CNAME을 설정하는 방식입니다. 네임서버 전체를 변경할 필요는 없습니다. 루트 도메인은 DNS 제공자의 지원 방식에 따라 별도 확인이 필요합니다.</p></details>
 <details><summary>서버에 프로그램을 설치해야 하나요?</summary><p>xWAF 이용을 위해 고객 서버에 웹방화벽 프로그램을 설치할 필요는 없습니다. 웹 트래픽이 xWAF를 거쳐 원본 서버로 전달됩니다. 다만 웹셸 생성·실행과 침투 이후 서버 내부 행위까지 대응하려면 웹서버에 PLURA-EDR 설치가 필수입니다. 기존 EDR을 사용 중인 경우에도 PLURA의 원본 로그 수집·분석·대응을 위해 PLURA-EDR 에이전트가 필요합니다.</p></details>
 <details><summary>example.com 같은 루트 도메인도 연결할 수 있나요?</summary><p>루트 도메인은 일반 서브도메인과 연결 방식이 다릅니다. DNS 제공자의 ALIAS·ANAME·CNAME Flattening 지원 여부와 서비스에서 지원하는 연결 방식을 먼저 확인해야 합니다. 도메인 등록 화면에서 루트 도메인을 선택하면 별도 안내를 확인할 수 있습니다.</p></details>
 <details><summary>여러 도메인을 함께 관리할 수 있나요?</summary><p>도메인을 추가하고 각각의 원본 서버, 연결 상태와 보안 정책을 관리하는 구조입니다. 웹사이트 특성에 맞게 탐지·차단 정책을 설정하고 전체 상태는 대시보드에서 확인할 수 있습니다.</p></details>
 </div></div></section>
 <section class="final-cta"><div class="wrap"><div class="cta-box"><div><h2>다음 연결은, 더 안전하게.</h2><p>도메인 하나를 등록하는 것으로 시작하세요.</p></div><a class="btn" href="#/app/connect">내 도메인 연결하기 ${icon('arrow')}</a></div></div></section>
 </main><footer class="site-footer"><div class="wrap footer-inner"><a href="#/" aria-label="xWAF 홈">${brand()}</a><span class="powered-label">Powered by <strong>PLURA</strong></span><div class="footer-right"><a href="https://xwaf.io/ko/" target="_blank" rel="noopener">xWAF 공식 사이트 ↗</a><span>© 2026 Qubit Security Inc.</span></div></div></footer><div class="preview-ribbon"><span class="status-dot"></span>인터랙티브 프리뷰 · 실제 보호는 연동 후 제공</div>`;
 updateStep(selectedStep);
 app.querySelector('.menu-button').addEventListener('click',e=>{let b=e.currentTarget;let on=b.getAttribute('aria-expanded')!=='true';b.setAttribute('aria-expanded',String(on));b.setAttribute('aria-label',on?'메뉴 닫기':'메뉴 열기');document.querySelector('#header-nav').classList.toggle('open',on)});
 app.querySelectorAll('.step-tab').forEach((button,index)=>{
 button.addEventListener('click',()=>updateStep(index));
 button.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(e.key))return;e.preventDefault();const n=e.key==='Home'?0:e.key==='End'?2:(index+(['ArrowRight','ArrowDown'].includes(e.key)?1:2))%3;updateStep(n);app.querySelector(`[data-step="${n}"]`).focus()});
 });
 app.querySelectorAll('.header-nav a').forEach(a=>a.addEventListener('click',()=>{document.querySelector('#header-nav').classList.remove('open');document.querySelector('.menu-button').setAttribute('aria-expanded','false')}));
}

function updateStep(step){
 selectedStep=step;
 app.querySelectorAll('.step-tab').forEach((b,i)=>{b.classList.toggle('active',i===step);b.setAttribute('aria-selected',String(i===step));b.tabIndex=i===step?0:-1});
 const panel=app.querySelector('#step-panel');if(!panel)return;
 panel.setAttribute('aria-labelledby',`step-tab-${step}`);
 const contents=[
 `<div class="demo-topline">${icon('globe')}<strong>웹사이트 등록</strong><span class="pill">STEP 01 · 예시</span></div><span class="demo-formlabel">보호할 도메인</span><div class="demo-value"><span class="mono">www.example.com</span><span class="badge-grey">도메인</span></div><span class="demo-formlabel">원본 서버 주소</span><div class="demo-value"><span class="mono">origin.example.com</span><span class="badge-grey">HTTPS · 443</span></div><div class="demo-fineprint">서비스가 운영되는 원본 주소를 입력하세요.<br>연결을 전환하기 전에 소유권과 HTTPS를 준비합니다.</div><div class="demo-cta">도메인 확인 및 연결 준비</div>`,
 `<div class="demo-topline">${icon('layers')}<strong>DNS 연결</strong><span class="pill">STEP 02 · 예시</span></div><p class="demo-fineprint">기존 DNS 관리 화면에서 아래 레코드를 설정합니다.</p><div class="connect-field"><span>유형</span><code>CNAME</code><span>이름</span><code>www.example.com</code><span>대상</span><code>tenant-demo.edge.xwaf.example</code><span>TTL</span><code>300</code></div><p class="demo-fineprint">체험용 예시 주소입니다. 실제 DNS에는 등록하지 마세요.<br>실제 연결 대상은 서비스에서 발급합니다.</p>`,
 `<div class="demo-topline">${icon('shield')}<strong>보호 상태 확인</strong><span class="pill">STEP 03 · 예시</span></div><div class="mini-success"><span class="big-check">${icon('check')}</span><h3>모든 연결이 준비되면</h3><p>웹사이트 보호를 시작할 수 있습니다.</p></div><div class="mini-checkrow">${icon('check')}<span>DNS · 원본 서버 연결</span><small>확인 완료 · 예시</small></div><div class="mini-checkrow">${icon('check')}<span>HTTPS · 보안 정책 적용</span><small>준비 완료 · 예시</small></div><p class="demo-fineprint">인증서와 정책을 포함한 모든 준비 상태를 확인합니다.</p>`
 ];
 panel.innerHTML=contents[step];
}

function renderLogin(){
 app.innerHTML=`<main id="main" class="login-page"><aside class="login-story"><a href="#/" aria-label="xWAF 홈">${brand()}</a><div><div class="eyebrow" style="color:#caf475;margin-top:30px">YOUR NEXT LAYER OF SECURITY</div><h1>연결은 간단하게.<br>보안은 더 단단하게.</h1><p>도메인 연결부터 보안 정책 관리까지,<br>xWAF의 새로운 서비스 경험을 확인하세요.</p><div class="login-orbit">${icon('shield')}</div></div><span class="powered-label">Powered by <strong>PLURA</strong></span></aside><section class="login-main"><a class="login-back" href="#/">${icon('back')}홈으로 돌아가기</a><div class="login-card"><div class="eyebrow"><span class="status-dot"></span>INTERACTIVE PREVIEW</div><h2>xWAF 콘솔 미리보기</h2><p>로그인 후 만나게 될 내 보안 콘솔을<br>체험 계정으로 먼저 둘러보세요.</p><div class="login-option">${icon('layers')}<h3>나의 웹 보안 워크스페이스</h3><p>샘플 도메인으로 대시보드를 살펴보고,<br>새 도메인을 연결하는 과정을 체험할 수 있습니다.</p><a href="#/app/overview" class="btn">체험 콘솔 열기 ${icon('arrow')}</a></div><div class="login-route-options"><button id="start-empty">첫 도메인부터 시작하기 ${icon('arrow')}</button></div><p class="login-note">${icon('info')}<span>실제 계정을 생성하거나 인증하지 않는 체험 화면입니다.<br>입력한 설정은 이 브라우저에만 저장되며, 실제 DNS나 보안 정책에 반영되지 않습니다.</span></p></div></section></main>`;
 document.querySelector('#start-empty').textContent='도메인 연결 과정 체험하기 →';
 document.querySelector('#start-empty').addEventListener('click',()=>{location.hash='/app/connect'});
}

async function route(){
 const thisRoute=++routeSequence;
 const hash=location.hash||'#/';
 const isSection=['#features','#how-it-works','#faq'].includes(hash);
 const next=hash.startsWith('#/app/')?'console':hash==='#/login'?'login':'landing';
 if(next==='landing'&&currentPage==='landing'&&isSection){app.querySelector(hash)?.scrollIntoView({behavior:'smooth'});return}
 if(disposeConsole){disposeConsole();disposeConsole=null}
 currentPage=next;
 document.body.classList.toggle('in-console',next==='console');
 if(next==='console'){
 const view=hash.slice('#/app/'.length).split('?')[0]||'overview';
 document.title='xWAF 콘솔 — 서비스 체험';
 const {mountConsole}=await import('./console.js');
 if(thisRoute!==routeSequence)return;
 disposeConsole=mountConsole(app,{view,initialDomain:pendingDomain});pendingDomain='';
 }else if(next==='login'){document.title='xWAF — 콘솔 미리보기';renderLogin()}
 else{document.title='xWAF — 도메인 연결로 시작하는 웹 보안';renderLanding()}
 window.scrollTo(0,0);
 if(isSection)requestAnimationFrame(()=>app.querySelector(hash)?.scrollIntoView());
}
window.addEventListener('hashchange',route);
document.querySelector('.skip-link').addEventListener('click',event=>{
 event.preventDefault();
 const main=app.querySelector('main')||app;
 main.setAttribute('tabindex','-1');
 main.focus({preventScroll:true});
 main.scrollIntoView();
});
route();
