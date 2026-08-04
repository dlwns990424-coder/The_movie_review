const REVIEW_STORAGE_KEY = "content-reviews";

// 전체 리뷰 불러오기
export const getAllReviews = () => {
  try {
    const savedReviews = JSON.parse(
      localStorage.getItem(REVIEW_STORAGE_KEY) || "[]",
    );

    return Array.isArray(savedReviews) ? savedReviews : [];
  } catch (error) {
    console.log("리뷰 불러오기 실패:", error);
    return [];
  }
};

// 특정 영화 또는 시리즈의 모든 리뷰
export const getContentReviews = (mediaType, contentId) => {
  const reviews = getAllReviews();

  return reviews
    .filter(
      (review) =>
        review.mediaType === mediaType &&
        review.contentId === Number(contentId),
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
};

// 현재 사용자가 해당 콘텐츠에 작성한 리뷰
export const getUserContentReview = (userId, mediaType, contentId) => {
  if (!userId) return null;

  const reviews = getAllReviews();

  return (
    reviews.find(
      (review) =>
        review.userId === userId &&
        review.mediaType === mediaType &&
        review.contentId === Number(contentId),
    ) || null
  );
};

// 리뷰 작성
export const addReview = ({
  userId,
  nickname,
  mediaType,
  contentId,
  contentTitle,
  posterPath,
  rating,
  content,
}) => {
  if (!userId) {
    throw new Error("로그인이 필요합니다.");
  }

  const reviews = getAllReviews();

  const alreadyWritten = reviews.some(
    (review) =>
      review.userId === userId &&
      review.mediaType === mediaType &&
      review.contentId === Number(contentId),
  );

  if (alreadyWritten) {
    throw new Error("이미 이 콘텐츠에 리뷰를 작성했습니다.");
  }

  const newReview = {
    id: crypto.randomUUID(),
    userId,
    nickname,
    mediaType,
    contentId: Number(contentId),
    contentTitle,
    posterPath,
    rating: Number(rating),
    content: content.trim(),
    createdAt: new Date().toISOString(),
    updatedAt: null,
  };

  const nextReviews = [newReview, ...reviews];

  localStorage.setItem(REVIEW_STORAGE_KEY, JSON.stringify(nextReviews));

  window.dispatchEvent(new CustomEvent("reviewChanged"));

  return newReview;
};

// 리뷰 수정
export const updateReview = ({ reviewId, userId, rating, content }) => {
  const reviews = getAllReviews();

  const targetReview = reviews.find((review) => review.id === reviewId);

  if (!targetReview) {
    throw new Error("리뷰를 찾을 수 없습니다.");
  }

  if (targetReview.userId !== userId) {
    throw new Error("본인이 작성한 리뷰만 수정할 수 있습니다.");
  }

  const nextReviews = reviews.map((review) =>
    review.id === reviewId
      ? {
          ...review,
          rating: Number(rating),
          content: content.trim(),
          updatedAt: new Date().toISOString(),
        }
      : review,
  );

  localStorage.setItem(REVIEW_STORAGE_KEY, JSON.stringify(nextReviews));

  window.dispatchEvent(new CustomEvent("reviewChanged"));
};

// 리뷰 삭제
export const deleteReview = (reviewId, userId) => {
  const reviews = getAllReviews();

  const targetReview = reviews.find((review) => review.id === reviewId);

  if (!targetReview) {
    throw new Error("리뷰를 찾을 수 없습니다.");
  }

  if (targetReview.userId !== userId) {
    throw new Error("본인이 작성한 리뷰만 삭제할 수 있습니다.");
  }

  const nextReviews = reviews.filter((review) => review.id !== reviewId);

  localStorage.setItem(REVIEW_STORAGE_KEY, JSON.stringify(nextReviews));

  window.dispatchEvent(new CustomEvent("reviewChanged"));
};
// 현재 사용자가 작성한 리뷰 전체 삭제
export const deleteAllUserReviews = (userId) => {
  if (!userId) {
    throw new Error("로그인이 필요합니다.");
  }

  const reviews = getAllReviews();

  const nextReviews = reviews.filter((review) => review.userId !== userId);

  localStorage.setItem(REVIEW_STORAGE_KEY, JSON.stringify(nextReviews));

  window.dispatchEvent(new CustomEvent("reviewChanged"));
};
