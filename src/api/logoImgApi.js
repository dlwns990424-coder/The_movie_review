import axiosInstance from "./axiosInstance";

export const getImages = async (mediaType, id) => {
  const response = await axiosInstance.get(`/${mediaType}/${id}/images`, {
    params: {
      include_image_language: "ko,en,null",
    },
  });

  return response.data;
};

export const getLogo = async (mediaType, id) => {
  const imageData = await getImages(mediaType, id);

  return (
    imageData.logos.find((logo) => logo.iso_639_1 === "ko") ||
    imageData.logos.find((logo) => logo.iso_639_1 === "en") ||
    imageData.logos[0] ||
    null
  );
};
