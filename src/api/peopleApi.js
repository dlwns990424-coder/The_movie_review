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
