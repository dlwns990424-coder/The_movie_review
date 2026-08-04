import { useEffect, useState } from "react";

import ContentHero from "../components/sections/ContentHero";
import ContentHeroSkeleton from "../components/skeleton/ContentHeroSkeleton";
import Loading from "../components/common/Loading";
import PageTitle from "../components/common/PageTitle";

import GenrePopularMovies from "./components/GenrePopularMovies";
import GenreTopRatedMovies from "./components/GenreTopRatedMovies";
import PopularContents from "../components/sections/PopularContents";
import Upcoming from "../components/sections/Upcoming";
import TopRated from "../components/sections/TopRated";
import LatestReleasedMovies from "./components/LatestReleasedMovies";

import {
  getMovieGenres,
  getPopularMoviesByGenre,
  getMovieDetail,
} from "../../api/movieApi";

import { getLogo } from "../../api/logoImgApi";

export default function Movie() {
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [movieGenres, setMovieGenres] = useState([]);

  const [heroItem, setHeroItem] = useState(null);
  const [heroDetail, setHeroDetail] = useState(null);
  const [heroLogo, setHeroLogo] = useState(null);

  // 페이지 최초 진입 로딩
  const [pageLoading, setPageLoading] = useState(true);

  // 장르 변경 시 Hero 스켈레톤
  const [heroLoading, setHeroLoading] = useState(false);

  // 처음 페이지가 열렸을 때 장르 목록 가져오기
  useEffect(() => {
    const loadGenres = async () => {
      try {
        setPageLoading(true);

        const genreData = await getMovieGenres();

        setMovieGenres(genreData);

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

  // 선택한 장르가 바뀔 때마다 Hero 변경
  useEffect(() => {
    if (!selectedGenre) return;

    const loadGenreHero = async () => {
      try {
        // 최초 진입이 끝난 뒤 장르를 바꿀 때만 스켈레톤 표시
        if (!pageLoading) {
          setHeroLoading(true);
        }

        const movieData = await getPopularMoviesByGenre(selectedGenre.id);

        const selectedMovie = movieData.results.find(
          (movie) => movie.backdrop_path,
        );

        if (!selectedMovie) {
          setHeroItem(null);
          setHeroDetail(null);
          setHeroLogo(null);
          return;
        }

        const [detailData, logoData] = await Promise.all([
          getMovieDetail(selectedMovie.id),
          getLogo("movie", selectedMovie.id),
        ]);

        setHeroItem(selectedMovie);
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

  // 다른 페이지에서 Movie 페이지로 처음 들어왔을 때
  if (pageLoading) {
    return <Loading />;
  }

  return (
    <div>
      <PageTitle title="영화" />

      {/* 장르 변경 시 Hero 영역만 스켈레톤 */}
      {heroLoading ? (
        <ContentHeroSkeleton />
      ) : (
        heroItem &&
        heroDetail && (
          <ContentHero
            item={heroItem}
            detail={heroDetail}
            mediaType="movie"
            heroLogo={heroLogo}
            genres={movieGenres}
            selectedGenre={selectedGenre}
            onGenreChange={setSelectedGenre}
            showGenreSelector
          />
        )
      )}

      <GenrePopularMovies
        selectedGenre={selectedGenre}
        heroTitle={heroItem?.title}
      />

      <GenreTopRatedMovies
        selectedGenre={selectedGenre}
        heroTitle={heroItem?.title}
      />

      <PopularContents mediaType="movie" title="인기 영화" />

      <TopRated mediaType="movie" title="평점 높은 영화" />

      <LatestReleasedMovies title="최신 개봉 영화" />

      <Upcoming mediaType="movie" title="개봉 예정 영화" />
    </div>
  );
}
