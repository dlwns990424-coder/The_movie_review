import axiosInstance from "./axiosInstance";

// 영화 페이지에서 사용할 주요 장르 ID
const MOVIE_GENRE_IDS = [
  878, // SF
  10770, // TV 영화
  10751, // 가족
  27, // 공포
  99, // 다큐멘터리
  10749, // 로맨스
  12, // 모험
  9648, // 미스터리
  80, // 범죄
  53, // 스릴러
  16, // 애니메이션
  28, // 액션
  36, // 역사
  10402, // 음악
  10752, // 전쟁
  35, // 코미디
  14, // 판타지
];

// 영화 장르 목록
export const getMovieGenres = async () => {
  const response = await axiosInstance.get("/genre/movie/list");

  const filteredGenres = response.data.genres.filter((genre) =>
    MOVIE_GENRE_IDS.includes(genre.id),
  );

  return filteredGenres;
};

// 인기 영화
export const getPopularMovies = async (page = 1) => {
  const response = await axiosInstance.get("/movie/popular", {
    params: {
      page,
    },
  });
  return response.data;
};

//평점 높은 영화
export const getTopRatedMovies = async (page = 1) => {
  const response = await axiosInstance.get("/movie/top_rated", {
    params: {
      page,
    },
  });

  return response.data;
};

//개봉 예정 영화
export const getUpcomingMovies = async (page = 1) => {
  const response = await axiosInstance.get("/movie/upcoming", {
    params: {
      page,
      region: "KR",
    },
  });

  return response.data;
};
// 영화 상세 정보
export const getMovieDetail = async (movieId) => {
  const response = await axiosInstance.get(`/movie/${movieId}`, {
    params: {
      append_to_response:
        "credits,videos,recommendations,watch/providers,release_dates",
    },
  });

  return response.data;
};
// 현재 상영 영화
export const getNowPlayingMovies = async (page = 1) => {
  const response = await axiosInstance.get("/movie/now_playing", {
    params: {
      page,
      region: "KR",
    },
  });

  return response.data;
};
// 선택한 장르의 인기 영화
export const getPopularMoviesByGenre = async (genreId, page = 1) => {
  const response = await axiosInstance.get("/discover/movie", {
    params: {
      with_genres: genreId,
      sort_by: "popularity.desc",
      page,
    },
  });

  return response.data;
};
