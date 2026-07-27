import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://api.themoviedb.org/3",

  headers: {
    accept: "application/json",
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
  },

  params: {
    language: "ko-KR",
  },

  timeout: 10000,
});

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  // 요청 성공
  (response) => response,

  // 요청 실패
  (error) => {
    let message = "데이터를 불러오지 못했습니다.";

    if (error.code === "ECONNABORTED") {
      message = "요청 시간이 초과되었습니다.";
    } else if (!error.response) {
      message = "인터넷 연결 상태를 확인해주세요.";
    }

    const customError = new Error(message);

    customError.status = error.response?.status;
    customError.code = error.code;
    customError.originalError = error;

    console.error("TMDB API 요청 오류", {
      status: error.response?.status,
      code: error.code,
      url: error.config?.url,
      message: error.message,
      data: error.response?.data,
    });

    return Promise.reject(customError);
  },
);

export default axiosInstance;
