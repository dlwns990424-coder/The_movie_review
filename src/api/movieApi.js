import axiosInstance from "./axiosInstance";

// 영화 페이지에서 사용할 주요 장르 ID
const MOVIE_GENRE_IDS = [
  28, // 액션
  12, // 모험
  16, // 애니메이션
  35, // 코미디
  80, // 범죄
  18, // 드라마
  14, // 판타지
  27, // 공포
  9648, // 미스터리
  10749, // 로맨스
  878, // SF
  53, // 스릴러
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
