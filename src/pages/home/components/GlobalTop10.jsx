import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { W500_URL } from "../../../constants/imageUrl";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";

export default function GlobalTop10({ items }) {
  const swiperRef = useRef(null);

  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  return (
    <section className=" relative bg-black">
      <h2 className="mb-8 pt-20 mx-5 md:mx-[40px] lg:mx-[60px] text-3xl font-bold text-white">
        오늘의 글로벌 TOP 10
      </h2>
      <div className="relative hover:[&>.swiper-btn]:opacity-100 px-5 md:px-[40px] lg:px-[60px]">
        {!isBeginning && (
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className="
            swiper-btn
            lg:flex
            absolute
            left-0   
            top-0
            bottom-0
            z-50
            w-16
            items-center
            justify-center
            text-white
            transition-opacity
            duration-300
          "
          >
            <ChevronLeft size={42} />
          </button>
        )}
        <div className="">
          <Swiper
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

              return (
                <SwiperSlide
                  key={`${item.media_type}-${item.id}`}
                  className="pl-[30px] xl:pl-[70px]"
                >
                  <Link to={detailPath} className="group block">
                    <div className="relative">
                      <div
                        className={` absolute
                      ${index === 9 ? "-left-10 md:-left-16 xl:-left-24" : "-left-6 xl:-left-18"}
                      top-
                      z-0
                      pointer-events-none`}
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
                        xl:text-[160px]
                        font-black
                        leading-none
                        text-transparent
                        [-webkit-text-stroke:3px_#33ddff80]
                        tracking-[-20%]
                      "
                        >
                          {index + 1}
                        </span>
                      </div>

                      <div
                        className="
                    
                      relative
                      z-10
                      aspect-[2/3]
                      w-[120px]
                      shrink-0
                      overflow-hidden
                      rounded-xl
                      md:w-[170px]
                      xl:w-[220px]
                    "
                      >
                        <img
                          src={`${W500_URL}${item.poster_path}`}
                          alt={item.title || item.name}
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
                        absolute
                        inset-x-0
                        bottom-0
                        h-3/7
                        bg-gradient-to-t
                        from-black
                        via-black/70
                        to-transparent
                        pointer-events-none
                      "
                        />
                      </div>
                    </div>
                    <div className="absolute bottom-2 left-4 right-0 z-20">
                      <h3
                        className="
                          text-center
                          text-white
                          text-[14px]
                          md:text-[18px]
                          xl:text-[21px]
                          font-bold
                          drop-shadow
                          line-clamp-2
                        "
                      >
                        {item.title || item.name}
                      </h3>
                    </div>
                  </Link>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
        {!isEnd && (
          <button
            onClick={() => swiperRef.current?.slideNext()}
            className="
            swiper-btn
            lg:flex
            absolute
            right-0
            top-0
            bottom-0
            z-50
            w-16
            items-center
            justify-center
            text-white
            transition-opacity
            duration-300
          "
          >
            <ChevronRight size={42} />
          </button>
        )}
      </div>
    </section>
  );
}
