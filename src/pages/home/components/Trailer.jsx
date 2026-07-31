import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import HoverPreviewCard from "../../../components/cards/HoverPreviewCard";

import "swiper/css";
import { getUpcomingTv } from "../../../api/tvApi";
import { getUpcomingMovies } from "../../../api/movieApi";
import { ORIGINAL_URL } from "../../../constants/imageUrl";
import { addGenreNames } from "../../../lib/genreUtils";
// 오늘부터 공개일까지 남은 날짜 계산
const getDDay = (date) => {
  if (!date) return null;

  const today = new Date();
  const releaseDate = new Date(`${date}T00:00:00`);

  today.setHours(0, 0, 0, 0);

  const difference = releaseDate.getTime() - today.getTime();
  const days = Math.ceil(difference / (1000 * 60 * 60 * 24));

  if (days > 0) return `D-${days}`;
  if (days === 0) return "D-DAY";

  return "공개됨";
};

export default function Trailer() {
  const swiperRef = useRef(null);
  const hoverTimer = useRef(null);
  const closeTimer = useRef(null);

  const [activeTab, setActiveTab] = useState("movie");

  const [movieData, setMovieData] = useState([]);
  const [tvData, setTvData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  // hover 카드의 z-index를 유지
  const [hoveredId, setHoveredId] = useState(null);

  // 실제로 화면에 보이는 hover 카드
  const [visibleId, setVisibleId] = useState(null);

  const [visibleRange, setVisibleRange] = useState({
    start: 0,
    end: 0,
  });

  const [wishlist, setWishlist] = useState(() => {
    const savedWishlist = localStorage.getItem("wishlist");

    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });

  const updateSwiperState = (swiper) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);

    const slidesPerView =
      typeof swiper.params.slidesPerView === "number"
        ? swiper.params.slidesPerView
        : 1;

    setVisibleRange({
      start: swiper.activeIndex,
      end: swiper.activeIndex + slidesPerView - 1,
    });
  };

  useEffect(() => {
    const getTrailerData = async () => {
      try {
        setLoading(true);

        const [movieResponse, tvResponse] = await Promise.all([
          getUpcomingMovies(),
          getUpcomingTv(),
        ]);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const upcomingMovies = movieResponse.results
          .filter((item) => {
            if (!item.release_date) return false;

            const releaseDate = new Date(`${item.release_date}T00:00:00`);

            return releaseDate >= today;
          })
          .sort((a, b) => {
            const dateA = new Date(`${a.release_date}T00:00:00`);
            const dateB = new Date(`${b.release_date}T00:00:00`);

            return dateA - dateB;
          });

        const upcomingTv = tvResponse.results
          .filter((item) => {
            if (!item.first_air_date) return false;

            const firstAirDate = new Date(`${item.first_air_date}T00:00:00`);

            return firstAirDate >= today;
          })
          .sort((a, b) => {
            const dateA = new Date(`${a.first_air_date}T00:00:00`);
            const dateB = new Date(`${b.first_air_date}T00:00:00`);

            return dateA - dateB;
          });

        const movieList = await addGenreNames(upcomingMovies, "movie");
        const tvList = await addGenreNames(upcomingTv, "tv");

        setMovieData(movieList);
        setTvData(tvList);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getTrailerData();

    return () => {
      clearTimeout(hoverTimer.current);
      clearTimeout(closeTimer.current);
    };
  }, []);

  const currentData = activeTab === "movie" ? movieData : tvData;

  const resetHover = () => {
    clearTimeout(hoverTimer.current);
    clearTimeout(closeTimer.current);

    setVisibleId(null);
    setHoveredId(null);
  };

  const handleTab = (tab) => {
    resetHover();
    setActiveTab(tab);

    setTimeout(() => {
      swiperRef.current?.slideTo(0);
      setIsBeginning(true);
      setIsEnd(false);
    }, 0);
  };

  const handleWishlist = (e, item) => {
    e.preventDefault();
    e.stopPropagation();

    const wishlistItem = {
      ...item,
      media_type: activeTab,
    };

    setWishlist((prev) => {
      const alreadySaved = prev.some(
        (savedItem) =>
          savedItem.id === wishlistItem.id &&
          savedItem.media_type === wishlistItem.media_type,
      );

      const nextWishlist = alreadySaved
        ? prev.filter(
            (savedItem) =>
              !(
                savedItem.id === wishlistItem.id &&
                savedItem.media_type === wishlistItem.media_type
              ),
          )
        : [...prev, wishlistItem];

      localStorage.setItem("wishlist", JSON.stringify(nextWishlist));

      return nextWishlist;
    });
  };

  if (loading) return null;

  return (
    <section className="relative overflow-x-clip bg-black/96 py-[50px]">
      {/* 제목 및 탭 */}
      <div className="mb-8 flex items-center justify-between px-5 md:px-10 lg:px-15">
        <h2 className="text-2xl font-bold text-white md:text-[24px]">
          최신 예고편
        </h2>

        <div className="flex gap-2 rounded-4xl bg-white/10 px-2 py-2">
          <button
            type="button"
            onClick={() => handleTab("movie")}
            className={`cursor-pointer rounded-full px-4 py-1 text-sm transition ${
              activeTab === "movie" ? "bg-[#33ddff] text-black" : "text-white"
            }`}
          >
            영화
          </button>

          <button
            type="button"
            onClick={() => handleTab("tv")}
            className={`cursor-pointer rounded-full px-4 py-1 text-sm transition ${
              activeTab === "tv" ? "bg-[#33ddff] text-black" : "text-white"
            }`}
          >
            시리즈
          </button>
        </div>
      </div>

      {/* Swiper 영역 */}
      <div className="relative px-5 md:px-10 lg:px-15">
        {!isBeginning && (
          <button
            type="button"
            onClick={() => swiperRef.current?.slidePrev()}
            aria-label="이전 콘텐츠"
            className="
              absolute
              top-0
              bottom-0
              left-0
              z-[50]
              hidden
              w-10
              cursor-pointer
              items-center
              justify-center
              bg-black/50
              text-white
              lg:flex
            "
          >
            <ChevronLeft size={42} strokeWidth={1.5} />
          </button>
        )}

        <Swiper
          key={activeTab}
          className="!overflow-visible"
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            updateSwiperState(swiper);
          }}
          onSlideChange={(swiper) => {
            resetHover();
            updateSwiperState(swiper);
          }}
          onBreakpoint={(swiper) => {
            updateSwiperState(swiper);
          }}
          breakpoints={{
            0: {
              slidesPerView: 2,
              slidesPerGroup: 2,
              spaceBetween: 10,
            },
            480: {
              slidesPerView: 3,
              slidesPerGroup: 3,
              spaceBetween: 10,
            },
            768: {
              slidesPerView: 3,
              slidesPerGroup: 3,
              spaceBetween: 12,
            },
            940: {
              slidesPerView: 4,
              slidesPerGroup: 4,
              spaceBetween: 16,
            },
            1280: {
              slidesPerView: 4,
              slidesPerGroup: 4,
              spaceBetween: 18,
            },
            1600: {
              slidesPerView: 5,
              slidesPerGroup: 5,
              spaceBetween: 18,
            },
          }}
        >
          {currentData.map((item, index) => {
            if (!item.backdrop_path) return null;

            const mediaType = activeTab;
            const cardId = `${mediaType}-${item.id}`;

            const title = mediaType === "movie" ? item.title : item.name;

            const date =
              mediaType === "movie" ? item.release_date : item.first_air_date;

            const dDay = getDDay(date);

            const detailPath =
              mediaType === "movie" ? `/movie/${item.id}` : `/tv/${item.id}`;

            const previewPosition =
              index === visibleRange.start
                ? "left"
                : index === visibleRange.end
                  ? "right"
                  : "center";

            const isHovered = hoveredId === cardId;
            const isVisible = visibleId === cardId;

            const isWishlisted = wishlist.some(
              (savedItem) =>
                savedItem.id === item.id && savedItem.media_type === mediaType,
            );

            return (
              <SwiperSlide
                key={cardId}
                onMouseEnter={() => {
                  clearTimeout(hoverTimer.current);
                  clearTimeout(closeTimer.current);

                  hoverTimer.current = setTimeout(() => {
                    setHoveredId(cardId);
                    setVisibleId(cardId);
                  }, 500);
                }}
                onMouseLeave={() => {
                  clearTimeout(hoverTimer.current);

                  setVisibleId(null);

                  closeTimer.current = setTimeout(() => {
                    setHoveredId(null);
                  }, 300);
                }}
                className={`
                  relative
                  transition
                  ${isHovered ? "!z-[150]" : "!z-0"}
                `}
              >
                {/* 기본 카드 */}
                <Link to={detailPath} className="block">
                  <div className="aspect-video overflow-hidden rounded-lg bg-white/10">
                    <img
                      src={`${ORIGINAL_URL}${item.backdrop_path}`}
                      alt={title}
                      className={`
                        h-full
                        w-full
                        object-cover
                        transition-transform
                        duration-300
                      `}
                    />
                  </div>

                  <div className="mt-3">
                    <h3 className="truncate text-base font-semibold text-white">
                      {title}
                    </h3>

                    <div className="mt-1 flex items-center gap-2 text-sm text-white/60">
                      {dDay && (
                        <span className="font-semibold text-[#33ddff]">
                          {dDay}
                        </span>
                      )}

                      {date && <span>{date.replaceAll("-", ".")}</span>}
                    </div>
                  </div>
                </Link>

                {/* 상세 미리보기 카드 */}
                <HoverPreviewCard
                  item={item}
                  mediaType={mediaType}
                  detailPath={detailPath}
                  isVisible={isVisible}
                  isWishlisted={isWishlisted}
                  handleWishlist={handleWishlist}
                  position={previewPosition}
                  infoType="release"
                />
              </SwiperSlide>
            );
          })}
        </Swiper>

        {!isEnd && (
          <button
            type="button"
            onClick={() => swiperRef.current?.slideNext()}
            aria-label="다음 콘텐츠"
            className="
              absolute
              top-0
              right-0
              bottom-0
              z-[50]
              hidden
              w-10
              cursor-pointer
              items-center
              justify-center
              bg-black/50
              text-white
              md:flex
            "
          >
            <ChevronRight size={42} strokeWidth={1.5} />
          </button>
        )}
      </div>
    </section>
  );
}
