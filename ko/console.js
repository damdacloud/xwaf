const STORE_KEY = 'xwaf-console-demo-v1';
const DRAFT_KEY = 'xwaf-console-draft-v1';
const defaults = { managed: true, injection: true, xss: true, login: true, rate: false };
const seed = () => ({
  domains: [
    { id: 'studio-web', hostname: 'www.studio.example', origin: 'origin.studio.example', protocol: 'https', port: '443', apex: false, connection: 'active', mode: 'block', cname: 'studio-web.edge.xwaf.example', rules: { ...defaults }, requests: '892,461', blocked: '1,928', created: '2026-11-14', sample: true },
    { id: 'studio-api', hostname: 'api.studio.example', origin: 'api-origin.studio.example', protocol: 'https', port: '443', apex: false, connection: 'active', mode: 'monitor', cname: 'studio-api.edge.xwaf.example', rules: { ...defaults, rate: true }, requests: '393,827', blocked: '919', created: '2026-11-14', sample: true },
    { id: 'atelier-shop', hostname: 'shop.atelier.example', origin: '203.0.113.10', protocol: 'https', port: '443', apex: false, connection: 'dns_pending', mode: 'block', cname: 'atelier-shop.edge.xwaf.example', rules: { ...defaults }, requests: '—', blocked: '—', created: '2026-11-14', sample: true }
  ],
  settings: { email: '', attacks: true, connection: true, summary: false }
});
const events = [
  { id: 'evt01', time: '14:32:06', domain: 'www.studio.example', name: 'SQL Injection', category: 'injection', action: '차단', ip: '203.0.113.42', method: 'POST', path: '/api/search', rule: 'SQL 구문 삽입 패턴', payload: "q=' OR 1=1 --", note: '입력값에 포함된 SQL 구문 패턴을 탐지한 예시입니다.' },
  { id: 'evt02', time: '14:31:48', domain: 'www.studio.example', name: 'Cross-site Scripting', category: 'xss', action: '차단', ip: '198.51.100.25', method: 'GET', path: '/search', rule: '스크립트 삽입 패턴', payload: 'q=<script>alert("example")</script>', note: '검색 요청에 스크립트가 포함된 상황을 보여 줍니다.' },
  { id: 'evt03', time: '14:30:12', domain: 'api.studio.example', name: '반복 로그인 시도', category: 'login', action: '탐지', ip: '192.0.2.16', method: 'POST', path: '/auth/login', rule: '로그인 반복 시도', payload: '{ "username": "demo-user", "password": "[표시 제외]" }', note: '모니터링 모드에서는 요청을 차단하지 않고 탐지 내역을 기록합니다.' },
  { id: 'evt04', time: '14:28:57', domain: 'www.studio.example', name: '민감 경로 접근', category: 'managed', action: '차단', ip: '198.51.100.84', method: 'GET', path: '/.env', rule: '민감 파일 접근', payload: 'GET /.env HTTP/1.1', note: '환경설정 파일 경로로 접근하는 요청의 예시입니다.' },
  { id: 'evt05', time: '14:26:32', domain: 'api.studio.example', name: '요청 빈도 초과', category: 'rate', action: '탐지', ip: '203.0.113.76', method: 'GET', path: '/v1/products', rule: '요청 빈도 제한', payload: '동일 출발지의 반복 요청 · 임계값 초과 예시', note: '설정한 요청 빈도 기준을 초과한 상황을 보여 줍니다.' },
  { id: 'evt06', time: '14:24:10', domain: 'www.studio.example', name: 'SQL Injection', category: 'injection', action: '차단', ip: '192.0.2.33', method: 'GET', path: '/products', rule: 'SQL 구문 삽입 패턴', payload: 'category=demo&sort=[SQL 패턴 예시]', note: '실제 사용자 요청이 아닌 화면 설명용 이벤트입니다.' }
];
const ruleDetails = [
  ['managed', '기본 웹 공격 보호', '민감 파일 접근과 알려진 웹 공격 패턴을 확인합니다.', 'shield'],
  ['injection', 'SQL Injection', '데이터베이스 명령을 삽입하려는 요청을 탐지합니다.', 'code'],
  ['xss', 'Cross-site Scripting', '입력값에 삽입된 스크립트 패턴을 확인합니다.', 'code'],
  ['login', '반복 로그인 시도', '로그인 요청이 집중되는 패턴을 확인합니다.', 'key'],
  ['rate', '요청 빈도 제한', '동일 출발지에서 반복되는 요청에 기준을 적용합니다.', 'activity']
];

function esc(value = '') { return String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
function readStorage(key, fallback) { try { const val = JSON.parse(localStorage.getItem(key)); return val ?? fallback; } catch { return fallback; } }
function writeStorage(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; } }
function icon(name, size = 20) {
  const paths = {
    grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c5 5 5 13 0 18-5-5-5-13 0-18Z"/>',
    shield: '<path d="M12 3 4 6v6c0 5 8 9 8 9s8-4 8-9V6l-8-3Z"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
    activity: '<path d="M2 12h5l3-8 4 16 3-8h5"/>',
    settings: '<path d="m9 3-.5 2.5-2 1.2L4 6l-2 3.5L4 11v2l-2 1.5L4 18l2.5-.7 2 1.2L9 21h6l.5-2.5 2-1.2 2.5.7 2-3.5-2-1.5v-2l2-1.5L20 6l-2.5.7-2-1.2L15 3H9Z"/><circle cx="12" cy="12" r="3"/>',
    arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
    chevron: '<path d="m9 5 7 7-7 7"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3"/>',
    copy: '<rect x="8" y="8" width="12" height="13" rx="2"/><path d="M15 8V3H3v13h5"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    refresh: '<path d="M20 8a8 8 0 0 0-14-2L3 9m0-6v6h6M4 16a8 8 0 0 0 14 2l3-3m0 6v-6h-6"/>',
    server: '<rect x="3" y="3" width="18" height="7" rx="2"/><rect x="3" y="14" width="18" height="7" rx="2"/><path d="M7 6.5h.01M7 17.5h.01M12 7h5M12 18h5"/>',
    warning: '<path d="M10.2 4 2 18a2 2 0 0 0 1.7 3h16.6a2 2 0 0 0 1.7-3L13.8 4a2 2 0 0 0-3.6 0Z"/><path d="M12 9v5M12 17h.01"/>',
    code: '<path d="m8 6-6 6 6 6m8-12 6 6-6 6m-3-15-2 18"/>',
    key: '<circle cx="8" cy="9" r="5"/><path d="m12 13 8 8m-2-2 3-3m-6 0 3-3"/>',
    bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
    external: '<path d="M14 3h7v7m0-7L10 14M11 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6"/>',
    down: '<path d="m6 9 6 6 6-6"/>',
    back: '<path d="M19 12H5m6-6-6 6 6 6"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>',
    trash: '<path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7"/>'
  };
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.shield}</svg>`;
}
function logo() { return '<span class="cx-brandmark" aria-hidden="true"><i></i><i></i></span><span>xWAF<span class="cx-brand-dot">.</span></span>'; }
function freshDraft(initial = '') { return { step: 1, hostname: initial, origin: '', protocol: 'https', port: '443', apex: false, apexMethod: 'flattening', ready: false, dnsReady: false, checks: {}, error: '', busy: false }; }
function normalizedHost(value) {
  let input = value.trim().toLowerCase().replace(/\.$/, '');
  if (input.includes('://') || /[/?#@\s]/.test(input)) return '';
  if (input.includes(':') && !(input.startsWith('[') && input.endsWith(']'))) return '';
  try { const parsed = new URL(`https://${input}`); return parsed.hostname.replace(/\.$/, ''); } catch { return ''; }
}
function validDomain(value) { return value.length <= 253 && value.includes('.') && !/^\d+\.\d+\.\d+\.\d+$/.test(value) && value.split('.').every(s => /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(s)); }
function validOrigin(value) {
  if (!value || value.length > 253) return false;
  if (value.startsWith('[') && value.endsWith(']')) { try { return new URL(`https://${value}`).hostname === value; } catch { return false; } }
  if (/^\d+(\.\d+){3}$/.test(value)) return value.split('.').every(n => +n >= 0 && +n <= 255);
  return validDomain(value);
}

