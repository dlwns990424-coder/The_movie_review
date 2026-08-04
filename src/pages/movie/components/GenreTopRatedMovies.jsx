import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";

import HoverPreviewCard from "../../components/card/HoverPreviewCard";
import ContentsSkeleton from "../../components/skeleton/ContentsSkeleton";
import { useWishlist } from "../../hook/useWishlist";

import { getTopRatedMoviesByGenre } from "../../../api/movieApi";
import { ORIGINAL_URL } from "../../../constants/imageUrl";
import { addGenreNames } from "../../../lib/genreUtils";

import "swiper/css";

export default function GenreTopRatedMovies({ selectedGenre, heroTitle }) {
  const swiperRef = useRef(null);
  const hoverTimer = useRef(null);
  const closeTimer = useRef(null);

  const [movieData, setMovieData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  // z-index를 유지할 카드
  const [hoveredId, setHoveredId] = useState(null);

  // 실제로 보이는 hover 카드
  const [visibleId, setVisibleId] = useState(null);

  const [visibleRange, setVisibleRange] = useState({
    start: 0,
    end: 0,
  });

  // 공통 찜 Hook
  const { isWishlisted, toggleWishlist } = useWishlist();

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
    if (!selectedGenre) return;

    const getGenreTopRatedMovies = async () => {
      try {
        setLoading(true);

        const movieResponse = await getTopRatedMoviesByGenre(selectedGenre.id);

        const movieList = await addGenreNames(movieResponse.results, "movie");

        setMovieData(movieList);

        setTimeout(() => {
          swiperRef.current?.slideTo(0);
          setIsBeginning(true);
          setIsEnd(false);
        }, 0);
      } catch (error) {
        console.log(error);
        setMovieData([]);
      } finally {
        setLoading(false);
      }
    };

    getGenreTopRatedMovies();

    return () => {
      clearTimeout(hoverTimer.current);
      clearTimeout(closeTimer.current);
    };
  }, [selectedGenre]);

  const resetHover = () => {
    clearTimeout(hoverTimer.current);
    clearTimeout(closeTimer.current);

    setVisibleId(null);
    setHoveredId(null);
  };

  const handleWishlist = (event, item) => {
    toggleWishlist(event, item, "movie");
  };

  if (!selectedGenre || loading) {
    return <ContentsSkeleton />;
  }

  return (
    <section className="relative overflow-x-clip bg-black pt-[50px]">
      {/* 제목 */}
      <div className="mb-8 flex items-center justify-between px-5 md:px-10 lg:px-15">
        <h2 className="text-xl font-bold text-white md:text-2xl">
          <span className="text-[#33ddff]">{heroTitle}</span> (와)과 비슷한 평점
          높은 영화
        </h2>
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
          {movieData.map((item, index) => {
            if (!item.poster_path) return null;

            const previewPosition =
              index === visibleRange.start
                ? "left"
                : index === visibleRange.end
                  ? "right"
                  : "center";

            const mediaType = "movie";
            const cardId = `movie-${item.id}`;
            const title = item.title;
            const year = item.release_date?.slice(0, 4);
            const detailPath = `/movie/${item.id}`;

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
                      alt={item.title}
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
                  isWishlisted={itemIsWishlisted}
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
