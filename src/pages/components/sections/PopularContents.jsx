import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";

import HoverPreviewCard from "../card/HoverPreviewCard";

import { getPopularMovies } from "../../../api/movieApi";
import { getPopularTv } from "../../../api/tvApi";
import { ORIGINAL_URL } from "../../../constants/imageUrl";
import { addGenreNames } from "../../../lib/genreUtils";

import "swiper/css";

export default function PopularContents({ mediaType, title }) {
  const swiperRef = useRef(null);
  const hoverTimer = useRef(null);
  const closeTimer = useRef(null);

  // 영화 또는 시리즈 목록
  const [contents, setContents] = useState([]);

  // 데이터 로딩 상태
  const [loading, setLoading] = useState(true);

  // Swiper 처음과 끝 상태
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  // z-index를 유지할 카드
  const [hoveredId, setHoveredId] = useState(null);

  // 실제로 보이는 Hover 카드
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

  // Swiper 위치 상태 업데이트
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
    const getPopularData = async () => {
      try {
        setLoading(true);

        // mediaType이 movie면 인기 영화,
        // tv면 인기 시리즈 API 실행
        const response =
          mediaType === "movie"
            ? await getPopularMovies()
            : await getPopularTv();

        // 장르 번호를 장르 이름으로 변환
        const list = await addGenreNames(response.results, mediaType);

        setContents(list);
      } catch (error) {
        console.log(error);
        setContents([]);
      } finally {
        setLoading(false);
      }
    };

    getPopularData();

    return () => {
      clearTimeout(hoverTimer.current);
      clearTimeout(closeTimer.current);
    };
  }, [mediaType]);

  // 찜 추가 및 삭제
  const handleWishlist = (e, item) => {
    e.preventDefault();
    e.stopPropagation();

    const wishlistItem = {
      ...item,
      media_type: mediaType,
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

  if (contents.length === 0) return null;

  return (
    <section className="relative overflow-x-clip bg-black/96 pt-[70px]">
      {/* 섹션 제목 */}
      <div className="mb-4 px-5 md:px-10 xl:px-15">
        <h2 className="text-2xl font-bold text-white md:text-[24px]">
          {title}
        </h2>
      </div>

      {/* Swiper 영역 */}
      <div className="relative px-5 md:px-10 lg:px-15">
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
              z-[50]
              hidden
              w-10
              cursor-pointer
              items-center
              justify-center
              duration-200
              hover:bg-black/40
              text-white
              rounded-r-2xl
              rounded-br-lg-2x1
              lg:flex
            "
          >
            <ChevronLeft size={42} strokeWidth={1.5} />
          </button>
        )}

        <Swiper
          key={mediaType}
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
              slidesPerView: 8,
              slidesPerGroup: 8,
              spaceBetween: 18,
            },
          }}
        >
          {contents.map((item, index) => {
            if (!item.backdrop_path) return null;

            const previewPosition =
              index === visibleRange.start
                ? "left"
                : index === visibleRange.end
                  ? "right"
                  : "center";

            const cardId = `${mediaType}-${item.id}`;

            const contentTitle = mediaType === "movie" ? item.title : item.name;

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
                  <div className="aspect-[2/3] overflow-hidden rounded-lg bg-white/10">
                    <img
                      src={`${ORIGINAL_URL}${item.poster_path}`}
                      alt={contentTitle}
                      className="
                      h-full
                      w-full
                      object-cover
                      transition-transform
                      duration-300
                    "
                    />
                  </div>

                  <div className="mt-3">
                    <h3 className="truncate text-base font-semibold text-white">
                      {contentTitle}
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
            aria-label="다음 콘텐츠 보기"
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
              transition-all
              duration-200
              hover:bg-black/40
              text-white
              rounded-l-2xl
              rounded-bl-lg-2x1
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
