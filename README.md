# 🎬 THE MOVIE

> TMDB API를 활용하여 영화와 TV 시리즈 정보를 탐색하고, 리뷰 작성 및 사용자별 찜 목록 기능을 제공하는 반응형 OTT 플랫폼입니다.

## 🔗 Demo

- https://dlwns990424-coder.github.io/The_movie_review/

## 📖 프로젝트 소개

THE MOVIE는 TMDB API를 활용하여 영화와 TV 시리즈 정보를 제공하는 웹 애플리케이션입니다.

사용자는 영화 및 시리즈를 검색하고, 상세 정보와 출연진 정보를 확인할 수 있으며 리뷰 작성과 사용자별 찜 목록 기능을 이용할 수 있습니다.

또한 Desktop, Tablet, Mobile 환경에 맞는 반응형 UI를 적용하여 다양한 디바이스에서 동일한 사용자 경험을 제공합니다.

---

## ✨ 주요 기능

### 🏠 Home

- 글로벌 TOP10
- 인기 영화
- 인기 시리즈
- Hover Preview Card

### 🎥 Movie / TV

- 영화 및 시리즈 목록 조회
- 장르별 필터
- 상세 정보 조회
- 추천 콘텐츠

### 👤 Person

- 배우 상세 정보
- 출연 영화 및 시리즈 조회
- 소개 더보기 기능

### 🔍 Search

- 영화 및 시리즈 통합 검색

### ⭐ Wishlist

- 사용자별 찜 목록
- 찜 추가 및 삭제

### ✍ Review

- 리뷰 작성
- 리뷰 수정
- 리뷰 삭제

### 🔐 Login

- 회원가입
- 로그인
- 로그아웃

---

## 🛠 Tech Stack

### Front-End

- React
- Vite
- Tailwind CSS

### Library

- React Router DOM
- Axios
- Swiper
- Lucide React
- React Helmet Async
- Sonner

### API

- TMDB API

### Storage

- LocalStorage

### Deployment

- GitHub Pages

---

## 📂 프로젝트 구조

```text
src
├── api
├── assets
├── components
├── constants
├── context
├── layouts
├── pages
│   ├── home
│   ├── movie
│   ├── tv
│   ├── people
│   ├── search
│   ├── wishlist
│   ├── login
│   ├── signup
│   └── notfound
├── router
└── App.jsx
```

---

## 🚀 주요 구현

- TMDB API를 활용한 영화 및 시리즈 데이터 조회
- React Router를 활용한 SPA 라우팅
- Context API를 활용한 로그인 상태 관리
- LocalStorage를 활용한 사용자별 찜 목록 관리
- Swiper를 활용한 콘텐츠 슬라이더 구현
- Hover Preview Card 구현
- Skeleton UI 적용
- 반응형 웹 구현 (Desktop / Tablet / Mobile)

---

## 🔧 Trouble Shooting

### GitHub Pages 배포

- BrowserRouter 사용 시 새로고침 및 URL 접근 시 404 오류 발생
- HashRouter를 적용하여 GitHub Pages에서도 정상적으로 동작하도록 개선

### 사용자별 찜 목록

- 모든 사용자가 동일한 LocalStorage를 사용하는 문제 발생
- 사용자 ID를 활용하여 `wishlist-{userId}` 형태로 저장하도록 수정

### Hover Preview Card

- Swiper 내부에서 Hover Card가 잘리거나 깜빡이는 문제 발생
- z-index, overflow, Hover Delay를 적용하여 자연스러운 인터랙션 구현

### Skeleton UI

- API 응답 전 화면이 비어 보이는 문제 개선
- Skeleton UI를 적용하여 사용자 경험 향상

---

## 💭 개선 사항

- Firebase 또는 백엔드 서버를 활용한 사용자 데이터 관리
- 이미지 Lazy Loading 및 코드 스플리팅을 통한 성능 최적화
- 장르, 평점, 개봉연도 등 다양한 검색 필터 제공
- 리뷰 좋아요 및 댓글 기능 추가

---

## 📚 프로젝트를 통해 배운 점

- React 컴포넌트 기반 설계와 상태 관리 방법
- Context API를 활용한 전역 상태 관리
- TMDB API를 활용한 비동기 데이터 처리
- GitHub Pages 환경에 맞는 React 프로젝트 배포
- 반응형 UI와 사용자 경험(UX)을 고려한 인터페이스 설계
