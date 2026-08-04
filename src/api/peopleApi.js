import axiosInstance from "./axiosInstance";

export const getPopularPeople = async () => {
  try {
    const response = await axiosInstance.get("person/popular");

    return response.data;
  } catch (error) {
    console.log(error);
    return {
      results: [],
    };
  }
};
export const getPeopleDetail = async (id) => {
  try {
    const response = await axiosInstance.get(`person/${id}`);

    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};
// 인물 출연 작품(영화 + 시리즈)
export const getPeopleCredits = async (id) => {
  try {
    const response = await axiosInstance.get(`person/${id}/combined_credits`);

    return response.data;
  } catch (error) {
    console.log(error);

    return {
      cast: [],
      crew: [],
    };
  }
};
