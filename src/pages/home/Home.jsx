import { useEffect, useState } from "react";
import { getTrendingAll } from "../../api/trendingApi";
import { getContentDetail } from "../../api/contentApi";
import { getLogo } from "../../api/logoImgApi";

import Loading from "../components/common/Loading";
import PageTitle from "../components/common/PageTitle";
import ContentHero from "../components/sections/ContentHero";
import PopularContents from "../components/sections/PopularContents";

import GlobalTop10 from "./components/GlobalTop10";
import PopularPeople from "../components/sections/PopularPeople";
import Upcoming from "../components/sections/Upcoming";
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

  useEffect(() => {
    const getHomeData = async () => {
      try {
        // 오늘의 트렌딩 콘텐츠 가져오기
        const trendingData = await getTrendingAll();

        // 사람 데이터는 제외하고 영화와 시리즈만 필터링
        const contentList = trendingData.results.filter(
          (item) => item.media_type === "movie" || item.media_type === "tv",
        );

        // 영화 또는 시리즈 데이터가 없으면 실행 중단
        if (contentList.length === 0) return;

        // 첫 번째 콘텐츠를 Hero로 사용
        const selectedItem = contentList[0];

        // 상위 10개 콘텐츠 추출
        const top10Contents = contentList.slice(0, 10);

        // TOP10 콘텐츠 로고 가져오기
        const top10WithLogos = await Promise.all(
          top10Contents.map(async (item) => {
            const logo = await getLogo(item.media_type, item.id);

            return {
              ...item,
              logo,
            };
          }),
        );

        // Hero 상세 정보 가져오기
        const detailData = await getContentDetail(
          selectedItem.media_type,
          selectedItem.id,
        );

        setTop10List(top10WithLogos);
        setHeroLogo(top10WithLogos[0]?.logo ?? null);
        setHeroItem(selectedItem);
        setHeroDetail(detailData);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getHomeData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <PageTitle title="홈" />

      {heroItem && heroDetail && (
        <ContentHero
          item={heroItem}
          detail={heroDetail}
          mediaType={heroItem.media_type}
          heroLogo={heroLogo}
        />
      )}

      <GlobalTop10 items={top10List} />

      <PopularContents mediaType="movie" title="인기있는 영화" />

      <PopularContents mediaType="tv" title="인기있는 시리즈" />

      <Upcoming mediaType="movie" title="개봉 예정 영화" />
      <Upcoming mediaType="tv" title="공개 예정 시리즈" />
      <PopularPeople />
    </div>
  );
}
