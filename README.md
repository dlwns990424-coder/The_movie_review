🎬 THE MOVIE

TMDB API를 활용하여 영화와 TV 시리즈 정보를 탐색하고, 리뷰 작성 및 사용자별 찜 목록 기능을 제공하는 반응형 OTT 플랫폼입니다.

🔗 Demo
https://dlwns990424-coder.github.io/The_movie_review/

🔗 GitHub
https://github.com/dlwns990424-coder/The_movie_review

📖 프로젝트 소개

THE MOVIE는 TMDB API를 활용하여 영화와 TV 시리즈 정보를 제공하는 웹 애플리케이션입니다.

사용자는 인기 영화와 시리즈를 탐색하고, 상세 정보와 출연진 정보를 확인할 수 있으며 리뷰를 작성하고 원하는 콘텐츠를 찜 목록에 저장할 수 있습니다.

또한 Desktop, Tablet, Mobile 환경에 최적화된 반응형 UI를 적용하여 다양한 디바이스에서 동일한 사용자 경험을 제공합니다.

✨ 주요 기능
🏠 Home
글로벌 TOP10
인기 영화
인기 시리즈

Hover Preview Card
상세 페이지 이동
찜하기

🎥 Movie / TV
영화 및 시리즈 목록 조회
장르별 필터
상세 페이지

🔍 Search
영화 / 시리즈 통합 검색
검색 결과 출력

👤 Person
배우 상세 정보
출연 영화 및 시리즈 조회
소개 더보기 기능

⭐ Wishlist
사용자별 찜 목록
영화 / 시리즈 저장 및 삭제

✍ Review
리뷰 작성
리뷰 수정 및 삭제

👤 Login
회원가입
로그인
로그아웃

🛠 Tech Stack
Front-End :
React
Vite
Tailwind CSS

Library :
React Router DOM
Axios
Swiper
Lucide React
React Helmet Async
Sonner

API :
TMDB API

Storage :
LocalStorage

Deployment :
GitHub Pages

🚀 주요 구현 내용
TMDB API를 활용한 영화 및 시리즈 데이터 조회
React Router를 활용한 SPA 라우팅
Context API를 이용한 로그인 상태 관리
LocalStorage를 활용한 사용자별 찜 목록 및 회원 정보 관리
Swiper를 활용한 다양한 콘텐츠 슬라이더 구현
Skeleton UI를 적용하여 로딩 경험 개선
Hover Preview Card를 통한 빠른 콘텐츠 미리보기
Desktop / Tablet / Mobile 반응형 UI 구현

🔧 Trouble Shooting

1. GitHub Pages 배포 오류

GitHub Pages에서 BrowserRouter 사용 시 새로고침 또는 직접 URL 접근 시 404 오류가 발생했습니다.

➡️ HashRouter를 적용하여 GitHub Pages 환경에서도 정상적으로 라우팅되도록 개선했습니다.

2. 사용자별 찜 목록 관리

초기에는 모든 사용자가 동일한 LocalStorage를 사용하여 같은 찜 목록을 공유하는 문제가 있었습니다.

➡️ 사용자 ID를 이용하여 wishlist-{userId} 형태로 저장하도록 수정하여 사용자별 데이터를 분리했습니다.

3. Hover Preview Card UI 개선

Swiper 내부에서 Hover Card가 잘리거나 깜빡이는 문제가 발생했습니다.

➡️ overflow, z-index, Hover Delay를 적용하여 자연스러운 인터랙션을 구현했습니다.

4. Skeleton UI 적용

API 응답 전까지 화면이 비어 보이는 문제가 있었습니다.

➡️ Skeleton UI를 적용하여 로딩 중에도 콘텐츠 구조를 미리 보여주도록 개선했습니다.

📚 프로젝트를 통해 배운 점 :
이번 프로젝트를 통해 React의 컴포넌트 기반 설계와 상태 관리, Context API를 활용한 전역 상태 관리, TMDB API를 이용한 비동기 데이터 처리 방식을 익힐 수 있었습니다.

또한 GitHub Pages 배포 과정에서 발생한 라우팅 문제를 해결하며 배포 환경에 따른 React Router의 동작 방식과 문제 해결 경험을 쌓을 수 있었으며, 반응형 UI와 사용자 경험(UX)을 고려한 인터페이스 설계의 중요성을 배울 수 있었습니다.
