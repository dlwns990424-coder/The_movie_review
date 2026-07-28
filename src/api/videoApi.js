import axiosInstance from "./axiosInstance";

// 영화 또는 시리즈의 예고편/티저 영상 가져오기
export const getVideos = async (mediaType, id) => {
  const response = await axiosInstance.get(`/${mediaType}/${id}/videos`, {
    params: {
      include_video_language: "ko,en,null",
    },
  });

  return response.data;
};
