import { useEffect, useState } from "react";
import { getTrendingAll } from "../../api/trendingApi";
import { getContentDetail } from "../../api/contentApi";
import { getLogo } from "../../api/logoImgApi";
import Loading from "../../components/common/Loading";
import ContentHero from "../../components/sections/ContentHero";
import GlobalTop10 from "./components/GlobalTop10";
import PopularContent from "./components/PopularContent";
import NowPlaying from "./components/NowPlaying";

export default function Home() {
  // Hero에 사용할 기본 콘텐츠 정보
  const [heroItem, setHeroItem] = useState(null);

  // Hero에 사용할 콘텐츠 상세 정보
  const [heroDetail, setHeroDetail] = useState(null);

  // Hero에 사용할 로고 정보
  const [heroLogo, setHeroLogo] = useState(null);

  // 글로벌 TOP10 목록
  const [top10List, setTop10List] = useState([]);

  // Home 데이터 로딩 상태
  const [loading, setLoading] = useState(true);

  // Home 컴포넌트가 처음 실행될 때 한 번만 데이터 요청
  useEffect(() => {
    (async () => {
      try {
        // 오늘의 트렌딩 콘텐츠 가져오기
        const trendingData = await getTrendingAll();

        // 사람 데이터는 제외하고 영화와 시리즈만 필터링
        const contentList = trendingData.results.filter(
          (item) => item.media_type === "movie" || item.media_type === "tv",
        );

        // 영화 또는 시리즈 데이터가 없으면 실행 중단
        if (contentList.length === 0) return;

        // 트렌딩 목록의 첫 번째 콘텐츠를 Hero로 선택
        const selectedItem = contentList[0];

        // 상위 10개 콘텐츠만 추출
        const top10Contents = contentList.slice(0, 10);

        // TOP10 각각의 로고를 가져와 기존 콘텐츠에 추가
        const top10WithLogos = await Promise.all(
          top10Contents.map(async (item) => {
            const logo = await getLogo(item.media_type, item.id);

            return {
              ...item,
              logo,
            };
          }),
        );

        // Hero에 사용할 첫 번째 콘텐츠의 상세 정보 가져오기
        const detailData = await getContentDetail(
          selectedItem.media_type,
          selectedItem.id,
        );

        // 로고가 추가된 TOP10 목록 저장
        setTop10List(top10WithLogos);

        // TOP10 첫 번째 콘텐츠의 로고를 Hero에서도 재사용
        setHeroLogo(top10WithLogos[0]?.logo ?? null);

        // Hero 기본 콘텐츠 정보 저장
        setHeroItem(selectedItem);

        // Hero 상세 정보 저장
        setHeroDetail(detailData);
      } catch (error) {
        // 데이터 요청 중 발생한 오류 확인
        console.log(error);
      } finally {
        // 요청 성공 여부와 관계없이 로딩 종료
        setLoading(false);
      }
    })();
  }, []);

  // 데이터 요청 중에는 로딩 컴포넌트 출력
  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      {/* Hero 데이터가 준비된 경우에만 출력 */}
      {heroItem && heroDetail && (
        <ContentHero
          item={heroItem}
          detail={heroDetail}
          mediaType={heroItem.media_type}
          heroLogo={heroLogo}
        />
      )}

      {/* TOP10 목록을 props로 전달 */}
      <GlobalTop10 items={top10List} />
      <PopularContent />
      <NowPlaying />
    </div>
  );
}