export function mountConsole(container, { view = 'overview', initialDomain = '' } = {}) {
  const saved = readStorage(STORE_KEY, null);
  let data = saved && Array.isArray(saved.domains) && saved.settings ? saved : seed();
  data.domains = data.domains.filter(d => d && typeof d.hostname === 'string' && typeof d.id === 'string').map(d => ({ ...d, rules: { ...defaults, ...d.rules } }));
  let draft = readStorage(DRAFT_KEY, freshDraft(initialDomain));
  if (!draft || typeof draft !== 'object' || ![1, 2, 3, 4].includes(draft.step)) draft = freshDraft(initialDomain);
  if (draft.step === 4) draft = freshDraft(initialDomain);
  draft = { ...freshDraft(), ...draft, busy: false, error: '' };
  if (initialDomain && draft.hostname !== initialDomain) draft = freshDraft(initialDomain);
  const state = { search: '', domainFilter: 'all', eventFilter: 'all', eventSearch: '', range: '24', selectedDomain: data.domains[0]?.id || '', overlay: null, mobileOpen: false, toast: '', lastRefresh: '방금', savedNotice: false };
  let alive = true;
  const timers = new Set();
  const knownViews = ['overview', 'domains', 'events', 'rules', 'settings', 'connect'];
  if (!knownViews.includes(view)) view = 'overview';
  const titleByView = { overview: '대시보드', domains: '도메인', events: '보안 이벤트', rules: '보안 정책', settings: '워크스페이스 설정', connect: '도메인 연결' };
  function later(fn, ms) { const id = setTimeout(() => { timers.delete(id); if (alive) fn(); }, ms); timers.add(id); return id; }
  function persist() { if (!writeStorage(STORE_KEY, data)) toast('브라우저 저장소를 사용할 수 없어 현재 화면에서만 유지됩니다.'); }
  function saveDraft() { writeStorage(DRAFT_KEY, { ...draft, busy: false, error: '' }); }
  function toast(text) { state.toast = text; const slot = container.querySelector('.cx-toast'); if (slot) { slot.textContent = text; slot.classList.add('is-visible'); } later(() => { if (state.toast === text) { state.toast = ''; container.querySelector('.cx-toast')?.classList.remove('is-visible'); } }, 3400); }
  function badge(domain) {
    if (domain.connection !== 'active') return '<span class="cx-badge is-amber"><span></span>DNS 연결 대기</span>';
    return domain.mode === 'monitor' ? '<span class="cx-badge is-blue"><span></span>모니터링 · 예시</span>' : '<span class="cx-badge"><span></span>보호 중 · 예시</span>';
  }
  function pageHeader(title, description, actions = '') { return `<div class="cx-page-heading"><div><div class="cx-eyebrow">YOUR SECURITY WORKSPACE</div><h1>${title}</h1><p>${description}</p></div><div class="cx-heading-actions">${actions}</div></div>`; }
  function addButton(label = '도메인 추가') { return `<button class="cx-btn cx-primary" data-action="new-domain">${icon('plus', 17)}${label}</button>`; }
  function render() {
    container.innerHTML = `<div class="console-app ${state.mobileOpen ? 'is-nav-open' : ''}">
      ${state.mobileOpen ? '<button class="cx-navscrim" data-action="toggle-nav" aria-label="메뉴 닫기"></button>' : ''}
      <aside class="cx-sidebar"><a class="cx-logo" href="#/" aria-label="xWAF 홈">${logo()}</a>
        <div class="cx-workspace"><span class="cx-workspace-avatar">W</span><div><strong>내 워크스페이스</strong><small>서비스 체험</small></div><span class="cx-workspace-chevron">${icon('down', 15)}</span></div>
        <div class="cx-nav-caption">WORKSPACE</div>
        <nav class="cx-nav" aria-label="콘솔 메뉴">${[['overview', 'grid', '대시보드'], ['domains', 'globe', '도메인'], ['events', 'activity', '보안 이벤트'], ['rules', 'shield', '보안 정책']].map(([route, symbol, label]) => `<a href="#/app/${route}" class="${view === route ? 'is-active' : ''}" ${view === route ? 'aria-current="page"' : ''}>${icon(symbol)}<span>${label}</span>${route === 'domains' ? `<small>${data.domains.length}</small>` : ''}</a>`).join('')}</nav>
        <div class="cx-sidebar-bottom"><a class="cx-settings-link ${view === 'settings' ? 'is-active' : ''}" href="#/app/settings">${icon('settings', 18)}<span>워크스페이스 설정</span></a><div class="cx-sidebar-help"><span class="cx-help-icon">${icon('globe', 22)}</span><strong>첫 연결도, 어렵지 않게.</strong><p>도메인부터 DNS까지<br>한 단계씩 안내해 드려요.</p><button data-action="new-domain">연결 과정 살펴보기 ${icon('arrow', 15)}</button></div><div class="cx-powered">Powered by <strong>PLURA</strong></div></div>
      </aside>
      <div class="cx-workarea"><header class="cx-topbar"><div class="cx-topbar-left"><button class="cx-icon-btn cx-mobile-menu" data-action="toggle-nav" aria-label="콘솔 메뉴 열기" aria-expanded="${state.mobileOpen}">${icon('menu')}</button><span class="cx-breadcrumb">워크스페이스 <span>/</span> <strong>${titleByView[view]}</strong></span></div><div class="cx-topbar-right"><span class="cx-demo-pill"><span></span>서비스 체험 · 샘플 데이터</span><a class="cx-home-link" href="#/">홈으로 ${icon('external', 14)}</a><span class="cx-avatar" title="체험 워크스페이스" aria-label="체험 워크스페이스">D</span></div></header>
      <div class="cx-demo-note">${icon('info', 15)}<span>설정 흐름을 미리 확인하는 체험 화면입니다. 실제 DNS 변경이나 웹방화벽 보호에는 반영되지 않습니다.</span></div>
      <main class="cx-main" id="console-main">${view === 'overview' ? overview() : view === 'domains' ? domains() : view === 'events' ? eventsView() : view === 'rules' ? rulesView() : view === 'settings' ? settingsView() : connectView()}</main>
      <footer class="cx-footer"><span>xWAF · 웹 보안을 더 간단하게.</span><span>체험 설정은 이 브라우저에 저장됩니다.</span></footer></div>
      ${overlayView()}<div class="cx-toast ${state.toast ? 'is-visible' : ''}" role="status" aria-live="polite">${esc(state.toast)}</div>
    </div>`;
  }
  function domainRows(list, compact = false) {
    if (!list.length) return `<div class="cx-empty">${icon('search', 34)}<h3>일치하는 도메인이 없습니다.</h3><p>검색어나 상태 필터를 변경해 주세요.</p></div>`;
    return `<div class="cx-table-scroll"><table class="cx-table"><thead><tr><th scope="col" class="cx-no">No.</th><th scope="col">도메인</th><th scope="col">상태</th>${compact ? '<th scope="col">요청 수 · 예시</th>' : '<th scope="col">원본 서버</th><th scope="col">TLS</th>'}<th scope="col" class="cx-align-right">관리</th></tr></thead><tbody>${list.map((d, i) => `<tr><td class="cx-no">${String(i + 1).padStart(2, '0')}</td><td><button class="cx-domain-name" data-action="domain-detail" data-id="${esc(d.id)}"><span class="cx-domain-icon">${icon('globe', 17)}</span><span>${esc(d.hostname)}<small>${d.apex ? '루트 도메인' : '서브도메인'}</small></span></button></td><td>${badge(d)}</td>${compact ? `<td class="cx-mono">${esc(d.requests || '—')}</td>` : `<td class="cx-origin-cell">${esc(d.origin)}<small>${esc(d.protocol.toUpperCase())} · ${esc(d.port)}</small></td><td><span class="cx-tls">${icon('lock', 14)}${d.connection === 'active' ? '준비 완료 · 예시' : '준비 대기'}</span></td>`}<td class="cx-align-right"><button class="cx-icon-btn" data-action="domain-detail" data-id="${esc(d.id)}" aria-label="${esc(d.hostname)} 상세 보기">${icon('chevron', 17)}</button></td></tr>`).join('')}</tbody></table></div>`;
  }
  function chart() {
    const values = state.range === '6' ? [46, 38, 35, 58, 60, 47, 64, 43, 53, 49, 35, 41, 68, 72, 64, 50, 67, 76, 63, 67, 55, 68, 51, 57] : state.range === '7' ? [46, 40, 52, 38, 57, 55, 70, 66, 47, 56, 48, 59, 68, 48, 62, 71, 54, 62, 76, 63, 77, 72, 83, 79] : [28, 31, 24, 30, 25, 38, 35, 34, 44, 39, 35, 48, 53, 43, 60, 68, 58, 72, 67, 49, 61, 57, 74, 68];
    const points = values.map((v, i) => `${46 + i * 25},${182 - v * 1.65}`).join(' ');
    const blocked = values.map((v, i) => `${46 + i * 25},${190 - (i === 15 ? 43 : i === 18 ? 31 : i === 10 ? 21 : 8 + v * .09)}`).join(' ');
    return `<svg class="cx-chart-svg" viewBox="0 0 660 226" role="img" aria-label="요청과 차단 추이를 보여 주는 샘플 트래픽 차트"><defs><linearGradient id="cx-chart-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#9bcdb0" stop-opacity=".35"/><stop offset="100%" stop-color="#9bcdb0" stop-opacity="0"/></linearGradient></defs>${[30, 80, 130, 180].map((y, i) => `<line x1="43" y1="${y}" x2="635" y2="${y}" stroke="#eaf0e9" stroke-dasharray="3 5"/><text x="0" y="${y + 4}" fill="#929b94" font-size="10">${[90, 60, 30, 0][i]}k</text>`).join('')}<polygon points="46,190 ${points} 621,190" fill="url(#cx-chart-fill)"/><polyline points="${points}" fill="none" stroke="#2e6b51" stroke-width="2.5" stroke-linejoin="round"/><polyline points="${blocked}" fill="none" stroke="#9eb76c" stroke-width="2" stroke-linejoin="round"/><circle cx="621" cy="${182 - values[23] * 1.65}" r="4" fill="#173f35" stroke="#fff" stroke-width="2"/>${['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '현재'].map((t, i) => `<text x="${46 + i * 96}" y="216" fill="#929b94" font-size="10" text-anchor="${i === 6 ? 'end' : 'start'}">${state.range === '7' ? ['월', '화', '수', '목', '금', '토', '일'][i] : state.range === '6' ? ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '현재'][i] : t}</text>`).join('')}</svg>`;
  }
  function overview() {
    const active = data.domains.filter(d => d.connection === 'active').length;
    const kpis = [['globe', '연결된 도메인', `${active}<small>/ ${data.domains.length}</small>`, `${data.domains.length - active}개 도메인 연결 대기`, ''], ['activity', '전체 요청', state.range === '7' ? '864.2<small>만</small>' : state.range === '6' ? '32.8<small>만</small>' : '128.6<small>만</small>', '선택 기간의 샘플 요청', ''], ['shield', '차단된 요청', state.range === '7' ? '19,421' : state.range === '6' ? '726' : '2,847', '차단 정책이 적용된 예시', 'accent'], ['lock', 'HTTPS 연결', `${active}<small>개</small>`, '인증서 준비 완료 · 예시', '']];
    return `${pageHeader('웹사이트의 오늘, 한눈에.', '연결 상태부터 보안 이벤트까지, 필요한 정보만 모았습니다.', `<button class="cx-btn cx-secondary cx-refresh" data-action="refresh">${icon('refresh', 16)}새로고침</button>${addButton()}`)}
      <section class="cx-kpi-grid" aria-label="샘플 보안 요약">${kpis.map(([symbol, label, value, note, cls]) => `<article class="cx-kpi ${cls}"><div class="cx-kpi-label">${label}<span>${icon(symbol, 19)}</span></div><div class="cx-kpi-value">${value}</div><div class="cx-kpi-note">${note}</div></article>`).join('')}</section>
      <section class="cx-analytics-grid"><article class="cx-card cx-traffic-card"><div class="cx-card-head"><div><h2>트래픽 흐름</h2><p>요청과 차단 추이 · 샘플 데이터</p></div><select class="cx-select cx-small-select" name="range" aria-label="트래픽 기간"><option value="6" ${state.range === '6' ? 'selected' : ''}>지난 6시간</option><option value="24" ${state.range === '24' ? 'selected' : ''}>지난 24시간</option><option value="7" ${state.range === '7' ? 'selected' : ''}>지난 7일</option></select></div><div class="cx-chart-legend"><span><i></i>전체 요청</span><span><i></i>차단 요청</span></div>${chart()}<div class="cx-chart-foot"><span class="cx-green-dot"></span>샘플 데이터 · ${esc(state.lastRefresh)} 확인</div></article>
      <article class="cx-card cx-threat-card"><div class="cx-card-head"><div><h2>주요 보안 이벤트</h2><p>탐지 유형별 분포 · 예시</p></div>${icon('shield', 20)}</div><div class="cx-threat-total"><strong>2,847</strong><span>차단 요청 예시</span></div>${[['SQL Injection', 42, '#245743'], ['Cross-site Scripting', 28, '#6b9474'], ['민감 경로 접근', 18, '#a1bc8b'], ['기타 웹 공격', 12, '#cfdfb8']].map(([label, pct, color]) => `<div class="cx-threat-item"><div><span>${label}</span><strong>${pct}%</strong></div><div class="cx-progress-track"><span style="width:${pct}%;background:${color}"></span></div></div>`).join('')}<a class="cx-text-link" href="#/app/events">전체 보안 이벤트 ${icon('arrow', 16)}</a></article></section>
      <section class="cx-card cx-domains-card"><div class="cx-card-head"><div><h2>내 도메인 <span class="cx-count">${data.domains.length}</span></h2><p>도메인별 연결과 보호 상태를 확인하세요.</p></div><a class="cx-text-link" href="#/app/domains">모두 보기 ${icon('arrow', 15)}</a></div>${domainRows(data.domains.slice(0, 4), true)}</section>
      <section class="cx-card"><div class="cx-card-head"><div><h2>최근 보안 이벤트</h2><p>실제 고객 트래픽이 아닌 화면 예시입니다.</p></div><span class="cx-subtle-tag">샘플 데이터</span></div>${eventRows(events.slice(0, 3))}</section>`;
  }
  function filteredDomains() { return data.domains.filter(d => d.hostname.toLowerCase().includes(state.search.toLowerCase()) && (state.domainFilter === 'all' || (state.domainFilter === 'active' && d.connection === 'active') || (state.domainFilter === 'pending' && d.connection !== 'active') || (state.domainFilter === 'monitor' && d.mode === 'monitor' && d.connection === 'active'))); }
  function domains() {
    return `${pageHeader('내 도메인', '하나의 워크스페이스에서 웹사이트별 연결과 보안 정책을 관리하세요.', addButton())}<div class="cx-domain-summary"><span><i class="cx-green-dot"></i>연결 완료 <strong>${data.domains.filter(d => d.connection === 'active').length}</strong></span><span><i class="cx-amber-dot"></i>연결 대기 <strong>${data.domains.filter(d => d.connection !== 'active').length}</strong></span><span class="cx-summary-note">모든 보호 상태는 체험용 예시입니다.</span></div><section class="cx-card"><div class="cx-filterbar"><label class="cx-search">${icon('search', 17)}<input name="domain-search" type="search" placeholder="도메인 검색" value="${esc(state.search)}" aria-label="도메인 검색"></label><select name="domain-filter" class="cx-select" aria-label="도메인 상태 필터">${[['all', '모든 상태'], ['active', '연결 완료'], ['pending', 'DNS 연결 대기'], ['monitor', '모니터링']].map(([v, t]) => `<option value="${v}" ${state.domainFilter === v ? 'selected' : ''}>${t}</option>`).join('')}</select><span class="cx-filter-count">총 ${data.domains.length}개 도메인</span></div><div id="cx-domain-results">${domainRows(filteredDomains())}</div></section><div class="cx-soft-tip">${icon('info', 18)}<div><strong>네임서버를 옮길 필요 없이.</strong><p>사용 중인 DNS 서비스에서 도메인의 연결 레코드를 변경하는 흐름입니다. 루트 도메인은 DNS 제공자의 지원 방식에 따라 설정이 달라집니다.</p></div></div>`;
  }
  function eventRows(list) {
    if (!list.length) return '<div class="cx-empty"><h3>조건에 맞는 이벤트가 없습니다.</h3><p>검색어나 동작 필터를 변경해 주세요.</p></div>';
    return `<div class="cx-table-scroll"><table class="cx-table cx-event-table"><thead><tr><th scope="col" class="cx-no">No.</th><th scope="col">시간 · 예시</th><th scope="col">도메인</th><th scope="col">이벤트</th><th scope="col">동작</th><th scope="col">출발지 IP · 예시</th><th scope="col" class="cx-align-right">상세</th></tr></thead><tbody>${list.map((e, i) => `<tr><td class="cx-no">${String(i + 1).padStart(2, '0')}</td><td class="cx-mono cx-muted">${e.time}</td><td class="cx-event-domain">${e.domain}</td><td><button class="cx-event-link" data-action="event-detail" data-id="${e.id}">${e.name}</button></td><td><span class="cx-action-tag ${e.action === '차단' ? 'is-blocked' : 'is-detected'}">${e.action}</span></td><td class="cx-mono cx-muted">${e.ip}</td><td class="cx-align-right"><button class="cx-icon-btn" data-action="event-detail" data-id="${e.id}" aria-label="${e.name} 이벤트 상세">${icon('chevron', 16)}</button></td></tr>`).join('')}</tbody></table></div>`;
  }
  function filteredEvents() { return events.filter(e => (state.eventFilter === 'all' || e.action === state.eventFilter) && `${e.domain} ${e.name} ${e.ip}`.toLowerCase().includes(state.eventSearch.toLowerCase())); }
  function eventsView() {
    return `${pageHeader('보안 이벤트', '어떤 요청이 탐지되었는지, 어떤 정책이 적용되었는지 확인하세요.', '<span class="cx-subtle-tag">샘플 이벤트 6건</span>')}<section class="cx-card"><div class="cx-filterbar"><label class="cx-search">${icon('search', 17)}<input name="event-search" type="search" placeholder="도메인, 이벤트, IP 검색" value="${esc(state.eventSearch)}" aria-label="보안 이벤트 검색"></label><select name="event-filter" class="cx-select" aria-label="이벤트 동작 필터"><option value="all" ${state.eventFilter === 'all' ? 'selected' : ''}>모든 동작</option><option value="차단" ${state.eventFilter === '차단' ? 'selected' : ''}>차단</option><option value="탐지" ${state.eventFilter === '탐지' ? 'selected' : ''}>탐지</option></select><span class="cx-filter-count">화면 설명용 샘플</span></div><div id="cx-event-results">${eventRows(filteredEvents())}</div></section><div class="cx-soft-tip">${icon('info', 18)}<div><strong>탐지와 차단은 다릅니다.</strong><p>모니터링 모드는 탐지 내역을 기록하고, 차단 모드는 적용된 정책에 따라 요청을 차단합니다. 여기서는 두 결과를 샘플로 확인할 수 있습니다.</p></div></div>`;
  }
  function selectedDomain() { return data.domains.find(d => d.id === state.selectedDomain) || data.domains[0]; }
  function domainSelect() { return `<select class="cx-select cx-domain-select" name="rule-domain" aria-label="보안 정책을 설정할 도메인">${data.domains.map(d => `<option value="${esc(d.id)}" ${selectedDomain()?.id === d.id ? 'selected' : ''}>${esc(d.hostname)}</option>`).join('')}</select>`; }
  function switchButton(key, enabled, label, extra = '') { return `<button class="cx-switch ${enabled ? 'is-on' : ''}" type="button" role="switch" aria-checked="${!!enabled}" aria-label="${esc(label)}" data-action="${extra || 'toggle-rule'}" data-key="${key}"><span></span></button>`; }
  function rulesView() {
    const d = selectedDomain();
    if (!d) return `${pageHeader('보안 정책', '먼저 보호할 도메인을 연결하세요.', addButton())}`;
    return `${pageHeader('사이트에 맞는 보안 정책.', '도메인마다 다른 정책과 동작 모드를 선택할 수 있습니다.', domainSelect())}<div class="cx-settings-layout"><div><section class="cx-card cx-mode-card"><div class="cx-card-head"><div><h2>정책 동작 모드</h2><p>${esc(d.hostname)} · 이 브라우저에서만 저장됩니다.</p></div><span class="cx-subtle-tag">체험 설정</span></div><div class="cx-mode-options"><button class="cx-mode-option ${d.mode === 'block' ? 'is-selected' : ''}" data-action="set-mode" data-mode="block"><span class="cx-radio-dot"></span><div><strong>${icon('shield', 19)}차단 모드</strong><p>탐지된 요청에 차단 정책을 적용합니다.</p></div></button><button class="cx-mode-option ${d.mode === 'monitor' ? 'is-selected' : ''}" data-action="set-mode" data-mode="monitor"><span class="cx-radio-dot"></span><div><strong>${icon('activity', 19)}모니터링 모드</strong><p>요청을 허용하고 탐지 내역을 기록합니다.</p></div></button></div></section><section class="cx-card"><div class="cx-card-head"><div><h2>보호 정책</h2><p>각 정책을 켜거나 끄며 설정 흐름을 확인하세요.</p></div></div><div class="cx-rule-list">${ruleDetails.map(([key, label, note, symbol]) => `<div class="cx-rule-row"><span class="cx-rule-icon">${icon(symbol, 20)}</span><div><h3>${label}</h3><p>${note}</p></div>${switchButton(key, d.rules[key], `${label} 사용`)}</div>`).join('')}</div><div class="cx-card-foot"><span>${icon('check', 15)}변경 사항이 이 브라우저에 자동 저장됩니다.</span></div></section></div><aside class="cx-context-card"><span class="cx-context-icon">${icon('shield', 28)}</span><h3>보안은 도메인별로.</h3><p>웹사이트와 API의 특성이 다르다면 각각의 도메인에 맞춰 보호 정책을 설정하세요.</p><hr><strong>현재 설정</strong><dl><div><dt>도메인</dt><dd>${esc(d.hostname)}</dd></div><div><dt>동작 모드</dt><dd>${d.mode === 'block' ? '차단 모드' : '모니터링 모드'}</dd></div><div><dt>사용 정책</dt><dd>${Object.values(d.rules).filter(Boolean).length}개</dd></div></dl><small>실제 WAF 정책에는 적용되지 않습니다.</small></aside></div>`;
  }
  function settingsView() {
    const s = data.settings;
    return `${pageHeader('워크스페이스 설정', '필요한 알림과 체험 환경을 관리하세요.')}<div class="cx-settings-layout"><div><form id="cx-settings-form" class="cx-card"><div class="cx-card-head"><div><h2>알림 설정</h2><p>알림을 받는 방식을 미리 설정해 볼 수 있습니다.</p></div>${icon('bell', 20)}</div><div class="cx-form-section"><label class="cx-field"><span>알림 이메일</span><input type="email" name="notification-email" value="${esc(s.email)}" placeholder="security@example.com" autocomplete="off"><small>이 브라우저에만 저장되며, 메일은 발송되지 않습니다.</small></label></div><div class="cx-rule-list">${[['attacks', '보안 이벤트 알림', '차단 또는 주요 탐지 이벤트가 발생했을 때'], ['connection', '도메인 연결 알림', 'DNS 연결 또는 인증서 상태가 변경되었을 때'], ['summary', '일일 요약', '하루의 요청과 보안 이벤트를 요약할 때']].map(([key, label, note]) => `<div class="cx-rule-row"><div><h3>${label}</h3><p>${note}</p></div><label class="cx-switch ${s[key] ? 'is-on' : ''}"><input type="checkbox" name="notify-${key}" ${s[key] ? 'checked' : ''} aria-label="${label}"><span></span></label></div>`).join('')}</div><div class="cx-form-actions"><span class="cx-form-save-note" role="status">${state.savedNotice ? '체험 알림 설정을 저장했습니다.' : '실제 이메일 발송은 지원하지 않는 체험입니다.'}</span><button class="cx-btn cx-primary" type="submit">설정 저장 ${icon('check', 17)}</button></div></form><section class="cx-card cx-reset-card"><div><h2>체험 데이터 초기화</h2><p>추가한 도메인과 정책을 지우고 처음의 샘플 화면으로 돌아갑니다.</p></div><button class="cx-btn cx-danger-outline" data-action="reset-dialog">${icon('refresh', 16)}초기화</button></section></div><aside class="cx-context-card"><span class="cx-context-icon">${icon('info', 28)}</span><h3>편하게 둘러보세요.</h3><p>이 콘솔은 연결과 관리 경험을 검토하는 데모입니다. 입력한 설정은 이 브라우저에 저장됩니다.</p><hr><p>실제 계정 생성, DNS 조회, 인증서 발급과 WAF 배포는 수행하지 않습니다.</p></aside></div>`;
  }
  function wizardStepper() {
    return `<ol class="cx-stepper" aria-label="도메인 연결 단계">${[['도메인·원본', 1], ['연결 준비', 2], ['DNS 연결', 3], ['완료', 4]].map(([label, num]) => `<li class="${draft.step === num ? 'is-current' : draft.step > num ? 'is-done' : ''}" ${draft.step === num ? 'aria-current="step"' : ''}><span class="cx-step-num">${draft.step > num ? icon('check', 15) : String(num).padStart(2, '0')}</span><span>${label}</span></li>`).join('')}</ol>`;
  }
  function wizardErrors() { return draft.error ? `<div class="cx-form-error" role="alert">${icon('warning', 18)}<span>${esc(draft.error)}</span></div>` : ''; }
  function connectView() {
    return `${pageHeader('도메인을 연결해 볼까요?', '웹사이트 등록부터 CNAME 연결까지, 한 단계씩 안내합니다.', '<a class="cx-text-link" href="#/app/domains">도메인 목록으로 '+icon('arrow', 16)+'</a>')}<div class="cx-wizard-wrap">${wizardStepper()}<div id="cx-wizard-stage">${draft.step === 1 ? wizardStepOne() : draft.step === 2 ? wizardStepTwo() : draft.step === 3 ? wizardStepThree() : wizardStepFour()}</div></div>`;
  }
  function wizardStepOne() {
    return `<div class="cx-wizard-layout"><form class="cx-card cx-wizard-card" id="cx-domain-form"><div class="cx-wizard-title"><span class="cx-section-number">01 / DOMAIN & ORIGIN</span><h2>어떤 웹사이트를 보호할까요?</h2><p>방문자가 사용하는 주소와 실제 웹서버 주소를 알려 주세요.</p></div><div class="cx-form-section"><label class="cx-field"><span>보호할 도메인 <b>*</b></span><input name="hostname" value="${esc(draft.hostname)}" placeholder="www.example.com" autocomplete="off" spellcheck="false" required aria-describedby="cx-hostname-help"><small id="cx-hostname-help">https://와 경로를 제외한 도메인을 입력하세요.</small></label><label class="cx-checkbox"><input type="checkbox" name="apex" ${draft.apex ? 'checked' : ''}><span>루트 도메인입니다 <small>(예: example.com, example.co.kr)</small></span></label><div class="cx-apex-inline ${draft.apex ? '' : 'is-hidden'}" id="cx-apex-note">${icon('info', 16)}<span>루트 도메인은 DNS 서비스의 ALIAS/ANAME 또는 CNAME Flattening 지원 여부를 확인해야 합니다.</span></div><div class="cx-field-divider"></div><label class="cx-field"><span>원본 서버 주소 <b>*</b></span><input name="origin" value="${esc(draft.origin)}" placeholder="origin.example.com 또는 203.0.113.10" autocomplete="off" spellcheck="false" required><small>보호할 도메인과 다른 원본 전용 주소나 IP를 입력하세요.</small></label><div class="cx-form-grid"><label class="cx-field"><span>원본 연결 방식</span><select name="protocol"><option value="https" ${draft.protocol === 'https' ? 'selected' : ''}>HTTPS · 권장</option><option value="http" ${draft.protocol === 'http' ? 'selected' : ''}>HTTP</option></select></label><label class="cx-field"><span>포트</span><input type="number" name="port" min="1" max="65535" value="${esc(draft.port)}" required></label></div><div id="cx-domain-error">${wizardErrors()}</div></div><div class="cx-form-actions"><span class="cx-step-caption">1 / 4 단계</span><button class="cx-btn cx-primary" type="submit">연결 준비하기 ${icon('arrow', 17)}</button></div></form><aside class="cx-wizard-guide"><div class="cx-guide-visual"><span>${icon('globe', 30)}</span><i></i><span class="cx-guide-shield">${icon('shield', 32)}</span><i></i><span>${icon('server', 30)}</span></div><div class="cx-guide-labels"><span>방문자</span><strong>xWAF</strong><span>원본 서버</span></div><h3>익숙한 웹사이트,<br>더 안전한 연결.</h3><p>사용자는 기존 도메인으로 접속합니다. xWAF를 거친 요청은 등록한 원본 서버로 전달됩니다.</p><ul><li>${icon('check', 16)}기존 DNS 서비스 유지</li><li>${icon('check', 16)}도메인별 독립된 보안 정책</li><li>${icon('check', 16)}연결 상태를 한눈에 확인</li></ul><div class="cx-guide-note">체험용 주소를 입력해도 됩니다.<br><button data-action="fill-example" class="cx-text-link">예시 정보로 입력 ${icon('arrow', 14)}</button></div></aside></div>`;
  }
  function checkRow(key, label, note, symbol) {
    const status = draft.checks?.[key] || 'waiting';
    const labelState = status === 'done' ? '준비 완료 · 예시' : status === 'checking' ? '확인 중 · 예시' : status === 'error' ? '확인 필요 · 예시' : '확인 대기';
    return `<div class="cx-check-row ${status}"><span class="cx-check-symbol">${status === 'checking' ? '<span class="cx-spinner"></span>' : status === 'done' ? icon('check', 19) : status === 'error' ? icon('warning', 19) : icon(symbol, 19)}</span><div><strong>${label}</strong><p>${note}</p></div><span class="cx-check-status">${labelState}</span></div>`;
  }
  function wizardStepTwo() {
    const cname = draft.cname || 'demo-connect.edge.xwaf.example';
    return `<div class="cx-card cx-wizard-card cx-wizard-single"><div class="cx-wizard-title"><span class="cx-section-number">02 / CONNECTION READINESS</span><h2>연결에 필요한 준비를 확인합니다.</h2><p><strong>${esc(draft.hostname)}</strong> · DNS 변경 전 준비 과정을 체험하세요.</p></div><div class="cx-wizard-inner"><div class="cx-inline-banner">${icon('info', 17)}<span>아래는 준비 과정을 설명하는 시뮬레이션입니다. 실제 DNS에 예시 값을 등록하지 마세요.</span></div><div class="cx-verification-example"><div><strong>소유권 확인 레코드 예시</strong><span class="cx-subtle-tag">TXT</span></div><dl><div><dt>이름</dt><dd><code>${esc('_xwaf-verification.' + draft.hostname)}</code></dd></div><div><dt>값</dt><dd><code>xwaf-verification=demo-${esc(draft.id || 'preview')}</code></dd></div></dl></div><div class="cx-check-list">${checkRow('ownership', '도메인 소유권', '등록한 도메인을 관리할 권한을 확인합니다.', 'globe')}${checkRow('tls', 'HTTPS 인증서', '방문자와 xWAF 사이의 보안 연결을 준비합니다.', 'lock')}${checkRow('origin', '원본 서버 연결', `${esc(draft.origin)} · ${esc(draft.protocol.toUpperCase())}:${esc(draft.port)}`, 'server')}${checkRow('policy', '보안 정책 준비', '도메인에 적용할 기본 보호 정책을 준비합니다.', 'shield')}</div>${wizardErrors()}<div class="cx-simulation-actions"><button class="cx-btn cx-secondary" data-action="simulate-prepare" ${draft.busy ? 'disabled' : ''}>${draft.busy ? '<span class="cx-spinner"></span>' : icon('refresh', 16)}${draft.ready ? '다시 시뮬레이션' : '준비 과정 체험'}</button><button class="cx-link-button" data-action="simulate-prepare-error" ${draft.busy ? 'disabled' : ''}>원본 연결 실패 예시</button></div></div><div class="cx-form-actions"><button class="cx-btn cx-plain" data-action="wizard-back" ${draft.busy ? 'disabled' : ''}>${icon('back', 16)}이전</button><button class="cx-btn cx-primary" data-action="wizard-dns" ${!draft.ready || draft.busy ? 'disabled' : ''}>CNAME 연결 안내 ${icon('arrow', 17)}</button></div></div>`;
  }
  function recordType() { return draft.apex && draft.apexMethod === 'alias' ? 'ALIAS / ANAME' : 'CNAME'; }
  function wizardStepThree() {
    return `<div class="cx-card cx-wizard-card cx-wizard-single"><div class="cx-wizard-title"><span class="cx-section-number">03 / CONNECT YOUR DNS</span><h2>이제 DNS를 연결할 차례입니다.</h2><p>운영 서비스에서는 현재 사용 중인 DNS 관리 화면에 연결 레코드를 등록합니다.</p></div><div class="cx-wizard-inner"><div class="cx-inline-banner">${icon('info', 17)}<span>화면의 <strong>.example</strong> 주소는 체험 전용입니다. 실제 DNS에 등록하지 마세요.</span></div>${draft.apex ? `<div class="cx-apex-panel">${icon('warning', 20)}<div><strong>루트 도메인은 일반 CNAME을 사용할 수 없습니다.</strong><p>DNS 제공자가 지원하는 방식을 먼저 확인하세요.</p><label class="cx-field"><span>DNS 연결 방식 · 체험</span><select name="apex-method"><option value="flattening" ${draft.apexMethod === 'flattening' ? 'selected' : ''}>CNAME Flattening 지원</option><option value="alias" ${draft.apexMethod === 'alias' ? 'selected' : ''}>ALIAS / ANAME 지원</option><option value="unsupported" ${draft.apexMethod === 'unsupported' ? 'selected' : ''}>지원 여부를 모르겠어요</option></select></label></div></div>` : ''}${draft.apex && draft.apexMethod === 'unsupported' ? `<div class="cx-unsupported"><h3>연결 방식 확인이 필요합니다.</h3><p>DNS 제공자에게 루트 도메인 연결 지원 여부를 확인하세요. 이 체험에서는 www 같은 서브도메인 연결로 돌아가 볼 수 있습니다.</p><button class="cx-btn cx-secondary" data-action="wizard-first">도메인 설정으로 돌아가기</button></div>` : `<div class="cx-record-header"><h3>DNS 레코드 <span class="cx-subtle-tag">예시</span></h3><button class="cx-text-link" data-action="copy-record">${icon('copy', 15)}전체 복사</button></div><div class="cx-table-scroll cx-dns-table"><table class="cx-table"><thead><tr><th scope="col">No.</th><th scope="col">유형</th><th scope="col">이름</th><th scope="col">대상</th><th scope="col">TTL</th></tr></thead><tbody><tr><td>01</td><td><span class="cx-record-type">${recordType()}</span></td><td><code>${esc(draft.apex ? '@' : draft.hostname)}</code></td><td><div class="cx-copy-value"><code>${esc(draft.cname)}</code><button class="cx-icon-btn" data-action="copy-cname" aria-label="체험용 CNAME 대상 복사">${icon('copy', 16)}</button></div></td><td>300</td></tr></tbody></table></div><div class="cx-dns-instructions"><div><span>1</span><p>사용 중인 DNS 서비스의 관리 화면을 엽니다.</p></div><div><span>2</span><p>운영용으로 발급된 이름과 대상을 입력합니다. 같은 이름의 기존 A·AAAA 레코드와 충돌하지 않도록 확인합니다.</p></div><div><span>3</span><p>변경 사항을 저장한 뒤, 연결 상태를 확인합니다.</p></div></div><div class="cx-dns-status ${draft.dnsReady ? 'is-ready' : ''}"><span>${draft.dnsReady ? icon('check', 21) : draft.busy ? '<span class="cx-spinner"></span>' : icon('clock', 21)}</span><div><strong>${draft.dnsReady ? 'DNS와 보호 준비 확인 완료 · 예시' : draft.busy ? 'DNS 연결 확인 중 · 시뮬레이션' : 'DNS 연결을 기다리고 있습니다 · 예시'}</strong><p>${draft.dnsReady ? '연결 체험을 완료하고 콘솔에서 도메인을 확인하세요.' : 'DNS 반영에는 시간이 걸릴 수 있습니다. 아래 버튼으로 확인 과정을 체험하세요.'}</p></div></div>${wizardErrors()}<div class="cx-simulation-actions"><button class="cx-btn cx-secondary" data-action="simulate-dns" ${draft.busy ? 'disabled' : ''}>${draft.busy ? '<span class="cx-spinner"></span>' : icon('refresh', 16)}DNS 연결 시뮬레이션</button><button class="cx-link-button" data-action="simulate-dns-error" ${draft.busy ? 'disabled' : ''}>CNAME 불일치 예시</button></div>`}</div><div class="cx-form-actions"><button class="cx-btn cx-plain" data-action="wizard-back" ${draft.busy ? 'disabled' : ''}>${icon('back', 16)}이전</button><button class="cx-btn cx-primary" data-action="wizard-finish" ${!draft.dnsReady || draft.busy || (draft.apex && draft.apexMethod === 'unsupported') ? 'disabled' : ''}>체험 완료하기 ${icon('arrow', 17)}</button></div></div>`;
  }
  function wizardStepFour() {
    return `<div class="cx-card cx-wizard-single cx-success-card"><div class="cx-success-icon">${icon('check', 36)}</div><span class="cx-section-number">YOU’RE ALL SET</span><h2>도메인 연결 체험이 완료되었습니다.</h2><p>이제 콘솔에서 도메인별 연결 상태와 보안 정책을 확인해 보세요.</p><div class="cx-success-domain"><span class="cx-domain-icon">${icon('globe', 22)}</span><strong>${esc(draft.hostname)}</strong><span class="cx-badge"><span></span>보호 중 · 예시</span></div><div class="cx-success-details"><div><span>원본 서버</span><strong>${esc(draft.origin)}</strong></div><div><span>보안 정책</span><strong>기본 정책 · 차단 모드</strong></div><div><span>인증서</span><strong>준비 완료 · 예시</strong></div></div><div class="cx-inline-banner">${icon('info', 17)}<span>실제 DNS 조회·인증서 발급·WAF 배포는 수행되지 않았습니다.</span></div><div class="cx-success-actions"><a class="cx-btn cx-primary" href="#/app/overview">대시보드로 이동 ${icon('arrow', 17)}</a><button class="cx-btn cx-secondary" data-action="new-domain">다른 도메인 연결</button></div></div>`;
  }
  function overlayView() {
    const overlay = state.overlay;
    if (!overlay) return '';
    let inner = '';
    if (overlay.type === 'domain') {
      const d = data.domains.find(item => item.id === overlay.id); if (!d) return '';
      inner = `<div class="cx-dialog-heading"><div><span class="cx-eyebrow">DOMAIN DETAILS</span><h2 id="cx-dialog-title">${esc(d.hostname)}</h2></div><button class="cx-icon-btn" data-action="close-overlay" aria-label="도메인 상세 닫기">${icon('close')}</button></div><div class="cx-dialog-body"><div class="cx-detail-status">${badge(d)}<span class="cx-subtle-tag">체험 설정</span></div><section class="cx-detail-section"><h3>연결 정보</h3><dl class="cx-detail-list"><div><dt>보호할 도메인</dt><dd>${esc(d.hostname)}</dd></div><div><dt>도메인 유형</dt><dd>${d.apex ? '루트 도메인' : '서브도메인'}</dd></div><div><dt>원본 주소</dt><dd>${esc(d.origin)}</dd></div><div><dt>원본 연결</dt><dd>${esc(d.protocol.toUpperCase())} · ${esc(d.port)}</dd></div><div><dt>HTTPS 인증서</dt><dd>${d.connection === 'active' ? '준비 완료 · 예시' : '준비 대기'}</dd></div></dl></section><section class="cx-detail-section"><h3>연결 대상 <span class="cx-subtle-tag">실제 등록 금지 · 예시</span></h3><div class="cx-detail-cname"><code>${esc(d.cname)}</code><button class="cx-icon-btn" data-action="copy-domain-cname" data-id="${esc(d.id)}" aria-label="연결 대상 복사">${icon('copy', 17)}</button></div>${d.connection !== 'active' ? `<div class="cx-detail-pending">${icon('clock', 17)}<span>DNS 연결을 기다리는 상태의 예시입니다.</span></div><button class="cx-btn cx-secondary" data-action="resume-domain" data-id="${esc(d.id)}">연결 과정 이어보기 ${icon('arrow', 16)}</button>` : ''}</section><section class="cx-detail-section"><h3>정책 동작 모드</h3><div class="cx-detail-mode"><div><strong>${d.mode === 'block' ? '차단 모드' : '모니터링 모드'}</strong><p>체험용 모드를 전환할 수 있습니다.</p></div><button class="cx-switch ${d.mode === 'block' ? 'is-on' : ''}" role="switch" aria-checked="${d.mode === 'block'}" aria-label="차단 모드" data-action="toggle-domain-mode" data-id="${esc(d.id)}"><span></span></button></div></section><div class="cx-inline-banner">${icon('info', 17)}<span>변경 내용은 이 브라우저에만 저장됩니다. 실제 서비스에는 적용되지 않습니다.</span></div></div>`;
    } else if (overlay.type === 'event') {
      const e = events.find(item => item.id === overlay.id); if (!e) return '';
      inner = `<div class="cx-dialog-heading"><div><span class="cx-eyebrow">SECURITY EVENT · SAMPLE</span><h2 id="cx-dialog-title">${e.name}</h2></div><button class="cx-icon-btn" data-action="close-overlay" aria-label="이벤트 상세 닫기">${icon('close')}</button></div><div class="cx-dialog-body"><div class="cx-detail-status"><span class="cx-action-tag ${e.action === '차단' ? 'is-blocked' : 'is-detected'}">${e.action}</span><span class="cx-subtle-tag">샘플 이벤트</span></div><p class="cx-event-description">${e.note}</p><dl class="cx-detail-list"><div><dt>시간 · 예시</dt><dd>${e.time}</dd></div><div><dt>도메인</dt><dd>${e.domain}</dd></div><div><dt>출발지 IP · 예시</dt><dd>${e.ip}</dd></div><div><dt>요청</dt><dd><code>${e.method} ${e.path}</code></dd></div><div><dt>적용 정책</dt><dd>${e.rule}</dd></div></dl><section class="cx-detail-section"><h3>요청 내용 · 예시</h3><pre class="cx-payload"><code>${esc(e.payload)}</code></pre></section><div class="cx-inline-banner">${icon('info', 17)}<span>실제 수집 로그가 아닙니다. 샘플 IP와 요청으로 구성된 설명용 데이터입니다.</span></div></div>`;
    } else if (overlay.type === 'reset') {
      inner = `<div class="cx-dialog-heading"><h2 id="cx-dialog-title">체험 데이터를 초기화할까요?</h2><button class="cx-icon-btn" data-action="close-overlay" aria-label="초기화 창 닫기">${icon('close')}</button></div><div class="cx-dialog-body"><p>이 브라우저에서 추가한 도메인, 정책, 알림 설정이 삭제되고 처음의 샘플 데이터로 돌아갑니다.</p><div class="cx-dialog-actions"><button class="cx-btn cx-secondary" data-action="close-overlay">취소</button><button class="cx-btn cx-primary" data-action="reset-confirm">초기화하기</button></div></div>`;
    }
    return `<div class="cx-overlay ${overlay.type === 'reset' ? 'cx-modal-overlay' : ''}" data-action="overlay-background"><section class="cx-dialog ${overlay.type === 'reset' ? 'cx-modal' : 'cx-drawer'}" role="dialog" aria-modal="true" aria-labelledby="cx-dialog-title" tabindex="-1">${inner}</section></div>`;
  }
  function focusDialog() { later(() => container.querySelector('.cx-dialog button')?.focus(), 25); }
  function refreshWizard(moveToTop = true) {
    saveDraft(); render();
    if (moveToTop) later(() => {
      const section = container.querySelector('.cx-wizard-wrap');
      const heading = container.querySelector('.cx-wizard-title h2, .cx-success-card h2');
      if (heading) { heading.setAttribute('tabindex', '-1'); heading.focus({ preventScroll: true }); }
      section?.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    }, 0);
  }
  function startPreparation(fail) {
    if (draft.busy) return;
    draft.busy = true; draft.ready = false; draft.dnsReady = false; draft.error = ''; draft.checks = { ownership: 'checking' }; render();
    const steps = ['ownership', 'tls', 'origin', 'policy'];
    steps.forEach((key, i) => later(() => {
      if (fail && key === 'origin') { draft.checks[key] = 'error'; draft.busy = false; draft.error = '원본 연결 실패 예시입니다. 실제 서비스에서는 주소·포트·접근 허용을 확인합니다. “준비 과정 체험”을 눌러 정상 흐름을 다시 볼 수 있습니다.'; saveDraft(); render(); return; }
      if (fail && i > 2) return;
      draft.checks[key] = 'done';
      if (i < 3) draft.checks[steps[i + 1]] = 'checking';
      if (i === 3) { draft.busy = false; draft.ready = true; saveDraft(); }
      render();
    }, 420 * (i + 1)));
  }
  function startDns(fail) {
    if (draft.busy || !draft.ready || (draft.apex && draft.apexMethod === 'unsupported')) return;
    draft.busy = true; draft.dnsReady = false; draft.error = ''; render();
    later(() => { draft.busy = false; draft.dnsReady = !fail; draft.error = fail ? 'CNAME 대상 불일치 예시입니다. 이름과 대상을 확인한 뒤 “DNS 연결 시뮬레이션”으로 다시 확인해 보세요.' : ''; saveDraft(); render(); }, 900);
  }
  async function copy(text) {
    try { await navigator.clipboard.writeText(text); toast('체험용 값을 복사했습니다. 실제 DNS에는 등록하지 마세요.'); }
    catch { toast('복사 권한이 없어 자동 복사하지 못했습니다. 표시된 값을 선택해 복사해 주세요.'); }
  }
  function handleClick(event) {
    const el = event.target.closest('[data-action]'); if (!el || !container.contains(el)) return;
    const action = el.dataset.action;
    if (el.disabled) return;
    if (action === 'toggle-nav') { state.mobileOpen = !state.mobileOpen; render(); }
    else if (action === 'new-domain') { draft = freshDraft(); saveDraft(); if (view === 'connect') refreshWizard(); else location.hash = '#/app/connect'; }
    else if (action === 'refresh') { state.lastRefresh = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }); render(); toast('샘플 화면을 새로고침했습니다. 실제 데이터를 조회하지 않습니다.'); }
    else if (action === 'domain-detail' || action === 'event-detail') { state.overlay = { type: action === 'domain-detail' ? 'domain' : 'event', id: el.dataset.id }; render(); focusDialog(); }
    else if (action === 'close-overlay' || (action === 'overlay-background' && event.target === el)) { state.overlay = null; render(); }
    else if (action === 'toggle-domain-mode') { const d = data.domains.find(item => item.id === el.dataset.id); if (d) { d.mode = d.mode === 'block' ? 'monitor' : 'block'; persist(); render(); toast('체험용 정책 모드를 저장했습니다.'); } }
    else if (action === 'copy-domain-cname') { const d = data.domains.find(item => item.id === el.dataset.id); if (d) copy(d.cname); }
    else if (action === 'resume-domain') { const d = data.domains.find(item => item.id === el.dataset.id); if (d) { draft = { ...freshDraft(), ...d, step: 2, ready: false, dnsReady: false, checks: {} }; saveDraft(); state.overlay = null; location.hash = '#/app/connect'; } }
    else if (action === 'set-mode') { const d = selectedDomain(); if (d) { d.mode = el.dataset.mode; persist(); render(); toast('체험용 동작 모드를 저장했습니다.'); } }
    else if (action === 'toggle-rule') { const d = selectedDomain(); if (d && Object.hasOwn(defaults, el.dataset.key)) { d.rules[el.dataset.key] = !d.rules[el.dataset.key]; persist(); render(); toast('체험용 보안 정책을 저장했습니다.'); } }
    else if (action === 'reset-dialog') { state.overlay = { type: 'reset' }; render(); focusDialog(); }
    else if (action === 'reset-confirm') { data = seed(); draft = freshDraft(); state.overlay = null; state.selectedDomain = data.domains[0].id; state.savedNotice = false; persist(); saveDraft(); render(); toast('체험 데이터를 초기화했습니다.'); }
    else if (action === 'fill-example') { draft.hostname = 'www.my-site.example'; draft.origin = '203.0.113.10'; draft.protocol = 'https'; draft.port = '443'; draft.apex = false; render(); }
    else if (action === 'simulate-prepare') startPreparation(false);
    else if (action === 'simulate-prepare-error') startPreparation(true);
    else if (action === 'wizard-back' && !draft.busy) { draft.step = Math.max(1, draft.step - 1); draft.error = ''; refreshWizard(); }
    else if (action === 'wizard-first' && !draft.busy) { draft.step = 1; draft.error = ''; refreshWizard(); }
    else if (action === 'wizard-dns' && draft.ready && !draft.busy) { draft.step = 3; draft.error = ''; refreshWizard(); }
    else if (action === 'copy-cname') copy(draft.cname);
    else if (action === 'copy-record') copy(`체험용 예시 · 실제 DNS에 등록하지 마세요.\n${draft.apex ? '@' : draft.hostname}\t${recordType()}\t${draft.cname}\tTTL 300`);
    else if (action === 'simulate-dns') startDns(false);
    else if (action === 'simulate-dns-error') startDns(true);
    else if (action === 'wizard-finish' && draft.dnsReady && draft.ready && !draft.busy) {
      const item = { id: draft.id, hostname: draft.hostname, origin: draft.origin, protocol: draft.protocol, port: draft.port, apex: draft.apex, cname: draft.cname, connection: 'active', mode: 'block', rules: { ...defaults }, requests: '—', blocked: '—', created: new Date().toISOString().slice(0, 10), sample: true };
      const index = data.domains.findIndex(d => d.id === item.id || d.hostname === item.hostname);
      if (index >= 0) data.domains[index] = item; else data.domains.push(item);
      persist(); draft.step = 4; draft.error = ''; refreshWizard();
    }
  }
  function handleSubmit(event) {
    if (event.target.id === 'cx-domain-form') {
      event.preventDefault(); const fd = new FormData(event.target);
      const hostname = normalizedHost(String(fd.get('hostname') || '')); const origin = normalizedHost(String(fd.get('origin') || ''));
      const port = String(fd.get('port') || ''); const protocol = String(fd.get('protocol') || 'https');
      draft.hostname = String(fd.get('hostname') || '').trim(); draft.origin = String(fd.get('origin') || '').trim(); draft.apex = !!fd.get('apex'); draft.protocol = protocol; draft.port = port;
      let error = '';
      if (!validDomain(hostname)) error = '도메인 형식을 확인해 주세요. https://와 경로를 제외한 www.example.com 형태로 입력합니다.';
      else if (!validOrigin(origin)) error = '원본 서버의 유효한 IP 또는 전용 도메인을 입력해 주세요. 프로토콜과 경로는 제외합니다.';
      else if (hostname === origin || origin === 'xwaf.example' || origin.endsWith('.xwaf.example')) error = '요청이 xWAF로 되돌아가지 않도록, 보호할 도메인과 다른 원본 전용 주소 또는 IP를 입력해 주세요.';
      else if (!/^\d+$/.test(port) || +port < 1 || +port > 65535) error = '포트는 1부터 65535 사이의 숫자를 입력해 주세요.';
      else if (data.domains.some(d => d.hostname === hostname && d.id !== draft.id)) error = '이미 등록된 도메인입니다. 도메인 목록에서 연결 상태를 확인해 주세요.';
      draft.error = error;
      if (error) { const errorRegion = container.querySelector('#cx-domain-error'); if (errorRegion) errorRegion.innerHTML = wizardErrors(); return; }
      const id = draft.id || `demo-${globalThis.crypto?.randomUUID ? crypto.randomUUID().split('-')[0] : Math.random().toString(36).slice(2, 10)}`;
      draft = { ...draft, hostname, origin, id, cname: `${id}.edge.xwaf.example`, step: 2, checks: {}, ready: false, dnsReady: false, error: '' }; refreshWizard();
    } else if (event.target.id === 'cx-settings-form') {
      event.preventDefault(); const fd = new FormData(event.target);
      data.settings = { email: String(fd.get('notification-email') || '').trim(), attacks: !!fd.get('notify-attacks'), connection: !!fd.get('notify-connection'), summary: !!fd.get('notify-summary') };
      persist(); state.savedNotice = true; render(); toast('알림 설정을 이 브라우저에 저장했습니다.');
    }
  }
  function handleInput(event) {
    if (event.target.name === 'domain-search') { state.search = event.target.value; container.querySelector('#cx-domain-results').innerHTML = domainRows(filteredDomains()); }
    else if (event.target.name === 'event-search') { state.eventSearch = event.target.value; container.querySelector('#cx-event-results').innerHTML = eventRows(filteredEvents()); }
  }
  function handleChange(event) {
    const name = event.target.name;
    if (name === 'domain-filter') { state.domainFilter = event.target.value; container.querySelector('#cx-domain-results').innerHTML = domainRows(filteredDomains()); }
    else if (name === 'event-filter') { state.eventFilter = event.target.value; container.querySelector('#cx-event-results').innerHTML = eventRows(filteredEvents()); }
    else if (name === 'range') { state.range = event.target.value; render(); }
    else if (name === 'rule-domain') { state.selectedDomain = event.target.value; render(); }
    else if (name === 'apex') { draft.apex = event.target.checked; container.querySelector('#cx-apex-note')?.classList.toggle('is-hidden', !draft.apex); }
    else if (name === 'protocol') { const field = container.querySelector('input[name="port"]'); draft.protocol = event.target.value; if (field && (field.value === '443' || field.value === '80' || !field.value)) { field.value = draft.protocol === 'https' ? '443' : '80'; draft.port = field.value; } }
    else if (name === 'apex-method') { draft.apexMethod = event.target.value; draft.dnsReady = false; draft.error = ''; refreshWizard(false); }
    else if (name?.startsWith('notify-')) { event.target.closest('.cx-switch')?.classList.toggle('is-on', event.target.checked); }
  }
  function handleKey(event) {
    if (event.key === 'Escape') { if (state.overlay) { state.overlay = null; render(); } else if (state.mobileOpen) { state.mobileOpen = false; render(); } }
    if (event.key === 'Tab' && state.overlay) {
      const dialog = container.querySelector('.cx-dialog');
      const focusable = dialog ? [...dialog.querySelectorAll('button:not([disabled]), a[href], input, select, textarea, [tabindex="0"]')] : [];
      if (!focusable.length) return;
      const first = focusable[0]; const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  }
  container.addEventListener('click', handleClick); container.addEventListener('submit', handleSubmit); container.addEventListener('input', handleInput); container.addEventListener('change', handleChange); container.addEventListener('keydown', handleKey);
  render();
  return () => { alive = false; timers.forEach(clearTimeout); timers.clear(); container.removeEventListener('click', handleClick); container.removeEventListener('submit', handleSubmit); container.removeEventListener('input', handleInput); container.removeEventListener('change', handleChange); container.removeEventListener('keydown', handleKey); };
}
