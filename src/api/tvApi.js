// 시리즈 페이지에서 사용할 주요 장르 ID
import axiosInstance from "./axiosInstance";

// TV 페이지에서 사용할 장르 목록
export const TV_GENRES = [
  {
    key: "kr-drama",
    id: 18,
    name: "한국 드라마",
    originCountry: "KR",
  },
  {
    key: "foreign-drama",
    id: 18,
    name: "해외 드라마",
    excludeOriginCountry: "KR",
  },
  {
    key: "action-adventure",
    id: 10759,
    name: "액션 & 모험",
  },
  {
    key: "animation",
    id: 16,
    name: "애니메이션",
  },
  {
    key: "comedy",
    id: 35,
    name: "코미디",
  },
  {
    key: "crime",
    id: 80,
    name: "범죄",
  },
  {
    key: "documentary",
    id: 99,
    name: "다큐멘터리",
  },
  {
    key: "family",
    id: 10751,
    name: "가족",
  },
  {
    key: "kids",
    id: 10762,
    name: "키즈",
  },
  {
    key: "mystery",
    id: 9648,
    name: "미스터리",
  },
  {
    key: "news",
    id: 10763,
    name: "뉴스",
  },
  {
    key: "reality",
    id: 10764,
    name: "예능",
  },
  {
    key: "sci-fi-fantasy",
    id: 10765,
    name: "SF & 판타지",
  },
  {
    key: "soap",
    id: 10766,
    name: "연속극",
  },
  {
    key: "talk",
    id: 10767,
    name: "토크쇼",
  },
  {
    key: "war-politics",
    id: 10768,
    name: "전쟁 & 정치",
  },
];
export const getTvGenreName = (genreId, fallbackName = "") => {
  const genre = TV_GENRES.find(
    (item) =>
      item.id === genreId &&
      item.key !== "kr-drama" &&
      item.key !== "foreign-drama",
  );

  if (genre) {
    return genre.name;
  }

  if (genreId === 18) {
    return "드라마";
  }

  return fallbackName;
};
// 시리즈 장르 목록
export const getTvGenres = async () => {
  return [...new Map(TV_GENRES.map((genre) => [genre.key, genre])).values()];
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

// 현재 방영 중인 시리즈
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
  const response = await axiosInstance.get(`/tv/${tvId}`, {
    params: {
      append_to_response:
        "credits,videos,recommendations,watch/providers,content_ratings",
    },
  });

  return response.data;
};

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

// 선택한 장르의 인기 시리즈
// 선택한 장르의 인기 시리즈
export const getPopularTvByGenre = async (selectedGenre, page = 1) => {
  const params = {
    with_genres: selectedGenre.id,
    sort_by: "popularity.desc",
    include_null_first_air_dates: false,
    page,
  };

  // 한국 드라마일 경우 한국 제작 시리즈만 요청
  if (selectedGenre.key === "kr-drama") {
    params.with_origin_country = "KR";
  }

  const response = await axiosInstance.get("/discover/tv", {
    params,
  });

  let results = response.data.results;

  // 한 번 더 한국 작품만 남기는 안전 필터
  if (selectedGenre.key === "kr-drama") {
    results = results.filter((item) => item.origin_country?.includes("KR"));
  }

  // 해외 드라마는 한국 원산지 작품 제외
  if (selectedGenre.key === "foreign-drama") {
    results = results.filter((item) => !item.origin_country?.includes("KR"));
  }

  return {
    ...response.data,
    results,
  };
};

// 선택한 장르의 평점 높은 시리즈
export const getTopRatedTvByGenre = async (selectedGenre, page = 1) => {
  const params = {
    with_genres: selectedGenre.id,
    sort_by: "vote_average.desc",
    "vote_count.gte": 200,
    include_null_first_air_dates: false,
    page,
  };

  if (selectedGenre.originCountry) {
    params.with_origin_country = selectedGenre.originCountry;
  }

  const response = await axiosInstance.get("/discover/tv", {
    params,
  });

  let results = response.data.results;

  if (selectedGenre.excludeOriginCountry) {
    results = results.filter(
      (item) =>
        !item.origin_country?.includes(selectedGenre.excludeOriginCountry),
    );
  }

  return {
    ...response.data,
    results,
  };
};

// 최신 공개 시리즈
export const getLatestReleasedTv = async (page = 1) => {
  const today = new Date().toISOString().slice(0, 10);

  const response = await axiosInstance.get("/discover/tv", {
    params: {
      sort_by: "first_air_date.desc",
      "first_air_date.lte": today,
      "vote_count.gte": 10,
      include_null_first_air_dates: false,
      page,
    },
  });

  return response.data;
};
