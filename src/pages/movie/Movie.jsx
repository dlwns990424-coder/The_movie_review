import { useEffect, useState } from "react";
import ContentHero from "../components/sections/ContentHero";
import ContentHeroSkeleton from "../components/skeleton/ContentHeroSkeleton";
import PageTitle from "../components/common/PageTitle";
import GenrePopularMovies from "./components/GenrePopularMovies";
import {
  getMovieGenres,
  getPopularMoviesByGenre,
  getMovieDetail,
} from "../../api/movieApi";

import { getLogo } from "../../api/logoImgApi";
import PopularMovies from "./components/PopularMovies";
import TopRated from "../home/components/TopRated";
import TopRatedMovies from "./components/TopRatedMovies";

export default function Movie() {
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [movieGenres, setMovieGenres] = useState([]);

  const [heroItem, setHeroItem] = useState(null);
  const [heroDetail, setHeroDetail] = useState(null);
  const [heroLogo, setHeroLogo] = useState(null);

  const [loading, setLoading] = useState(true);

  // 처음 페이지가 열렸을 때 장르 목록 가져오기
  useEffect(() => {
    const loadGenres = async () => {
      try {
        const genreData = await getMovieGenres();

        setMovieGenres(genreData);

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

  // 선택한 장르가 바뀔 때마다 Hero 변경
  useEffect(() => {
    if (!selectedGenre) return;

    const loadGenreHero = async () => {
      try {
        setLoading(true);

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
        setLoading(false);
      }
    };

    loadGenreHero();
  }, [selectedGenre]);

  return (
    <div>
      <PageTitle title="영화" />

      {loading ? (
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
      <PopularMovies />
      <TopRatedMovies />
    </div>
  );
}
