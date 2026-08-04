import { useEffect, useState } from "react";

import ContentHero from "../components/sections/ContentHero";
import ContentHeroSkeleton from "../components/skeleton/ContentHeroSkeleton";
import Loading from "../components/common/Loading";
import PageTitle from "../components/common/PageTitle";

import PopularContents from "../components/sections/PopularContents";
import TopRated from "../components/sections/TopRated";
import Upcoming from "../components/sections/Upcoming";

import GenrePopularTv from "./components/GenrePopularTv";
import GenreTopRatedTv from "./components/GenreTopRatedTv";
import LatestReleasedTv from "./components/LatestReleasedTv";

import { getTvGenres, getPopularTvByGenre, getTvDetail } from "../../api/tvApi";

import { getLogo } from "../../api/logoImgApi";

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

  // 다른 페이지에서 Tv 페이지로 처음 들어왔을 때 전체 로딩
  const [pageLoading, setPageLoading] = useState(true);

  // Tv 페이지 안에서 장르를 변경했을 때 Hero 스켈레톤
  const [heroLoading, setHeroLoading] = useState(false);

  // 처음 페이지가 열렸을 때 시리즈 장르 목록 요청
  useEffect(() => {
    const loadGenres = async () => {
      try {
        setPageLoading(true);

        const genreData = await getTvGenres();

        setTvGenres(genreData);

        // 첫 번째 장르를 기본 장르로 선택
        if (genreData.length > 0) {
          setSelectedGenre(genreData[0]);
        } else {
          setPageLoading(false);
        }
      } catch (error) {
        console.log(error);
        setPageLoading(false);
      }
    };

    loadGenres();
  }, []);

  // 선택한 장르가 바뀔 때마다 Hero 시리즈 변경
  useEffect(() => {
    if (!selectedGenre) return;

    const loadGenreHero = async () => {
      try {
        // 최초 페이지 진입이 끝난 뒤 장르를 변경할 때만 스켈레톤 표시
        if (!pageLoading) {
          setHeroLoading(true);
        }

        // 선택한 장르의 인기 시리즈 요청
        const tvData = await getPopularTvByGenre(selectedGenre);

        // Hero 배경 이미지가 있는 시리즈 선택
        const selectedTv = tvData.results.find((tv) => tv.backdrop_path);

        // Hero에 사용할 시리즈가 없는 경우
        if (!selectedTv) {
          setHeroItem(null);
          setHeroDetail(null);
          setHeroLogo(null);
          return;
        }

        // 상세정보와 로고를 동시에 요청
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
        setPageLoading(false);
        setHeroLoading(false);
      }
    };

    loadGenreHero();
  }, [selectedGenre]);

  // Home 등 다른 페이지에서 Tv 페이지로 처음 이동했을 때
  if (pageLoading) {
    return <Loading />;
  }

  return (
    <div>
      <PageTitle title="시리즈" />

      {/* 장르 변경 시 Hero 영역만 스켈레톤 */}
      {heroLoading ? (
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
