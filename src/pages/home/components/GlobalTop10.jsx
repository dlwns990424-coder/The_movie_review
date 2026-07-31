import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { W500_URL } from "../../../constants/imageUrl";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";

import "swiper/css";

export default function GlobalTop10({ items }) {
  const swiperRef = useRef(null);

  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const [wishlist, setWishlist] = useState(() => {
    const savedWishlist = localStorage.getItem("wishlist");

    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });

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
    <section className="relative bg-black">
      <h2 className="mx-5 mb-8 pt-[50px] text-3xl font-bold text-white md:mx-[40px] lg:mx-[60px]">
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
              z-[100]
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
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
          }}
          onSlideChange={(swiper) => {
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
          }}
          slidesPerView={2}
          slidesPerGroup={2}
          spaceBetween={0}
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
            const detailPath =
              item.media_type === "movie"
                ? `/movie/${item.id}`
                : `/tv/${item.id}`;

            const title = item.title || item.name;

            const date = (item.release_date || item.first_air_date)?.slice(
              0,
              4,
            );
            const isWishlisted = wishlist.some(
              (savedItem) =>
                savedItem.id === item.id &&
                savedItem.media_type === item.media_type,
            );
            return (
              <SwiperSlide
                key={`${item.media_type}-${item.id}`}
                className="
                  group
                  relative
                  pl-[30px]
                  hover:!z-50
                  xl:pl-[70px]
                "
              >
                <Link to={detailPath} className="block">
                  {/* 기본 카드 */}
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
                        group-hover:scale-105
                        md:w-[170px]
                        xl:w-[220px]
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
                          group-hover:scale-105
                        "
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

                  {/* 기본 카드 제목 */}
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
                      <span>{date}</span>
                      <span>★ {item.vote_average?.toFixed(1)}</span>
                    </div>
                  </div>

                  {/* hover 상세 미리보기 카드 */}
                  <div
                    className="
                      invisible
                      absolute
                      top-1/2
                      left-1/2
                      z-[100]
                      hidden
                      w-[400px]
                      -translate-x-1/2
                      -translate-y-1/2
                      scale-90
                      overflow-hidden
                      rounded-xl
                      bg-[#181818]
                      opacity-0
                      shadow-2xl
                      transition-all
                      duration-300

                      md:block

                      group-hover:visible
                      group-hover:scale-100
                      group-hover:opacity-100
                    "
                  >
                    <div className="aspect-video w-full bg-white/10">
                      <img
                        src={`${W500_URL}${
                          item.backdrop_path || item.poster_path
                        }`}
                        alt={title}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="p-4">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="min-w-0 truncate text-lg font-bold text-white">
                          {title}
                        </h3>

                        <button
                          type="button"
                          onClick={(e) => handleWishlist(e, item)}
                          aria-label={isWishlisted ? "찜 해제" : "찜하기"}
                          className={`
                            flex h-11 w-11 shrink-0 cursor-pointer
                            items-center justify-center rounded-full border transition
                            ${
                              isWishlisted
                                ? "text-[#33ddff] scale-[120%]"
                                : "text-white hover:text-[#33ddff] "
                            }
                          `}
                        >
                          <Heart
                            size={18}
                            strokeWidth={1.8}
                            fill={isWishlisted ? "currentColor" : "none"}
                          />
                        </button>
                      </div>

                      <div className="mt-2 flex items-center gap-3 text-sm text-white/70">
                        <span className="text-[#33ddff]">
                          ★ {item.vote_average?.toFixed(1)}
                        </span>

                        {date && <span>{date}</span>}

                        <span>
                          {item.media_type === "movie" ? "영화" : "시리즈"}
                        </span>
                      </div>

                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/60">
                        {item.overview || "등록된 줄거리 정보가 없습니다."}
                      </p>
                    </div>
                  </div>
                </Link>
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
              z-[100]
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
