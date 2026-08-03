import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";

import HoverPreviewCard from "../../components/card/HoverPreviewCard";
import ContentsSkeleton from "../../components/skeleton/ContentsSkeleton";

import { getTopRatedTvByGenre } from "../../../api/tvApi";
import { ORIGINAL_URL } from "../../../constants/imageUrl";
import { addGenreNames } from "../../../lib/genreUtils";

import "swiper/css";

export default function GenreTopRatedTv({ selectedGenre, heroTitle }) {
  const swiperRef = useRef(null);
  const hoverTimer = useRef(null);
  const closeTimer = useRef(null);

  // 선택한 장르의 평점 높은 시리즈
  const [tvData, setTvData] = useState([]);

  // 데이터 로딩 상태
  const [loading, setLoading] = useState(true);

  // Swiper 처음과 끝 상태
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  // Hover 카드의 z-index를 유지할 ID
  const [hoveredId, setHoveredId] = useState(null);

  // 실제로 화면에 보이는 Hover 카드 ID
  const [visibleId, setVisibleId] = useState(null);

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

  // 현재 화면에 보이는 슬라이드 범위
  const [visibleRange, setVisibleRange] = useState({
    start: 0,
    end: 0,
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

  // 선택한 장르가 변경될 때마다 평점 높은 시리즈 요청
  useEffect(() => {
    if (!selectedGenre) return;

    const getGenreTopRatedTv = async () => {
      try {
        setLoading(true);

        const tvResponse = await getTopRatedTvByGenre(selectedGenre);

        const tvList = await addGenreNames(tvResponse.results, "tv");

        setTvData(tvList);

        // 장르가 변경되면 Swiper 첫 번째로 이동
        setTimeout(() => {
          swiperRef.current?.slideTo(0);
          setIsBeginning(true);
          setIsEnd(false);
        }, 0);
      } catch (error) {
        console.log(error);
        setTvData([]);
      } finally {
        setLoading(false);
      }
    };

    getGenreTopRatedTv();

    return () => {
      clearTimeout(hoverTimer.current);
      clearTimeout(closeTimer.current);
    };
  }, [selectedGenre]);

  // 찜 추가 및 해제
  const handleWishlist = (e, item) => {
    e.preventDefault();
    e.stopPropagation();

    const wishlistItem = {
      ...item,
      media_type: "tv",
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

  if (!selectedGenre || loading) {
    return <ContentsSkeleton />;
  }

  if (tvData.length === 0) {
    return null;
  }

  return (
    <section className="relative overflow-x-clip bg-black/96 pt-[50px]">
      {/* 제목 */}
      <div className="mb-8 flex items-center justify-between px-5 md:px-10 lg:px-15">
        <h2 className="text-xl font-bold text-white md:text-2xl">
          <span className="text-[#33ddff]">{heroTitle}</span> (와)과 같은 장르의
          평점 높은 시리즈
        </h2>
      </div>

      {/* Swiper 영역 */}
      <div className="relative px-5 md:px-10 lg:px-15">
        {!isBeginning && (
          <button
            type="button"
            aria-label="이전 시리즈 보기"
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
              bg-black/50
              text-white
              lg:flex
            "
          >
            <ChevronLeft size={42} strokeWidth={1.5} />
          </button>
        )}

        <Swiper
          key={selectedGenre.id}
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
              slidesPerView: 3,
              slidesPerGroup: 3,
              spaceBetween: 10,
            },
            480: {
              slidesPerView: 3,
              slidesPerGroup: 3,
              spaceBetween: 10,
            },
            768: {
              slidesPerView: 5,
              slidesPerGroup: 5,
              spaceBetween: 12,
            },
            940: {
              slidesPerView: 6,
              slidesPerGroup: 6,
              spaceBetween: 16,
            },
            1280: {
              slidesPerView: 7,
              slidesPerGroup: 7,
              spaceBetween: 18,
            },
            1600: {
              slidesPerView: 8,
              slidesPerGroup: 8,
              spaceBetween: 18,
            },
          }}
        >
          {tvData.map((item, index) => {
            if (!item.poster_path) return null;

            const previewPosition =
              index === visibleRange.start
                ? "left"
                : index === visibleRange.end
                  ? "right"
                  : "center";

            const mediaType = "tv";
            const cardId = `tv-${item.id}`;
            const title = item.name;
            const year = item.first_air_date?.slice(0, 4);
            const detailPath = `/tv/${item.id}`;

            const isHovered = hoveredId === cardId;
            const isVisible = visibleId === cardId;

            const isWishlisted = wishlist.some(
              (savedItem) =>
                savedItem.id === item.id && savedItem.media_type === mediaType,
            );

            return (
              <SwiperSlide
                key={selectedGenre.key}
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

                  // 먼저 Hover 카드 숨김
                  setVisibleId(null);

                  // 애니메이션이 끝난 뒤 z-index 제거
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
                      alt={title}
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
            aria-label="다음 시리즈 보기"
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
