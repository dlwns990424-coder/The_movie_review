import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";

import HoverPreviewCard from "../../components/card/HoverPreviewCard";

import { W500_URL } from "../../../constants/imageUrl";

import "swiper/css";

export default function GlobalTop10({ items }) {
  const swiperRef = useRef(null);
  const hoverTimer = useRef(null);
  const closeTimer = useRef(null);

  // Swiper 처음과 끝 상태
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  // z-index를 유지하는 카드
  const [hoveredId, setHoveredId] = useState(null);

  // 실제 hover 미리보기 표시 여부
  const [visibleId, setVisibleId] = useState(null);

  // 현재 화면에 보이는 슬라이드 범위
  const [visibleRange, setVisibleRange] = useState({
    start: 0,
    end: 0,
  });

  // 찜 목록
  const [wishlist, setWishlist] = useState(() => {
    try {
      const savedWishlist = localStorage.getItem("wishlist");

      return savedWishlist ? JSON.parse(savedWishlist) : [];
    } catch (error) {
      console.log(error);
      return [];
    }
  });

  // Swiper 상태 업데이트
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

  // Hover 상태 초기화
  const resetHover = () => {
    clearTimeout(hoverTimer.current);
    clearTimeout(closeTimer.current);

    setVisibleId(null);
    setHoveredId(null);
  };

  useEffect(() => {
    return () => {
      clearTimeout(hoverTimer.current);
      clearTimeout(closeTimer.current);
    };
  }, []);

  // 찜 추가 및 삭제
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

  if (!items || items.length === 0) return null;

  return (
    <section className="relative overflow-x-clip bg-black/96 pt-[50px]">
      {/* 섹션 제목 */}
      <div className="mb-4 px-5 md:px-10 lg:px-15">
        <h2 className="text-xl font-bold text-white md:text-2xl">
          오늘의 글로벌 TOP 10
        </h2>
      </div>

      {/* Swiper 영역 */}
      <div className="relative px-5 md:px-10 lg:px-15">
        {/* 이전 버튼 */}
        {!isBeginning && (
          <button
            type="button"
            aria-label="이전 콘텐츠 보기"
            onClick={() => swiperRef.current?.slidePrev()}
            className="
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
              bg-black/40
              text-white
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
            resetHover();
            updateSwiperState(swiper);
          }}
          breakpoints={{
            0: {
              slidesPerView: 2,
              slidesPerGroup: 2,
              spaceBetween: 12,
            },

            480: {
              slidesPerView: 3,
              slidesPerGroup: 3,
              spaceBetween: 12,
            },

            768: {
              slidesPerView: 3,
              slidesPerGroup: 3,
              spaceBetween: 16,
            },

            940: {
              slidesPerView: 4,
              slidesPerGroup: 4,
              spaceBetween: 20,
            },

            1280: {
              slidesPerView: 4,
              slidesPerGroup: 4,
              spaceBetween: 24,
            },

            1600: {
              slidesPerView: 5,
              slidesPerGroup: 5,
              spaceBetween: 28,
            },
          }}
        >
          {items.map((item, index) => {
            if (!item.poster_path) return null;

            const mediaType = item.media_type;
            const cardId = `${mediaType}-${item.id}`;

            const detailPath =
              mediaType === "movie" ? `/movie/${item.id}` : `/tv/${item.id}`;

            const title = item.title || item.name;

            const date =
              mediaType === "movie" ? item.release_date : item.first_air_date;

            const year = date?.slice(0, 4);

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

                  // Hover 카드 먼저 숨김
                  setVisibleId(null);

                  // 애니메이션 종료 후 z-index 제거
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
                  {/*
                    왼쪽 공간은 순위 숫자 영역,
                    오른쪽은 포스터 영역
                  */}
                  <div className="relative pl-[20%] sm:pl-[22%] xl:pl-[24%]">
                    {/* 순위 숫자 */}
                    <div
                      className={`
                        pointer-events-none
                        absolute
                        top-[2%]
                        z-0
                        ${
                          index === 0
                            ? "left-[8%] sm:left-[6%] xl:left-[4%]"
                            : index === 9
                              ? "-left-[5%] sm:-left-[4%] md:-left-[5%] xl:-left-[6%]"
                              : "-left-[-4%] sm:-left-[3%] xl:-left-[2%]"
                        }
                      `}
                      style={{
                        WebkitMaskImage:
                          "linear-gradient(to right, black 50%, transparent 100%)",
                        maskImage:
                          "linear-gradient(to right, black 50%, transparent 100%)",
                      }}
                    >
                      <span
                        className="
                          block
                          text-[clamp(64px,9vw,160px)]
                          leading-none
                          font-black
                          tracking-[-0.12em]
                          text-transparent
                          [-webkit-text-stroke:2px_#33ddff80]
                          md:[-webkit-text-stroke:3px_#33ddff80]
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
                        w-full
                        overflow-hidden
                        rounded-lg
                        bg-white/10
                        md:rounded-xl
                      "
                    >
                      <img
                        src={`${W500_URL}${item.poster_path}`}
                        alt={title}
                        className="
                          h-full
                          w-full
                          object-cover
                          transition-transform
                          duration-300
                        "
                      />

                      {/* 아래쪽 어두운 그라데이션 */}
                      <div
                        className="
                          pointer-events-none
                          absolute
                          inset-x-0
                          bottom-0
                          h-[45%]
                          bg-gradient-to-t
                          from-black
                          via-black/70
                          to-transparent
                        "
                      />

                      {/* 제목 및 정보 */}
                      <div
                        className="
                          absolute
                          right-0
                          bottom-0
                          left-0
                          z-20
                          p-2
                          sm:p-3
                          xl:p-4
                        "
                      >
                        <h3
                          className="
                            line-clamp-2
                            text-[11px]
                            leading-snug
                            font-bold
                            text-white
                            drop-shadow
                            sm:text-[12px]
                            md:text-[14px]
                            xl:text-[17px]
                          "
                        >
                          {title}
                        </h3>

                        <div
                          className="
                            mt-1
                            flex
                            flex-wrap
                            items-center
                            gap-x-2
                            text-[9px]
                            text-white/70
                            sm:text-[10px]
                            md:text-[12px]
                            xl:text-[13px]
                          "
                        >
                          {year && <span>{year}</span>}

                          <span>★ {item.vote_average?.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>

                {/* 공통 Hover 미리보기 카드 */}
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

        {/* 다음 버튼 */}
        {!isEnd && (
          <button
            type="button"
            aria-label="다음 콘텐츠 보기"
            onClick={() => swiperRef.current?.slideNext()}
            className="
              absolute
              top-0
              right-0
              bottom-0
              z-[200]
              hidden
              w-10
              cursor-pointer
              items-center
              justify-center
              hover:bg-black/40
              transition-all
              duration-200
              text-white
              md:flex
              rounded-l-2xl
              rounded-bl-lg-2x1
            "
          >
            <ChevronRight size={42} strokeWidth={1.5} />
          </button>
        )}
      </div>
    </section>
  );
}
