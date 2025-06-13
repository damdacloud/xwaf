## ✅ 전체 폴더 구조

```
xwaf/
├── index.html                      ← 루트(선택적으로 리다이렉트용)
├── ko/
│   └── index.html                 ← 한국어 메인
├── en/
│   └── index.html                 ← 영어 메인
├── ja/
│   └── index.html                 ← 일본어 메인
├── fr/
│   └── index.html                 ← 프랑스어 메인
├── de/
│   └── index.html                 ← 독일어 메인
├── es/
│   └── index.html                 ← 스페인어 메인
├── lu/
│   └── index.html                 ← 룩셈부르크어 메인
├── res/
│   ├── css/
│   │   ├── bootstrap.min.css
│   │   ├── font-awesome-all.css
│   │   ├── flaticon.css
│   │   ├── swiper.min.css
│   │   ├── animate.css
│   │   ├── magnific-popup.css
│   │   └── custom.css             ← Swiper 관련 CSS 포함
│   ├── fonts/
│   ├── images/
│   ├── js/
│   │   ├── jquery-3.6.0.min.js
│   │   ├── bootstrap.min.js
│   │   ├── validator.min.js
│   │   ├── jquery.waypoints.min.js
│   │   ├── jquery.counterup.min.js
│   │   ├── wow.js
│   │   ├── swiper.min.js
│   │   ├── jquery.magnific-popup.min.js
│   │   ├── parallaxie.js
│   │   ├── SmoothScroll.js
│   │   ├── function.js
│   │   ├── aos.js
│   │   ├── fancybox.umd.js
│   │   └── common.js             ← 언어 버튼 자동 설정
│   └── include/
│       ├── nav.html              ← 상단 메뉴 + 언어 선택
│       ├── footer.html           ← 하단 카피라이트
│       ├── scripts.html          ← JS import용 (공통)
│       ├── ourclients-ko.html
│       ├── ourclients-en.html
│       ├── contactus-ko.html
│       ├── contactus-en.html
│       ├── contactus-ja.html
│       ├── contactus-fr.html
│       ├── contactus-de.html
│       ├── contactus-es.html
│       └── contactus-lu.html
└── README.md
```

---

---

## ✅ 공통 로딩 구조

각 언어별 `/ko/index.html`, `/en/index.html` 등의 구성에서 다음 영역이 공통적으로 포함됨:

### 🔹 `<head>` 내 CSS 로드

```html
<link href="../res/css/bootstrap.min.css" rel="stylesheet">
<link href="../res/css/custom.css" rel="stylesheet"> <!-- Swiper CSS 포함 -->
```

### 🔹 `<header>` 영역

```html
<header>
  <div id="navbar-container"></div>
</header>
```

### 🔹 콘텐츠 중간 (예: 클라이언트 로고)

```html
<section id="clients">
  <div id="ourclients-container"></div>
</section>
```

### 🔹 연락처 영역

```html
<section id="contact">
  <div id="contactus-container"></div>
</section>
```

### 🔹 푸터

```html
<footer>
  <div id="footer-container"></div>
</footer>
```

---

## ✅ `<body>` 끝에 공통 JS 스크립트 및 로더

```html
<script src="../res/js/jquery-3.6.0.min.js"></script>
...
<script src="../res/js/common.js"></script>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    // 공통 요소 로딩
    fetch("../res/include/nav.html")
      .then(res => res.text())
      .then(html => document.getElementById("navbar-container").innerHTML = html);

    fetch("../res/include/ourclients-ko.html") // 언어별 맞게 변경
      .then(res => res.text())
      .then(html => {
        document.getElementById("ourclients-container").innerHTML = html;
        new Swiper(".ourclient-slider", { ... }); // Swiper 초기화
      });

    fetch("../res/include/contactus-ko.html") // 언어별 맞게 변경
      .then(res => res.text())
      .then(html => document.getElementById("contactus-container").innerHTML = html);

    fetch("../res/include/footer.html")
      .then(res => res.text())
      .then(html => document.getElementById("footer-container").innerHTML = html);
  });
</script>
```

---

## ✅ 제안 사항

| 항목                                                         | 제안                                                                  |
| ---------------------------------------------------------- | ------------------------------------------------------------------- |
| 💬 `ourclients.html` → 언어별로 분리된 것은 매우 적절합니다.               | 향후 언어 추가 시 `ourclients-xx.html` 방식 유지 추천                            |
| 🧠 `contactus.html`도 언어별로 잘 나눠져 있으므로, 자동 언어 감지로 include 가능 | `common.js`에서 현재 언어 코드 추출 후 동적 경로 구성도 고려 가능                         |
| ✅ `swiper`는 반드시 `Swiper()` 호출 위치가 DOM 삽입 이후여야 하므로 현재 위치 유지 | 예: `fetch().then().then(() => new Swiper(...))` 형식은 OK              |
| 🎯 `custom.css` 맨 아래 Swiper용 클래스 스타일 필수                    | 누락 시 layout 무너질 수 있으므로 확인 필요 (`.swiper-slide`, `.swiper-wrapper` 등) |

---
