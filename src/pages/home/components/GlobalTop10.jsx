import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import HoverPreviewCard from "../../../components/cards/HoverPreviewCard";

import "swiper/css";

import { W500_URL } from "../../../constants/imageUrl";

export default function GlobalTop10({ items }) {
  const swiperRef = useRef(null);
  const hoverTimer = useRef(null);
  const closeTimer = useRef(null);

  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  // z-index를 유지하는 카드
  const [hoveredId, setHoveredId] = useState(null);

  // 실제 hover 미리보기 표시 여부
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
    return () => {
      clearTimeout(hoverTimer.current);
      clearTimeout(closeTimer.current);
    };
  }, []);

  const resetHover = () => {
    clearTimeout(hoverTimer.current);
    clearTimeout(closeTimer.current);

    setVisibleId(null);
    setHoveredId(null);
  };

  const handleWishlist = (e, item) => {
    e.preventDefault();
    e.stopPropagation();

    setWishlist((prev) => {
      const alreadySaved = prev.some(
        (savedItem) =>
          savedItem.id === item.id && savedItem.media_type === item.media_type,
      );

      const nextWishlist = alreadySaved
        ? prev.filter(
            (savedItem) =>
              !(
                savedItem.id === item.id &&
                savedItem.media_type === item.media_type
              ),
          )
        : [...prev, item];

      localStorage.setItem("wishlist", JSON.stringify(nextWishlist));

      return nextWishlist;
    });
  };

  return (
    <section className="relative overflow-x-clip bg-black/96">
      <h2 className="mx-5 mb-8 pt-[50px] text-2xl md:text-[24px] font-bold text-white md:mx-[40px] lg:mx-[60px]">
        오늘의 글로벌 TOP 10
      </h2>

      <div className="relative px-5 hover:[&>.swiper-btn]:opacity-100 md:px-[40px] lg:px-[60px]">
        {!isBeginning && (
          <button
            type="button"
            onClick={() => swiperRef.current?.slidePrev()}
            className="
              swiper-btn
              absolute
              top-0
              bottom-0
              left-0
              z-[200]
              hidden
              w-10
              cursor-pointer
              items-center
              justify-center
              text-white
              transition-opacity
              duration-300
              lg:flex
            "
          >
            <ChevronLeft size={42} strokeWidth={1.5} />
          </button>
        )}

        <Swiper
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
              spaceBetween: 20,
            },
            480: {
              slidesPerView: 3,
              slidesPerGroup: 3,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 3,
              slidesPerGroup: 3,
              spaceBetween: 20,
            },
            940: {
              slidesPerView: 4,
              slidesPerGroup: 4,
              spaceBetween: 30,
            },
            1280: {
              slidesPerView: 4,
              slidesPerGroup: 4,
              spaceBetween: 40,
            },
            1600: {
              slidesPerView: 5,
              slidesPerGroup: 5,
              spaceBetween: 36,
            },
          }}
        >
          {items.map((item, index) => {
            if (!item.poster_path) return null;
            const previewPosition =
              index === visibleRange.start
                ? "left"
                : index === visibleRange.end
                  ? "right"
                  : "center";
            const mediaType = item.media_type;
            const cardId = `${mediaType}-${item.id}`;

            const detailPath =
              mediaType === "movie" ? `/movie/${item.id}` : `/tv/${item.id}`;

            const title = item.title || item.name;

            const date =
              mediaType === "movie" ? item.release_date : item.first_air_date;

            const year = date?.slice(0, 4);

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

                  // 애니메이션 종료 후 z-index 제거
                  closeTimer.current = setTimeout(() => {
                    setHoveredId(null);
                  }, 300);
                }}
                className={`
                  relative
                  pl-[30px]
                  transition
                  xl:pl-[70px]
                  ${isHovered ? "!z-[150]" : "!z-0"}
                `}
              >
                {/* 기본 카드 */}
                <Link to={detailPath} className="block">
                  <div className="relative">
                    {/* 순위 숫자 */}
                    <div
                      className={`
                        pointer-events-none
                        absolute
                        top-0
                        z-0
                        ${
                          index === 9
                            ? "-left-10 md:-left-16 xl:-left-24"
                            : "-left-6 xl:-left-18"
                        }
                      `}
                      style={{
                        WebkitMaskImage:
                          "linear-gradient(to right, black 55%, transparent 100%)",
                        maskImage:
                          "linear-gradient(to right, black 50%, transparent 100%)",
                      }}
                    >
                      <span
                        className="
                          block
                          text-[60px]
                          leading-none
                          font-black
                          tracking-[-20%]
                          text-transparent
                          [-webkit-text-stroke:3px_#33ddff80]
                          xl:text-[160px]
                        "
                      >
                        {index + 1}
                      </span>
                    </div>

                    {/* 포스터 */}
                    <div
                      className="
                        relative
                        z-10
                        aspect-[2/3]
                        w-[120px]
                        shrink-0
                        overflow-hidden
                        rounded-xl
                        transition-transform
                        duration-300
                        md:w-[170px]
                        xl:w-[220px]
                      "
                    >
                      <img
                        src={`${W500_URL}${item.poster_path}`}
                        alt={title}
                        className={`
                          h-full
                          w-full
                          object-cover
                          transition-transform
                          duration-300
                        `}
                      />

                      <div
                        className="
                          pointer-events-none
                          absolute
                          inset-x-0
                          bottom-0
                          h-3/7
                          bg-gradient-to-t
                          from-black
                          via-black/70
                          to-transparent
                        "
                      />
                    </div>
                  </div>

                  {/* 제목 및 정보 */}
                  <div className="absolute right-0 bottom-2 left-4 z-20 px-2">
                    <h3
                      className="
                        line-clamp-2
                        pl-[20px]
                        text-[14px]
                        font-bold
                        text-white
                        drop-shadow
                        md:text-[16px]
                        xl:pl-[60px]
                        xl:text-[18px]
                      "
                    >
                      {title}
                    </h3>

                    <div className="mt-1 flex items-center gap-2 pl-[20px] text-[12px] text-white/70 md:text-[13px] xl:pl-[60px]">
                      {year && <span>{year}</span>}

                      <span>★ {item.vote_average?.toFixed(1)}</span>
                    </div>
                  </div>
                </Link>

                {/* 공통 hover 미리보기 카드 */}
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
              swiper-btn
              absolute
              top-0
              right-0
              bottom-0
              z-[200]
              flex
              w-10
              cursor-pointer
              items-center
              justify-center
              text-white
              transition-opacity
              duration-300
            "
          >
            <ChevronRight size={42} strokeWidth={1.5} />
          </button>
        )}
      </div>
    </section>
  );
}
