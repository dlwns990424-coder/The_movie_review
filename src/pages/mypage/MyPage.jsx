import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  CalendarDays,
  CircleUserRound,
  Film,
  Pencil,
  Star,
  Trash2,
  Tv,
  Heart,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "../../context/AuthContext";
import {
  deleteAllUserReviews,
  deleteReview,
  getAllReviews,
  updateReview,
} from "../../lib/reviewStorage";
import { W500_URL } from "../../constants/imageUrl";

import PageTitle from "../components/common/PageTitle";

export default function MyPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { currentUser, isLoggedIn, authLoading } = useAuth();

  const [myReviews, setMyReviews] = useState([]);

  const [visibleReviewCount, setVisibleReviewCount] = useState(5);

  const [wishlist, setWishlist] = useState([]);

  const [editingReviewId, setEditingReviewId] = useState(null);

  const [editingRating, setEditingRating] = useState(0);

  const [editingHoverRating, setEditingHoverRating] = useState(0);

  const [editingContent, setEditingContent] = useState("");

  const userId = currentUser?.id;

  const visibleReviews = myReviews.slice(0, visibleReviewCount);

  const hasMoreReviews = visibleReviewCount < myReviews.length;

  const wishlistKey = userId ? `wishlist-${userId}` : null;

  useEffect(() => {
    if (authLoading) return;

    if (!isLoggedIn) {
      navigate("/login", {
        replace: true,
        state: {
          from: `${location.pathname}${location.search}`,
        },
      });
    }
  }, [authLoading, isLoggedIn, navigate, location.pathname, location.search]);

  // 현재 사용자가 작성한 리뷰 불러오기
  useEffect(() => {
    if (!userId) {
      setMyReviews([]);
      return;
    }

    const loadMyReviews = () => {
      const allReviews = getAllReviews();

      const userReviews = allReviews
        .filter((review) => review.userId === userId)
        .sort(
          (a, b) =>
            new Date(b.updatedAt || b.createdAt).getTime() -
            new Date(a.updatedAt || a.createdAt).getTime(),
        );

      setMyReviews(userReviews);
    };

    loadMyReviews();

    window.addEventListener("reviewChanged", loadMyReviews);

    window.addEventListener("storage", loadMyReviews);

    return () => {
      window.removeEventListener("reviewChanged", loadMyReviews);

      window.removeEventListener("storage", loadMyReviews);
    };
  }, [userId]);

  useEffect(() => {
    if (!wishlistKey) {
      setWishlist([]);
      return;
    }

    const loadWishlist = () => {
      try {
        const savedWishlist = JSON.parse(
          localStorage.getItem(wishlistKey) || "[]",
        );

        const sortedWishlist = Array.isArray(savedWishlist)
          ? [...savedWishlist].sort(
              (a, b) =>
                new Date(b.addedAt || 0).getTime() -
                new Date(a.addedAt || 0).getTime(),
            )
          : [];

        setWishlist(sortedWishlist);
      } catch (error) {
        console.log("찜 목록 불러오기 실패:", error);
        setWishlist([]);
      }
    };

    loadWishlist();

    window.addEventListener("wishlistChanged", loadWishlist);
    window.addEventListener("storage", loadWishlist);

    return () => {
      window.removeEventListener("wishlistChanged", loadWishlist);

      window.removeEventListener("storage", loadWishlist);
    };
  }, [wishlistKey]);

  // 내가 작성한 리뷰의 평균 평점
  const averageRating = useMemo(() => {
    if (myReviews.length === 0) return null;

    const totalRating = myReviews.reduce(
      (sum, review) => sum + Number(review.rating || 0),
      0,
    );

    return (totalRating / myReviews.length).toFixed(1);
  }, [myReviews]);

  const previewWishlist = wishlist.slice(0, 6);
  const handleStartEdit = (review) => {
    setEditingReviewId(review.id);
    setEditingRating(Number(review.rating));
    setEditingHoverRating(0);
    setEditingContent(review.content);
  };

  const handleCancelEdit = () => {
    setEditingReviewId(null);
    setEditingRating(0);
    setEditingHoverRating(0);
    setEditingContent("");
  };

  const handleUpdateReview = (reviewId) => {
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

  const handleDeleteReview = (reviewId) => {
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
  const handleDeleteAllReviews = () => {
    if (!userId || myReviews.length === 0) return;

    const shouldDelete = window.confirm(
      `작성한 리뷰 ${myReviews.length}개를 모두 삭제하시겠습니까?\n삭제한 리뷰는 복구할 수 없습니다.`,
    );

    if (!shouldDelete) return;

    try {
      deleteAllUserReviews(userId);

      handleCancelEdit();

      setVisibleReviewCount(5);

      toast.success("작성한 리뷰가 모두 삭제되었습니다.");
    } catch (error) {
      toast.error(error.message);
    }
  };
  if (authLoading || !isLoggedIn || !currentUser) {
    return null;
  }

  return (
    <>
      <PageTitle title="마이페이지" />

      <main className="min-h-screen bg-black px-[20px] pt-[100px] pb-28 text-white md:px-[40px] md:pt-[130px] lg:px-[60px]">
        {/* 페이지 제목 */}
        <section>
          <p className="text-sm font-semibold text-[#33ddff]">MY PAGE</p>

          <h1 className="mt-2 text-3xl font-bold md:text-4xl">마이페이지</h1>

          <p className="mt-3 text-sm text-white/45 md:text-base">
            계정 정보와 내가 작성한 리뷰를 확인하세요.
          </p>
        </section>

        {/* 계정 정보 */}
        <section className="mt-10">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 md:p-7">
            <div className="flex flex-col gap-6 md:flex-row md:items-center">
              {/* 프로필 아이콘 */}
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#33ddff]/10 text-[#33ddff]">
                <CircleUserRound size={44} strokeWidth={1.5} />
              </div>

              {/* 사용자 정보 */}
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-2xl font-bold md:text-3xl">
                  {currentUser.nickname} 님
                </h2>

                <p className="mt-2 text-sm text-white/45">THE MOVIE 회원</p>
              </div>
            </div>

            <div className="mt-7 grid gap-4 border-t border-white/10 pt-7 sm:grid-cols-2 lg:grid-cols-4">
              <AccountInfo title="아이디" value={currentUser.username} />

              <AccountInfo title="닉네임" value={currentUser.nickname} />

              <AccountInfo
                title="가입일"
                value={
                  currentUser.createdAt
                    ? formatDate(currentUser.createdAt)
                    : "가입일 정보 없음"
                }
                icon={<CalendarDays size={16} strokeWidth={1.7} />}
              />

              <AccountInfo
                title="작성한 리뷰"
                value={`${myReviews.length}개`}
              />
            </div>
          </div>
        </section>

        {/* 활동 요약 */}
        <section className="mt-6 grid gap-4 sm:grid-cols-2">
          <ActivityCard
            title="작성한 리뷰"
            value={`${myReviews.length}개`}
            description="내가 작성한 영화·시리즈 리뷰"
          />

          <ActivityCard
            title="내 평균 평점"
            value={averageRating ? `${averageRating}점` : "아직 없음"}
            description="내가 작성한 리뷰의 평균 별점"
          />
        </section>

        {/* 최근 찜한 콘텐츠 */}
        <section className="mt-16">
          <div className="flex items-end justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <h2 className="text-2xl font-bold md:text-3xl">
                내가 찜한 리스트
              </h2>

              <p className="mt-2 text-sm text-white/45">
                최근 찜한 영화와 시리즈를 확인하세요.
              </p>
            </div>

            {wishlist.length > 0 && (
              <Link
                to="/wishlist"
                className="shrink-0 text-sm font-semibold text-[#33ddff] transition hover:opacity-75"
              >
                더보기
              </Link>
            )}
          </div>

          {previewWishlist.length > 0 ? (
            <div
              className="
        mt-7
        grid
        grid-cols-2
        gap-x-4
        gap-y-8
        sm:grid-cols-3
        md:grid-cols-4
        lg:grid-cols-5
        xl:grid-cols-6
      "
            >
              {previewWishlist.map((item) => (
                <WishlistPreviewCard
                  key={`${item.media_type}-${item.id}`}
                  item={item}
                />
              ))}
            </div>
          ) : (
            <div className="mt-7 flex min-h-[260px] items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] px-5 text-center">
              <div>
                <Heart
                  size={42}
                  strokeWidth={1.3}
                  className="mx-auto text-white/20"
                />

                <h3 className="mt-5 text-lg font-bold text-white/70">
                  아직 찜한 콘텐츠가 없습니다.
                </h3>

                <p className="mt-2 text-sm text-white/40">
                  마음에 드는 영화나 시리즈를 찜해보세요.
                </p>

                <Link
                  to="/movie"
                  className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-black transition hover:bg-[#33ddff]"
                >
                  콘텐츠 둘러보기
                </Link>
              </div>
            </div>
          )}
        </section>
        {/* 내가 작성한 리뷰 */}
        <section className="mt-16">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <h2 className="text-2xl font-bold md:text-3xl">
                내가 작성한 리뷰
              </h2>

              <p className="mt-2 text-sm text-white/45">
                리뷰를 수정하거나 삭제할 수 있습니다.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-white/40">
                총 {myReviews.length}개
              </span>

              {myReviews.length > 0 && (
                <button
                  type="button"
                  onClick={handleDeleteAllReviews}
                  className="
                  flex
                  h-9
                  cursor-pointer
                  items-center
                  gap-2
                  rounded-lg
                  border
                  border-red-500/20
                  bg-red-500/10
                  px-3
                  text-xs
                  font-semibold
                  text-red-300
                  transition
                  hover:border-red-500/40
                  hover:bg-red-500/20
                "
                >
                  <Trash2 size={14} />
                  전체 삭제
                </button>
              )}
            </div>
          </div>

          {myReviews.length > 0 ? (
            <>
              <div className="mt-6 space-y-3">
                {visibleReviews.map((review) => (
                  <MyReviewCard
                    key={review.id}
                    review={review}
                    isEditing={editingReviewId === review.id}
                    editingRating={editingRating}
                    editingHoverRating={editingHoverRating}
                    editingContent={editingContent}
                    onStartEdit={handleStartEdit}
                    onCancelEdit={handleCancelEdit}
                    onUpdate={handleUpdateReview}
                    onDelete={handleDeleteReview}
                    onRatingChange={setEditingRating}
                    onRatingHover={setEditingHoverRating}
                    onContentChange={setEditingContent}
                  />
                ))}
              </div>

              {hasMoreReviews && (
                <button
                  type="button"
                  onClick={() =>
                    setVisibleReviewCount((prev) =>
                      Math.min(prev + 5, myReviews.length),
                    )
                  }
                  className="
          mt-7
          flex
          h-11
          w-full
          cursor-pointer
          items-center
          justify-center
          rounded-lg
          border
          border-white/15
          bg-white/5
          text-sm
          font-semibold
          text-white/70
          transition
          hover:border-[#33ddff]
          hover:text-[#33ddff]
        "
                >
                  리뷰 더보기
                </button>
              )}
            </>
          ) : (
            <EmptyReviews />
          )}
        </section>
      </main>
    </>
  );
}
function WishlistPreviewCard({ item }) {
  const isMovie = item.media_type === "movie";

  const title = isMovie ? item.title : item.name;

  const detailPath = isMovie ? `/movie/${item.id}` : `/tv/${item.id}`;

  const date = isMovie ? item.release_date : item.first_air_date;

  const year = date?.slice(0, 4);

  return (
    <Link to={detailPath} className="group min-w-0">
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-white/10">
        {item.poster_path ? (
          <img
            src={`${W500_URL}${item.poster_path}`}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 px-4 text-center text-white/25">
            {isMovie ? (
              <Film size={28} strokeWidth={1.4} />
            ) : (
              <Tv size={28} strokeWidth={1.4} />
            )}

            <span className="text-xs">등록된 이미지가 없습니다.</span>
          </div>
        )}

        <span className="absolute bottom-3 left-3 rounded-md bg-black/70 px-2.5 py-1 text-[11px] text-white/75 backdrop-blur-md">
          {isMovie ? "영화" : "시리즈"}
        </span>
      </div>

      <h3 className="mt-3 line-clamp-2 text-[16px] leading-5 font-semibold text-white transition-colors group-hover:text-[#33ddff] md:text-base">
        {title}
      </h3>

      <div className="mt-2 flex items-center gap-2 text-xs text-white/45">
        {item.vote_average > 0 && (
          <span className="flex items-center gap-1 text-[#33ddff]">
            <Star size={12} fill="currentColor" />
            {Number(item.vote_average).toFixed(1)}
          </span>
        )}

        {year && (
          <>
            {item.vote_average > 0 && <span className="text-white/20">·</span>}

            <span>{year}</span>
          </>
        )}
      </div>
    </Link>
  );
}
function AccountInfo({ title, value, icon = null }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/25 p-4">
      <p className="text-xs text-white/40">{title}</p>

      <div className="mt-2 flex items-center gap-2">
        {icon && <span className="text-[#33ddff]">{icon}</span>}

        <p className="truncate text-sm font-semibold text-white/80 md:text-base">
          {value}
        </p>
      </div>
    </div>
  );
}

function ActivityCard({ title, value, description }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 md:p-6">
      <p className="text-sm text-white/45">{title}</p>

      <p className="mt-2 text-3xl font-bold text-[#33ddff]">{value}</p>

      <p className="mt-3 text-sm text-white/35">{description}</p>
    </div>
  );
}

function MyReviewCard({
  review,
  isEditing,
  editingRating,
  editingHoverRating,
  editingContent,
  onStartEdit,
  onCancelEdit,
  onUpdate,
  onDelete,
  onRatingChange,
  onRatingHover,
  onContentChange,
}) {
  const isMovie = review.mediaType === "movie";

  const detailPath = isMovie
    ? `/movie/${review.contentId}`
    : `/tv/${review.contentId}`;

  return (
    <article className="rounded-xl border border-white/10 bg-white/[0.04] p-3 md:p-4">
      <div className="flex gap-3 md:gap-4">
        {/* 포스터 */}
        <Link
          to={detailPath}
          className="group h-[120px] w-[80px] shrink-0 overflow-hidden rounded-lg bg-white/10 md:h-[140px] md:w-[94px]"
        >
          {review.posterPath ? (
            <img
              src={`${W500_URL}${review.posterPath}`}
              alt={review.contentTitle}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 px-2 text-center text-white/25">
              {isMovie ? (
                <Film size={24} strokeWidth={1.4} />
              ) : (
                <Tv size={24} strokeWidth={1.4} />
              )}

              <span className="text-[10px]">이미지 없음</span>
            </div>
          )}
        </Link>

        {/* 리뷰 정보 */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded bg-white/10 px-2 py-1 text-[10px] text-white/55">
                  {isMovie ? "영화" : "시리즈"}
                </span>

                <span className="text-xs text-white/30">
                  {formatDate(review.updatedAt || review.createdAt)}
                </span>

                {review.updatedAt && (
                  <span className="text-xs text-white/30">수정됨</span>
                )}
              </div>

              <Link
                to={detailPath}
                className="mt-2 block line-clamp-1 text-base font-bold text-white transition-colors hover:text-[#33ddff] md:text-lg"
              >
                {review.contentTitle}
              </Link>
            </div>

            {!isEditing && (
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={() => onStartEdit(review)}
                  aria-label="리뷰 수정"
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-white/35 transition hover:bg-white/10 hover:text-[#33ddff]"
                >
                  <Pencil size={16} />
                </button>

                <button
                  type="button"
                  onClick={() => onDelete(review.id)}
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
                onHover={onRatingHover}
                onChange={onRatingChange}
              />

              <textarea
                value={editingContent}
                onChange={(event) => onContentChange(event.target.value)}
                maxLength={500}
                className="
                  mt-4
                  min-h-[135px]
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
                "
              />

              <p className="mt-2 text-right text-xs text-white/35">
                {editingContent.length}/500
              </p>

              <div className="mt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onCancelEdit}
                  className="flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-white/15 px-4 text-sm text-white/60 transition hover:text-white"
                >
                  <X size={15} />
                  취소
                </button>

                <button
                  type="button"
                  onClick={() => onUpdate(review.id)}
                  className="h-10 cursor-pointer rounded-lg bg-[#33ddff] px-5 text-sm font-semibold text-black transition hover:opacity-90"
                >
                  수정 완료
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="mt-3 flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    fill={star <= review.rating ? "currentColor" : "none"}
                    className={
                      star <= review.rating ? "text-[#33ddff]" : "text-white/20"
                    }
                  />
                ))}

                <span className="ml-2 text-sm font-semibold text-white/65">
                  {review.rating}점
                </span>
              </div>

              <p className="mt-3 line-clamp-3 whitespace-pre-line text-sm leading-6 text-white/65">
                {review.content}
              </p>
            </>
          )}
        </div>
      </div>
    </article>
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
            size={28}
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

function EmptyReviews() {
  return (
    <div className="mt-7 flex min-h-[330px] items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] px-5 text-center">
      <div>
        <Star size={48} strokeWidth={1.3} className="mx-auto text-white/20" />

        <h3 className="mt-5 text-xl font-bold text-white/70">
          아직 작성한 리뷰가 없습니다.
        </h3>

        <p className="mt-3 text-sm leading-6 text-white/40">
          영화나 시리즈 상세페이지에서
          <br />첫 번째 리뷰를 작성해보세요.
        </p>

        <div className="mt-7 flex justify-center gap-3">
          <Link
            to="/movie"
            className="flex h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-black transition hover:bg-[#33ddff]"
          >
            영화 둘러보기
          </Link>

          <Link
            to="/tv"
            className="flex h-11 items-center justify-center rounded-full border border-white/20 bg-white/5 px-5 text-sm font-semibold text-white transition hover:border-[#33ddff] hover:text-[#33ddff]"
          >
            시리즈 둘러보기
          </Link>
        </div>
      </div>
    </div>
  );
}

function formatDate(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}
