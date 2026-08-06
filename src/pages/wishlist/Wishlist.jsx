import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Film, Heart, Star, Trash2, Tv } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "../../context/AuthContext";
import { W500_URL } from "../../constants/imageUrl";

import PageTitle from "../components/common/PageTitle";

const WISHLIST_FILTERS = [
  {
    key: "all",
    name: "전체",
  },
  {
    key: "movie",
    name: "영화",
  },
  {
    key: "tv",
    name: "시리즈",
  },
];

const SORT_OPTIONS = [
  {
    value: "latest",
    name: "최근 찜한 순",
  },
  {
    value: "oldest",
    name: "오래된 순",
  },
  {
    value: "rating",
    name: "평점 높은 순",
  },
];

export default function Wishlist() {
  const navigate = useNavigate();

  const { currentUser, isLoggedIn } = useAuth();

  const [wishlist, setWishlist] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [sortType, setSortType] = useState("latest");

  // 상세페이지에서 사용한 사용자별 찜 저장 키와 동일하게 사용
  const wishlistKey =
    isLoggedIn && (currentUser?.id || currentUser?.username)
      ? `wishlist-${currentUser.id || currentUser.username}`
      : null;

  // 현재 로그인 사용자의 찜 목록 불러오기
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

        setWishlist(Array.isArray(savedWishlist) ? savedWishlist : []);
      } catch (error) {
        console.log("찜 목록 불러오기 실패:", error);
        setWishlist([]);
      }
    };

    loadWishlist();

    // 다른 컴포넌트에서 찜 상태가 변경되었을 때 다시 불러오기
    window.addEventListener("wishlistChanged", loadWishlist);

    // 다른 탭에서 localStorage가 변경되었을 때 반영
    window.addEventListener("storage", loadWishlist);

    return () => {
      window.removeEventListener("wishlistChanged", loadWishlist);

      window.removeEventListener("storage", loadWishlist);
    };
  }, [wishlistKey]);

  // 필터별 찜 개수
  const wishlistCounts = useMemo(() => {
    return {
      all: wishlist.length,

      movie: wishlist.filter((item) => item.media_type === "movie").length,

      tv: wishlist.filter((item) => item.media_type === "tv").length,
    };
  }, [wishlist]);

  // 필터 및 정렬 적용
  const visibleWishlist = useMemo(() => {
    const filteredWishlist =
      selectedFilter === "all"
        ? [...wishlist]
        : wishlist.filter((item) => item.media_type === selectedFilter);

    return filteredWishlist.sort((a, b) => {
      if (sortType === "oldest") {
        return getAddedTime(a) - getAddedTime(b);
      }

      if (sortType === "rating") {
        return (b.vote_average || 0) - (a.vote_average || 0);
      }

      return getAddedTime(b) - getAddedTime(a);
    });
  }, [wishlist, selectedFilter, sortType]);

  // localStorage와 state를 동시에 갱신
  const updateWishlist = (nextWishlist) => {
    if (!wishlistKey) return;

    try {
      localStorage.setItem(wishlistKey, JSON.stringify(nextWishlist));

      setWishlist(nextWishlist);

      // 상세페이지와 카드의 찜 상태 갱신용
      window.dispatchEvent(new CustomEvent("wishlistChanged"));
    } catch (error) {
      console.log("찜 목록 저장 실패:", error);
      toast.error("찜 목록을 변경하지 못했습니다.");
    }
  };

  // 찜 개별 삭제
  const handleDeleteItem = (event, targetItem) => {
    event.preventDefault();
    event.stopPropagation();

    const nextWishlist = wishlist.filter(
      (item) =>
        !(
          item.id === targetItem.id && item.media_type === targetItem.media_type
        ),
    );

    updateWishlist(nextWishlist);
    toast("찜 목록에서 제거되었습니다.");
  };

  // 현재 필터의 찜 목록 전체 삭제
  const handleClearWishlist = () => {
    if (visibleWishlist.length === 0) return;

    const targetText =
      selectedFilter === "movie"
        ? "영화"
        : selectedFilter === "tv"
          ? "시리즈"
          : "전체";

    const shouldDelete = window.confirm(
      `${targetText} 찜 목록을 모두 삭제하시겠습니까?`,
    );

    if (!shouldDelete) return;

    let nextWishlist = [];

    if (selectedFilter !== "all") {
      nextWishlist = wishlist.filter(
        (item) => item.media_type !== selectedFilter,
      );
    }

    updateWishlist(nextWishlist);
    toast("선택한 찜 목록을 모두 삭제했습니다.");
  };

  // 비로그인 화면
  if (!isLoggedIn) {
    return (
      <>
        <PageTitle title="내가 찜한 리스트" />

        <main className="flex min-h-screen items-center justify-center bg-black px-[20px] text-center text-white md:px-[40px] lg:px-[60px]">
          <div>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/5">
              <Heart size={36} strokeWidth={1.4} className="text-white/25" />
            </div>

            <h1 className="mt-6 text-2xl font-bold md:text-3xl">
              로그인이 필요한 페이지입니다
            </h1>

            <p className="mt-3 text-sm leading-6 text-white/45 md:text-base">
              로그인한 뒤 마음에 드는 영화와 시리즈를
              <br className="sm:hidden" />찜 목록에 저장해보세요.
            </p>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="mt-8 h-12 cursor-pointer rounded-full bg-[#33ddff] px-8 font-semibold text-black transition hover:opacity-90 active:scale-[0.98]"
            >
              로그인하기
            </button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <PageTitle title="내가 찜한 리스트" />

      <main className="min-h-screen bg-black px-[20px] pt-[100px] pb-28 text-white md:px-[40px] md:pt-[130px] lg:px-[60px]">
        {/* 페이지 제목 */}
        <section>
          <p className="text-sm font-semibold text-[#33ddff]">MY LIST</p>

          <h1 className="mt-2 text-3xl font-bold md:text-4xl">
            내가 찜한 리스트
          </h1>

          <p className="mt-3 text-sm text-white/45 md:text-base">
            관심 있는 영화와 시리즈를 한곳에서 확인하세요.
          </p>
        </section>

        {/* 필터 및 정렬 */}
        <section className="mt-10">
          <div className="flex flex-col gap-5 border-b border-white/10 pb-6 md:flex-row md:items-center md:justify-between">
            {/* 필터 */}
            <div className="flex max-w-full gap-2 overflow-x-auto pb-1">
              {WISHLIST_FILTERS.map((filter) => (
                <button
                  key={filter.key}
                  type="button"
                  onClick={() => setSelectedFilter(filter.key)}
                  className={`
                    shrink-0
                    cursor-pointer
                    rounded-full
                    border
                    px-4
                    py-2.5
                    text-sm
                    transition
                    ${
                      selectedFilter === filter.key
                        ? "border-[#33ddff] bg-[#33ddff] font-semibold text-black"
                        : "border-white/15 bg-white/5 text-white/60 hover:border-white/30 hover:text-white"
                    }
                  `}
                >
                  {filter.name}

                  <span className="ml-1.5 opacity-70">
                    {wishlistCounts[filter.key]}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between gap-3 md:justify-end">
              {/* 정렬 */}
              <select
                value={sortType}
                onChange={(event) => setSortType(event.target.value)}
                aria-label="찜 목록 정렬"
                className="
                  h-10
                  cursor-pointer
                  rounded-lg
                  border
                  border-white/15
                  bg-[#181818]
                  px-3
                  text-sm
                  text-white/75
                  outline-none
                  transition
                  focus:border-[#33ddff]
                "
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.name}
                  </option>
                ))}
              </select>

              {/* 전체 삭제 */}
              {visibleWishlist.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearWishlist}
                  className="flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-red-400/25 bg-red-400/5 px-3 text-sm text-red-300 transition hover:border-red-400/50 hover:bg-red-400/10"
                >
                  <Trash2 size={15} />
                  전체 삭제
                </button>
              )}
            </div>
          </div>
        </section>

        {/* 찜 목록 */}
        <section className="mt-8">
          {visibleWishlist.length > 0 ? (
            <div
              className="
                grid
                grid-cols-2
                gap-x-4
                gap-y-9
                sm:grid-cols-5
                md:grid-cols-6
                lg:grid-cols-7
                xl:grid-cols-8
              "
            >
              {visibleWishlist.map((item) => (
                <WishlistCard
                  key={`${item.media_type}-${item.id}`}
                  item={item}
                  onDelete={handleDeleteItem}
                />
              ))}
            </div>
          ) : (
            <EmptyWishlist selectedFilter={selectedFilter} />
          )}
        </section>
      </main>
    </>
  );
}

