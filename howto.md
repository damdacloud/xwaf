## ✅ 전체 폴더 구조

```
xwaf/
├── index.html                      ← 루트 접근용 (선택)
├── ko/
│   └── index.html                 ← 한국어 페이지
├── en/
│   └── index.html                 ← 영어 페이지
├── ja/
│   └── index.html                 ← 일본어 페이지
├── fr/
│   └── index.html                 ← 프랑스어 페이지
├── de/
│   └── index.html                 ← 독일어 페이지
├── es/
│   └── index.html                 ← 스페인어 페이지
├── lu/
│   └── index.html                 ← 룩셈부르크어 페이지
├── res/
│   ├── css/
│   ├── fonts/
│   ├── images/
│   ├── js/
│   │   └── common.js             ← 공통 스크립트 및 언어 버튼 처리
│   └── include/
│       ├── nav.html              ← 공통 네비게이션
│       └── scripts.html          ← 공통 JS 파일 import
└── README.md
```

---

## ✅ 각 index.html 구조 요약 (`ko/index.html` 등)

### `<header>` 부분

```html
<header>
  <div id="navbar-container"></div>
</header>
```

### `<body>` 끝나기 전

```html
<div id="scripts-container"></div>
```

### 맨 아래에 추가되는 JavaScript

```html
<script>
  // nav 삽입
  fetch("../res/include/nav.html")
    .then(r => r.text())
    .then(html => document.getElementById("navbar-container").innerHTML = html);

  // script 삽입
  fetch("../res/include/scripts.html")
    .then(r => r.text())
    .then(html => document.getElementById("scripts-container").innerHTML = html);
</script>
```

---

## ✅ nav.html 핵심 구조

```html
<!-- nav.html -->
<nav>...</nav>  <!-- 공통 메뉴 -->
<div class="lang">
  <button type="button" id="lang-button">Language</button>
  <div class="depth">
    <ul>
      <li><a href="https://xwaf.io/en/" target="_blank">English</a></li>
      ...
    </ul>
  </div>
</div>
```

---

## ✅ scripts.html 예시

```html
<!-- scripts.html -->
<script src="/res/js/aos.js"></script>
<script src="/res/js/fancybox.umd.js"></script>
<script src="/res/js/common.js"></script>
```

---

## ✅ common.js 내 언어 버튼 자동 처리

```javascript
document.addEventListener("DOMContentLoaded", function () {
  const langMap = {
    ko: "한국어",
    en: "English",
    ja: "日本語",
    fr: "Français",
    de: "Deutsch",
    es: "Español",
    lu: "Lux."
  };

  const currentLang = location.pathname.split("/")[1] || "ko";
  const displayLang = langMap[currentLang] || "Language";
  const btn = document.getElementById("lang-button");
  if (btn) btn.textContent = displayLang;
});
```

---

## ✅ 동작 흐름 요약

1. 각 언어 페이지(`ko/index.html`, `en/index.html` 등)는 공통 `nav.html`, `scripts.html`을 fetch로 불러옴
2. `nav.html`은 상단 네비게이션 + 언어 선택 메뉴 포함
3. `common.js`는 현재 언어를 자동으로 감지해 버튼에 표시 (`한국어`, `English`, ...)

---
