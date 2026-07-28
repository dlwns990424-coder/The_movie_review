import axiosInstance from "./axiosInstance";

export const getImages = async (mediaType, id) => {
  const response = await axiosInstance.get(`/${mediaType}/${id}/images`, {
    params: {
      include_image_language: "ko,en,null",
    },
  });

  return response.data;
};
