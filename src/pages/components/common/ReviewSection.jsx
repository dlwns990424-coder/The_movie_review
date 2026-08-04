import { useEffect, useMemo, useState } from "react";
import { Pencil, Star, Trash2, X } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "../../../context/AuthContext";

import {
  addReview,
  deleteReview,
  getContentReviews,
  getUserContentReview,
  updateReview,
} from "../../../lib/reviewStorage";

export default function ReviewSection({
  mediaType,
  contentId,
  contentTitle,
  posterPath,
}) {
  const { currentUser, isLoggedIn } = useAuth();

  const [reviews, setReviews] = useState([]);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewContent, setReviewContent] = useState("");

  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editingRating, setEditingRating] = useState(0);
  const [editingHoverRating, setEditingHoverRating] = useState(0);
  const [editingContent, setEditingContent] = useState("");

  const userId = currentUser?.id;

  const loadReviews = () => {
    const contentReviews = getContentReviews(mediaType, contentId);

    setReviews(contentReviews);
  };

  useEffect(() => {
    loadReviews();

    window.addEventListener("reviewChanged", loadReviews);

    return () => {
      window.removeEventListener("reviewChanged", loadReviews);
    };
  }, [mediaType, contentId]);

  const myReview = useMemo(() => {
    if (!userId) return null;

    return getUserContentReview(userId, mediaType, contentId);
  }, [reviews, userId, mediaType, contentId]);

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return null;

    const totalRating = reviews.reduce(
      (sum, review) => sum + Number(review.rating || 0),
      0,
    );

    return (totalRating / reviews.length).toFixed(1);
  }, [reviews]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!isLoggedIn || !currentUser) {
      toast.warning("로그인이 필요한 기능입니다.");
      return;
    }

    if (rating === 0) {
      toast.error("별점을 선택해주세요.");
      return;
    }

    if (!reviewContent.trim()) {
      toast.error("리뷰 내용을 입력해주세요.");
      return;
    }

    try {
      addReview({
        userId: currentUser.id,
        nickname: currentUser.nickname || currentUser.username || "사용자",
        mediaType,
        contentId,
        contentTitle,
        posterPath,
        rating,
        content: reviewContent,
      });

      setRating(0);
      setHoverRating(0);
      setReviewContent("");

      toast.success("리뷰가 등록되었습니다.");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleStartEdit = (review) => {
    setEditingReviewId(review.id);
    setEditingRating(review.rating);
    setEditingHoverRating(0);
    setEditingContent(review.content);
  };

  const handleCancelEdit = () => {
    setEditingReviewId(null);
    setEditingRating(0);
    setEditingHoverRating(0);
    setEditingContent("");
  };

  const handleUpdate = (reviewId) => {
    if (!userId) return;

    if (editingRating === 0) {
      toast.error("별점을 선택해주세요.");
      return;
    }

    if (!editingContent.trim()) {
      toast.error("리뷰 내용을 입력해주세요.");
      return;
    }

    try {
      updateReview({
        reviewId,
        userId,
        rating: editingRating,
        content: editingContent,
      });

      handleCancelEdit();

      toast.success("리뷰가 수정되었습니다.");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = (reviewId) => {
    if (!userId) return;

    const shouldDelete = window.confirm("작성한 리뷰를 삭제하시겠습니까?");

    if (!shouldDelete) return;

    try {
      deleteReview(reviewId, userId);

      if (editingReviewId === reviewId) {
        handleCancelEdit();
      }

      toast("리뷰가 삭제되었습니다.");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <section className="w-full px-[20px] pt-20 md:px-[40px] lg:px-[60px]">
      {/* 리뷰 제목 및 평균 평점 */}
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <h2 className="text-2xl font-bold md:text-3xl">리뷰</h2>

          <p className="mt-2 text-sm text-white/45">
            콘텐츠에 대한 감상을 남겨보세요.
          </p>
        </div>

        {averageRating && (
          <div className="text-right">
            <p className="text-sm text-white/40">사용자 리뷰 평점</p>

            <div className="mt-1 flex items-center justify-end gap-2">
              <Star size={21} fill="currentColor" className="text-[#33ddff]" />

              <strong className="text-2xl text-white">{averageRating}</strong>

              <span className="text-sm text-white/40">
                ({reviews.length}명)
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 리뷰 작성 영역 */}
      {!isLoggedIn ? (
        <div className="mt-7 rounded-xl border border-white/10 bg-white/5 px-6 py-10 text-center">
          <p className="text-white/60">로그인 후 리뷰를 작성할 수 있습니다.</p>
        </div>
      ) : myReview ? (
        <div className="mt-7 rounded-xl border border-white/10 bg-white/5 px-6 py-6">
          <p className="text-sm text-white/55">
            이미 이 콘텐츠에 리뷰를 작성했습니다.
          </p>

          <p className="mt-2 text-xs text-white/35">
            아래의 내 리뷰에서 수정하거나 삭제할 수 있습니다.
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="mt-7 rounded-2xl border border-white/10 bg-white/[0.04] p-5 md:p-6"
        >
          <div>
            <p className="mb-3 text-sm font-semibold text-white/75">별점</p>

            <RatingStars
              rating={rating}
              hoverRating={hoverRating}
              onHover={setHoverRating}
              onChange={setRating}
            />
          </div>

          <div className="mt-6">
            <label
              htmlFor={`review-${mediaType}-${contentId}`}
              className="mb-3 block text-sm font-semibold text-white/75"
            >
              리뷰 내용
            </label>

            <textarea
              id={`review-${mediaType}-${contentId}`}
              value={reviewContent}
              onChange={(event) => setReviewContent(event.target.value)}
              placeholder="콘텐츠에 대한 감상을 작성해주세요."
              maxLength={500}
              className="
                min-h-[150px]
                w-full
                resize-none
                rounded-xl
                border
                border-white/15
                bg-black/40
                p-4
                text-sm
                leading-6
                text-white
                outline-none
                transition
                placeholder:text-white/25
                focus:border-[#33ddff]
                md:text-base
              "
            />

            <p className="mt-2 text-right text-xs text-white/35">
              {reviewContent.length}/500
            </p>
          </div>

          <button
            type="submit"
            disabled={rating === 0 || !reviewContent.trim()}
            className={`
              mt-5
              h-12
              w-full
              rounded-lg
              font-semibold
              transition
              ${
                rating > 0 && reviewContent.trim()
                  ? "cursor-pointer bg-[#33ddff] text-black hover:opacity-90 active:scale-[0.99]"
                  : "cursor-not-allowed bg-white/10 text-white/30"
              }
            `}
          >
            리뷰 등록
          </button>
        </form>
      )}

      {/* 리뷰 목록 */}
      <div className="mt-8 space-y-4">
        {reviews.length > 0 ? (
          reviews.map((review) => {
            const isMyReview = userId && review.userId === userId;

            const isEditing = editingReviewId === review.id;

            return (
              <article
                key={review.id}
                className={`
                  rounded-2xl
                  border
                  p-5
                  md:p-6
                  ${
                    isMyReview
                      ? "border-[#33ddff]/25 bg-[#33ddff]/[0.04]"
                      : "border-white/10 bg-white/[0.04]"
                  }
                `}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-white">
                        {review.nickname}
                      </p>

                      {isMyReview && (
                        <span className="rounded-full bg-[#33ddff]/15 px-2 py-1 text-[10px] font-semibold text-[#33ddff]">
                          내 리뷰
                        </span>
                      )}
                    </div>

                    {!isEditing && (
                      <div className="mt-2 flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={15}
                            fill={
                              star <= review.rating ? "currentColor" : "none"
                            }
                            className={
                              star <= review.rating
                                ? "text-[#33ddff]"
                                : "text-white/20"
                            }
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {isMyReview && !isEditing && (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(review)}
                        aria-label="리뷰 수정"
                        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-white/35 transition hover:bg-white/10 hover:text-[#33ddff]"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(review.id)}
                        aria-label="리뷰 삭제"
                        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-white/35 transition hover:bg-red-500/15 hover:text-red-300"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  )}
                </div>

                {isEditing ? (
                  <div className="mt-5">
                    <RatingStars
                      rating={editingRating}
                      hoverRating={editingHoverRating}
                      onHover={setEditingHoverRating}
                      onChange={setEditingRating}
                    />

                    <textarea
                      value={editingContent}
                      onChange={(event) =>
                        setEditingContent(event.target.value)
                      }
                      maxLength={500}
                      className="
                        mt-5
                        min-h-[140px]
                        w-full
                        resize-none
                        rounded-xl
                        border
                        border-white/15
                        bg-black/40
                        p-4
                        text-sm
                        leading-6
                        text-white
                        outline-none
                        transition
                        focus:border-[#33ddff]
                        md:text-base
                      "
                    />

                    <p className="mt-2 text-right text-xs text-white/35">
                      {editingContent.length}/500
                    </p>

                    <div className="mt-4 flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-white/15 px-4 text-sm text-white/60 transition hover:text-white"
                      >
                        <X size={15} />
                        취소
                      </button>

                      <button
                        type="button"
                        onClick={() => handleUpdate(review.id)}
                        className="h-10 cursor-pointer rounded-lg bg-[#33ddff] px-5 text-sm font-semibold text-black transition hover:opacity-90"
                      >
                        수정 완료
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="mt-5 whitespace-pre-line text-sm leading-7 text-white/70 md:text-base">
                      {review.content}
                    </p>

                    <p className="mt-5 text-xs text-white/30">
                      {formatReviewDate(review.updatedAt || review.createdAt)}

                      {review.updatedAt && " · 수정됨"}
                    </p>
                  </>
                )}
              </article>
            );
          })
        ) : (
          <div className="rounded-xl border border-white/10 bg-white/[0.03] px-6 py-10 text-center text-white/40">
            아직 작성된 리뷰가 없습니다.
          </div>
        )}
      </div>
    </section>
  );
}

function RatingStars({ rating, hoverRating, onHover, onChange }) {
  const activeRating = hoverRating || rating;

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onMouseEnter={() => onHover(star)}
          onMouseLeave={() => onHover(0)}
          onClick={() => onChange(star)}
          aria-label={`${star}점`}
          className="cursor-pointer p-1"
        >
          <Star
            size={30}
            strokeWidth={1.6}
            fill={star <= activeRating ? "currentColor" : "none"}
            className={
              star <= activeRating ? "text-[#33ddff]" : "text-white/25"
            }
          />
        </button>
      ))}
    </div>
  );
}

function formatReviewDate(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}
