import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";

import HoverPreviewCard from "../../components/card/HoverPreviewCard";

import { getLatestReleasedTv } from "../../../api/tvApi";
import { ORIGINAL_URL } from "../../../constants/imageUrl";
import { addGenreNames } from "../../../lib/genreUtils";

import "swiper/css";

export default function LatestReleasedTv({ title = "최신 공개 시리즈" }) {
  const swiperRef = useRef(null);
  const hoverTimer = useRef(null);
  const closeTimer = useRef(null);

  // 최신 공개 시리즈 목록
  const [contents, setContents] = useState([]);

  // 데이터 로딩 상태
  const [loading, setLoading] = useState(true);

  // Swiper 처음과 끝 상태
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  // Hover 카드의 z-index를 유지할 ID
  const [hoveredId, setHoveredId] = useState(null);

  // 실제로 보이는 Hover 카드 ID
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
    const getLatestReleasedData = async () => {
      try {
        setLoading(true);

        // 최신 공개 시리즈 요청
        const response = await getLatestReleasedTv();

        // 포스터와 첫 공개일이 있는 시리즈만 사용
        const filteredContents = response.results.filter(
          (item) => item.poster_path && item.first_air_date,
        );

        // 장르 ID를 장르 이름으로 변환
        const list = await addGenreNames(filteredContents, "tv");

        setContents(list);
      } catch (error) {
        console.log(error);
        setContents([]);
      } finally {
        setLoading(false);
      }
    };

    getLatestReleasedData();

    return () => {
      clearTimeout(hoverTimer.current);
      clearTimeout(closeTimer.current);
    };
  }, []);

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

  if (loading) return null;

  if (contents.length === 0) return null;

  return (
    <section className="relative overflow-x-clip bg-black/96 pt-[70px]">
      {/* 섹션 제목 */}
      <div className="mb-4 flex items-center justify-between px-5 md:px-10 lg:px-15">
        <h2 className="text-xl font-bold text-white md:text-2xl">{title}</h2>
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
              rounded-r-2xl
              text-white
              transition-all
              duration-200
              hover:bg-black/40
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
          {contents.map((item, index) => {
            const mediaType = "tv";
            const cardId = `tv-${item.id}`;
            const contentTitle = item.name;
            const detailPath = `/tv/${item.id}`;

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
                      <span>공개일</span>

                      <span className="text-[#33ddff]">
                        {item.first_air_date?.replaceAll("-", ".")}
                      </span>
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
              rounded-l-2xl
              text-white
              transition-all
              duration-200
              hover:bg-black/40
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
