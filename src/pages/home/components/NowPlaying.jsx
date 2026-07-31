import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { getNowPlayingMovies } from "../../../api/movieApi";
import { getOnTheAirTv } from "../../../api/tvApi";
import { ORIGINAL_URL } from "../../../constants/imageUrl";
export default function NowPlaying() {
  const swiperRef = useRef(null);

  const [activeTab, setActiveTab] = useState("movie");
  const [movieData, setMovieData] = useState([]);
  const [tvData, setTvData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  useEffect(() => {
    const getNowPlayingData = async () => {
      try {
        setLoading(true);

        const [movieResponse, tvResponse] = await Promise.all([
          getNowPlayingMovies(),
          getOnTheAirTv(),
        ]);

        setMovieData(movieResponse.results);
        setTvData(tvResponse.results);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getNowPlayingData();
  }, []);

  const currentData = activeTab === "movie" ? movieData : tvData;

  const handleTab = (tab) => {
    setActiveTab(tab);

    setTimeout(() => {
      swiperRef.current?.slideTo(0);
      setIsBeginning(true);
      setIsEnd(false);
    }, 0);
  };

  if (loading) return null;

  return (
    <section className="pt-[50px] md:pt-[50px] lg:pt-[50px] bg-black">
      <div className="mb-8 flex items-center justify-between px-5 md:px-10 lg:px-15">
        <h2 className="text-2xl font-bold text-white md:text-3xl">
          현재 상영 / 방영
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

      <div className="relative">
        {!isBeginning && (
          <button
            type="button"
            onClick={() => swiperRef.current?.slidePrev()}
            className="absolute top-0 bottom-0 left-0 z-20 hidden cursor-pointer items-center px-2 text-white lg:flex"
          >
            <ChevronLeft size={42} strokeWidth={1.5} />
          </button>
        )}

        <div className="px-5 md:px-10 lg:px-15">
          <Swiper
            key={activeTab}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
              setIsBeginning(swiper.isBeginning);
              setIsEnd(swiper.isEnd);
            }}
            onSlideChange={(swiper) => {
              setIsBeginning(swiper.isBeginning);
              setIsEnd(swiper.isEnd);
            }}
            spaceBetween={12}
            slidesPerGroup={2}
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
            {currentData.map((item) => {
              const title = activeTab === "movie" ? item.title : item.name;

              const date =
                activeTab === "movie" ? item.release_date : item.first_air_date;

              const detailPath =
                activeTab === "movie" ? `/movie/${item.id}` : `/tv/${item.id}`;

              if (!item.backdrop_path) return null;

              return (
                <SwiperSlide key={item.id}>
                  <Link to={detailPath} className="group block">
                    <div className="aspect-video overflow-hidden rounded-lg bg-white/10">
                      <img
                        src={`${ORIGINAL_URL}${item.backdrop_path}`}
                        alt={title}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    </div>

                    <div className="mt-3">
                      <h3 className="truncate text-base font-semibold text-white">
                        {title}
                      </h3>

                      <div className="mt-1 flex items-center gap-2 text-sm text-white/60">
                        <span>★ {item.vote_average?.toFixed(1)}</span>

                        {date && <span>{date.slice(0, 4)}</span>}
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>

        {!isEnd && (
          <button
            type="button"
            onClick={() => swiperRef.current?.slideNext()}
            className="absolute top-0 bottom-0 right-0 z-50 w-10 items-center justify-center text-white hidden md:flex"
          >
            <ChevronRight size={42} strokeWidth={1.5} />
          </button>
        )}
      </div>
    </section>
  );
}
