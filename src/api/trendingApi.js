import axiosInstance from "./axiosInstance";

// 오늘의 영화 + 시리즈 트렌딩
export const getTrendingAll = async (timeWindow = "day") => {
  const response = await axiosInstance.get(`/trending/all/${timeWindow}`);

  return response.data;
};