// 찜 카드
function WishlistCard({ item, onDelete }) {
  const isMovie = item.media_type === "movie";

  const title = isMovie ? item.title : item.name;

  const date = isMovie ? item.release_date : item.first_air_date;

  const year = date?.slice(0, 4);

  const detailPath = isMovie ? `/movie/${item.id}` : `/tv/${item.id}`;

  return (
    <article className="group relative min-w-0">
      <Link to={detailPath} className="block">
        {/* 포스터 */}
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
                <Film size={30} strokeWidth={1.4} />
              ) : (
                <Tv size={30} strokeWidth={1.4} />
              )}

              <span className="text-xs">등록된 이미지가 없습니다.</span>
            </div>
          )}

          {/* 삭제 버튼 */}
          <button
            type="button"
            onClick={(event) => onDelete(event, item)}
            aria-label={`${title} 찜 삭제`}
            className="
              absolute
              top-3
              right-3
              flex
              h-9
              w-9
              cursor-pointer
              items-center
              justify-center
              rounded-full
              border
              border-white/15
              bg-black/65
              text-white
              shadow-lg
              backdrop-blur-md
              transition
              hover:border-red-400
              hover:bg-red-500
            "
          >
            <Trash2 size={16} strokeWidth={1.8} />
          </button>

          {/* 미디어 종류 */}
          <span className="absolute bottom-3 left-3 rounded-md bg-black/70 px-2.5 py-1 text-[11px] font-medium text-white/75 backdrop-blur-md">
            {isMovie ? "영화" : "시리즈"}
          </span>
        </div>

        {/* 콘텐츠 정보 */}
        <div className="mt-3">
          <h2 className="line-clamp-2 text-[16px] leading-5 font-semibold text-white transition-colors group-hover:text-[#33ddff] md:text-base">
            {title}
          </h2>

          <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-white/45">
            {item.vote_average > 0 && (
              <span className="flex items-center gap-1 text-[#33ddff]">
                <Star size={13} fill="currentColor" />
                {Number(item.vote_average).toFixed(1)}
              </span>
            )}

            {year && (
              <>
                {item.vote_average > 0 && (
                  <span className="text-white/20">·</span>
                )}

                <span>{year}</span>
              </>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}

// 찜 목록이 비어 있을 때
function EmptyWishlist({ selectedFilter }) {
  const emptyText =
    selectedFilter === "movie"
      ? "찜한 영화가 없습니다."
      : selectedFilter === "tv"
        ? "찜한 시리즈가 없습니다."
        : "아직 찜한 콘텐츠가 없습니다.";

  return (
    <div className="flex min-h-[420px] items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] px-5 text-center">
      <div>
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/5">
          <Heart size={36} strokeWidth={1.4} className="text-white/20" />
        </div>

        <h2 className="mt-6 text-xl font-bold text-white/75 md:text-2xl">
          {emptyText}
        </h2>

        <p className="mt-3 text-sm leading-6 text-white/40">
          마음에 드는 콘텐츠의 찜하기 버튼을 눌러
          <br />
          나만의 리스트를 만들어보세요.
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

// addedAt이 없는 기존 찜 데이터도 안전하게 정렬
function getAddedTime(item) {
  const addedTime = new Date(item.addedAt || 0).getTime();

  return Number.isNaN(addedTime) ? 0 : addedTime;
}
