import axiosInstance from "./axiosInstance";

// 시리즈 페이지에서 사용할 주요 장르 ID
const TV_GENRE_IDS = [
  10759, // 액션 & 어드벤처
  16, // 애니메이션
  35, // 코미디
  80, // 범죄
  18, // 드라마
  10751, // 가족
  9648, // 미스터리
  10764, // 리얼리티
  10765, // SF & 판타지
  10768, // 전쟁 & 정치
];

// 시리즈 장르 목록
export const getTvGenres = async () => {
  const response = await axiosInstance.get("/genre/tv/list");

  const filteredGenres = response.data.genres.filter((genre) =>
    TV_GENRE_IDS.includes(genre.id),
  );

  return filteredGenres;
};

// 인기 시리즈
export const getPopularTv = async (page = 1) => {
  const response = await axiosInstance.get("/tv/popular", {
    params: {
      page,
    },
  });
  return response.data;
};

// 평점 높은 시리즈
export const getTopRatedTv = async (page = 1) => {
  const response = await axiosInstance.get("/tv/top_rated", {
    params: {
      page,
    },
  });
  return response.data;
};

//현재 방영중인 시리즈
export const getOnTheAirTv = async (page = 1) => {
  const response = await axiosInstance.get("/tv/on_the_air", {
    params: {
      page,
    },
  });
  return response.data;
};

// 시리즈 상세 정보
export const getTvDetail = async (tvId) => {
  const response = await axiosInstance.get(`/tv/${tvId}`);

  return response.data;
};

// 공개 예정 시리즈
// 공개 예정 시리즈
export const getUpcomingTv = async (page = 1) => {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  const todayString = `${year}-${month}-${day}`;

  const response = await axiosInstance.get("/discover/tv", {
    params: {
      page,
      sort_by: "first_air_date.asc",
      "first_air_date.gte": todayString,
      include_null_first_air_dates: false,
      with_original_language: "ko|en|ja",
    },
  });

  return response.data;
};
