import { useEffect, useMemo, useState } from "react";

import { getTvGenres, getPopularTvByGenre, getTvDetail } from "../../api/tvApi";
import ContentHeroSkeleton from "../components/skeleton/ContentHeroSkeleton";
import PageTitle from "../components/common/PageTitle";
import ContentHero from "../components/sections/ContentHero";
import PopularContents from "../components/sections/PopularContents";
import TopRated from "../components/sections/TopRated";
import Upcoming from "../components/sections/Upcoming";
import GenrePopularTv from "./components/GenrePopularTv";
import GenreTopRatedTv from "./components/GenreTopRatedTv";
import { getLogo } from "../../api/logoImgApi";
import LatestReleasedTv from "./components/LatestReleasedTv";

export default function Tv() {
  // 현재 선택된 시리즈 장르
  const [selectedGenre, setSelectedGenre] = useState(null);

  // 시리즈 장르 목록
  const [tvGenres, setTvGenres] = useState([]);

  // Hero에 표시할 시리즈
  const [heroItem, setHeroItem] = useState(null);

  // Hero 시리즈 상세정보
  const [heroDetail, setHeroDetail] = useState(null);

  // Hero 시리즈 로고
  const [heroLogo, setHeroLogo] = useState(null);

  // Hero 로딩 상태
  const [loading, setLoading] = useState(true);

  // 처음 페이지가 열렸을 때 시리즈 장르 목록 요청
  useEffect(() => {
    const loadGenres = async () => {
      try {
        const genreData = await getTvGenres();

        setTvGenres(genreData);

        // 첫 번째 장르를 기본 장르로 선택
        if (genreData.length > 0) {
          setSelectedGenre(genreData[0]);
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    loadGenres();
  }, []);

  // 선택한 장르가 바뀔 때마다 Hero 시리즈 변경
  useEffect(() => {
    if (!selectedGenre) return;

    const loadGenreHero = async () => {
      try {
        setLoading(true);

        // 선택한 장르의 인기 시리즈 요청
        const tvData = await getPopularTvByGenre(selectedGenre);

        // Hero 배경으로 사용할 이미지가 있는 시리즈 선택
        const selectedTv = tvData.results.find((tv) => tv.backdrop_path);

        // 사용할 시리즈가 없는 경우 상태 초기화
        if (!selectedTv) {
          setHeroItem(null);
          setHeroDetail(null);
          setHeroLogo(null);
          return;
        }

        // 선택한 시리즈의 상세정보와 로고를 동시에 요청
        const [detailData, logoData] = await Promise.all([
          getTvDetail(selectedTv.id),
          getLogo("tv", selectedTv.id),
        ]);

        setHeroItem(selectedTv);
        setHeroDetail(detailData);
        setHeroLogo(logoData);
      } catch (error) {
        console.log(error);

        setHeroItem(null);
        setHeroDetail(null);
        setHeroLogo(null);
      } finally {
        setLoading(false);
      }
    };

    loadGenreHero();
  }, [selectedGenre]);

  return (
    <div>
      <PageTitle title="시리즈" />

      {/* 시리즈 Hero */}
      {loading ? (
        <ContentHeroSkeleton />
      ) : (
        heroItem &&
        heroDetail && (
          <ContentHero
            item={heroItem}
            detail={heroDetail}
            mediaType="tv"
            heroLogo={heroLogo}
            genres={tvGenres}
            selectedGenre={selectedGenre}
            onGenreChange={setSelectedGenre}
            showGenreSelector
          />
        )
      )}

      {/* Hero와 같은 장르의 인기 시리즈 */}
      <GenrePopularTv
        selectedGenre={selectedGenre}
        heroTitle={heroItem?.name}
      />

      {/* Hero와 같은 장르의 평점 높은 시리즈 */}
      <GenreTopRatedTv
        selectedGenre={selectedGenre}
        heroTitle={heroItem?.name}
      />

      {/* 전체 인기 시리즈 */}
      <PopularContents mediaType="tv" title="인기 시리즈" />

      {/* 전체 평점 높은 시리즈 */}
      <TopRated mediaType="tv" title="평점 높은 시리즈" />

      {/* 최신 공개 시리즈 */}
      <LatestReleasedTv title="최신 공개 시리즈" />

      {/* 공개 예정 시리즈 */}
      <Upcoming mediaType="tv" title="공개 예정 시리즈" />
    </div>
  );
}
