import axiosInstance from "./axiosInstance";

// 영화 + 시리즈 + 인물 통합 검색
export const getMultiSearch = async (keyword, page = 1) => {
  const trimmedKeyword = keyword.trim();

  if (!trimmedKeyword) {
    return {
      page: 1,
      results: [],
      total_pages: 0,
      total_results: 0,
    };
  }

  try {
    const response = await axiosInstance.get("/search/multi", {
      params: {
        query: trimmedKeyword,
        page,
        include_adult: false,
      },
    });

    return response.data;
  } catch (error) {
    console.log("통합 검색 요청 실패:", error);

    return {
      page: 1,
      results: [],
      total_pages: 0,
      total_results: 0,
    };
  }
};
