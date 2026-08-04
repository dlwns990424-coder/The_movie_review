import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { useWishlist } from "../../hook/useWishlist";
import HoverPreviewCard from "../card/HoverPreviewCard";

import { getUpcomingMovies } from "../../../api/movieApi";
import { getUpcomingTv } from "../../../api/tvApi";
import { ORIGINAL_URL } from "../../../constants/imageUrl";
import { addGenreNames } from "../../../lib/genreUtils";

import "swiper/css";

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

export default function Upcoming({ mediaType, title }) {
  const swiperRef = useRef(null);
  const hoverTimer = useRef(null);
  const closeTimer = useRef(null);

  // 공개 예정 콘텐츠 목록
  const [contents, setContents] = useState([]);

  // 데이터 로딩 상태
  const [loading, setLoading] = useState(true);

  // Swiper 처음과 끝 상태
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  // Hover 카드의 z-index 유지
  const [hoveredId, setHoveredId] = useState(null);

  // 실제로 보이는 Hover 카드
  const [visibleId, setVisibleId] = useState(null);

  // 현재 화면에 보이는 슬라이드 범위
  const [visibleRange, setVisibleRange] = useState({
    start: 0,
    end: 0,
  });

  const { isWishlisted, toggleWishlist } = useWishlist();

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
    const getUpcomingData = async () => {
      try {
        setLoading(true);

        // 영화 또는 시리즈 공개 예정 API 요청
        const response =
          mediaType === "movie"
            ? await getUpcomingMovies()
            : await getUpcomingTv();

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // 영화와 시리즈의 날짜 필드가 다르므로 구분
        const dateField =
          mediaType === "movie" ? "release_date" : "first_air_date";

        // 오늘 이후 공개되는 콘텐츠만 남기고 날짜순 정렬
        const upcomingContents = response.results
          .filter((item) => {
            const date = item[dateField];

            if (!date) return false;
            if (!item.poster_path) return false;

            const releaseDate = new Date(`${date}T00:00:00`);

            return releaseDate >= today;
          })
          .sort((a, b) => {
            const dateA = new Date(`${a[dateField]}T00:00:00`);
            const dateB = new Date(`${b[dateField]}T00:00:00`);

            return dateA - dateB;
          });

        // 장르 ID를 장르 이름으로 변경
        const list = await addGenreNames(upcomingContents, mediaType);

        setContents(list);
      } catch (error) {
        console.log(error);
        setContents([]);
      } finally {
        setLoading(false);
      }
    };

    getUpcomingData();

    return () => {
      clearTimeout(hoverTimer.current);
      clearTimeout(closeTimer.current);
    };
  }, [mediaType]);

  const handleWishlist = (event, item) => {
    toggleWishlist(event, item, mediaType);
  };

  if (loading) return null;

  if (contents.length === 0) return null;

  return (
    <section className="relative overflow-x-clip bg-black py-[70px]">
      {/* 섹션 제목 */}
      <div className="mb-4 flex items-center justify-between px-5 md:px-10 lg:px-15">
        <h2 className="text-xl font-bold text-white md:text-2xl">{title}</h2>
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
            const cardId = `${mediaType}-${item.id}`;

            const contentTitle = mediaType === "movie" ? item.title : item.name;

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

            const itemIsWishlisted = isWishlisted(item.id, mediaType);
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

                  // 애니메이션이 끝난 후 z-index 제거
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
                  isWishlisted={itemIsWishlisted}
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
