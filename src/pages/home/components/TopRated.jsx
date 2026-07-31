import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import HoverPreviewCard from "../../../components/cards/HoverPreviewCard";

import "swiper/css";

import { getTopRatedMovies } from "../../../api/movieApi";
import { getTopRatedTv } from "../../../api/tvApi";
import { ORIGINAL_URL } from "../../../constants/imageUrl";

export default function TopRated() {
  const swiperRef = useRef(null);
  const hoverTimer = useRef(null);
  const closeTimer = useRef(null);

  const [activeTab, setActiveTab] = useState("movie");
  const [movieData, setMovieData] = useState([]);
  const [tvData, setTvData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  // z-index를 유지할 카드
  const [hoveredId, setHoveredId] = useState(null);

  // 실제로 보이는 hover 카드
  const [visibleId, setVisibleId] = useState(null);

  const [wishlist, setWishlist] = useState(() => {
    const savedWishlist = localStorage.getItem("wishlist");

    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });
  const [visibleRange, setVisibleRange] = useState({
    start: 0,
    end: 0,
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
    const getTopRatedData = async () => {
      try {
        setLoading(true);

        const [movieResponse, tvResponse] = await Promise.all([
          getTopRatedMovies(),
          getTopRatedTv(),
        ]);

        setMovieData(movieResponse.results);
        setTvData(tvResponse.results);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getTopRatedData();

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
    <section className="relative overflow-x-clip bg-black pt-[50px]">
      {/* 제목 및 탭 */}
      <div className="mb-8 flex items-center justify-between px-5 md:px-10 lg:px-15">
        <h2 className="text-2xl font-bold text-white md:text-[24px]">
          평점 높은 콘텐츠
        </h2>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleTab("movie")}
            className={`cursor-pointer rounded-full px-4 py-2 text-sm transition ${
              activeTab === "movie"
                ? "bg-[#33ddff] text-black"
                : "bg-white/10 text-white"
            }`}
          >
            영화
          </button>

          <button
            type="button"
            onClick={() => handleTab("tv")}
            className={`cursor-pointer rounded-full px-4 py-2 text-sm transition ${
              activeTab === "tv"
                ? "bg-[#33ddff] text-black"
                : "bg-white/10 text-white"
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
              text-white
              lg:flex
            bg-black/50

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
            const previewPosition =
              index === visibleRange.start
                ? "left"
                : index === visibleRange.end
                  ? "right"
                  : "center";

            const mediaType = activeTab;
            const cardId = `${mediaType}-${item.id}`;

            const title = mediaType === "movie" ? item.title : item.name;

            const date =
              mediaType === "movie" ? item.release_date : item.first_air_date;

            const year = date?.slice(0, 4);

            const detailPath =
              mediaType === "movie" ? `/movie/${item.id}` : `/tv/${item.id}`;

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

                  // 먼저 hover 카드 숨김
                  setVisibleId(null);

                  // 사라지는 애니메이션이 끝난 뒤 z-index 제거
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
                        ${isVisible ? "scale-105" : "scale-100"}
                      `}
                    />
                  </div>

                  <div className="mt-3">
                    <h3 className="truncate text-base font-semibold text-white">
                      {title}
                    </h3>

                    <div className="mt-1 flex items-center gap-2 text-sm text-white/60">
                      <span>★ {item.vote_average?.toFixed(1)}</span>

                      {year && <span>{year}</span>}
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
                />
              </SwiperSlide>
            );
          })}
        </Swiper>

        {!isEnd && (
          <button
            type="button"
            onClick={() => swiperRef.current?.slideNext()}
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
              text-white
              md:flex
              bg-black/50
            "
          >
            <ChevronRight size={42} strokeWidth={1.5} />
          </button>
        )}
      </div>
    </section>
  );
}
