import axiosInstance from "./axiosInstance";

export const getContentDetail = async (mediaType, id) => {
  const appendToResponse =
    mediaType === "movie" ? "release_dates" : "content_ratings";

  const response = await axiosInstance.get(`/${mediaType}/${id}`, {
    params: {
      append_to_response: appendToResponse,
    },
  });

  return response.data;
};
