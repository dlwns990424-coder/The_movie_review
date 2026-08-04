import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";

import { getPopularPeople, getPeopleDetail } from "../../../api/peopleApi";
import { ORIGINAL_URL } from "../../../constants/imageUrl";

import "swiper/css";

// 한글이 포함된 이름인지 확인
const hasKorean = (name) => {
  return /[가-힣]/.test(name);
};

// 영어 이름인지 확인
const isEnglishName = (name) => {
  return /^[A-Za-zÀ-ÖØ-öø-ÿ\s.'’-]+$/.test(name);
};

// 한글 → 영어 → 원래 언어 순서로 이름 선택
const getPreferredName = (person, detail) => {
  const candidates = [
    detail?.name,
    ...(detail?.also_known_as ?? []),
    person.name,
    person.original_name,
  ].filter(Boolean);

  const uniqueNames = [...new Set(candidates)];

  const koreanName = uniqueNames.find((name) => hasKorean(name));

  if (koreanName) {
    return koreanName;
  }

  const englishName = uniqueNames.find((name) => isEnglishName(name));

  if (englishName) {
    return englishName;
  }

  return (
    person.original_name || detail?.name || person.name || "이름 정보 없음"
  );
};

export default function PopularPeople() {
  const swiperRef = useRef(null);

  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const updateSwiperState = (swiper) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  useEffect(() => {
    const getPeopleData = async () => {
      try {
        setLoading(true);

        const response = await getPopularPeople();

        const peopleList = response.results.filter(
          (person) => person.profile_path,
        );

        const peopleWithNames = await Promise.all(
          peopleList.map(async (person) => {
            try {
              const detail = await getPeopleDetail(person.id);

              return {
                ...person,
                displayName: getPreferredName(person, detail),
              };
            } catch (error) {
              console.log(error);

              return {
                ...person,
                displayName:
                  person.name || person.original_name || "이름 정보 없음",
              };
            }
          }),
        );

        setPeople(peopleWithNames);
      } catch (error) {
        console.log(error);
        setPeople([]);
      } finally {
        setLoading(false);
      }
    };

    getPeopleData();
  }, []);

  if (loading) return null;

  if (people.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-black pt-[70px]">
      <div className="mb-8 px-5 md:px-10 lg:px-15">
        <h2 className="text-xl font-bold text-white md:text-2xl">인기 인물</h2>
      </div>

      <div className="relative px-5 md:px-10 lg:px-15">
        {!isBeginning && (
          <button
            type="button"
            aria-label="이전 인물 보기"
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
              rounded-br-2xl
              md:flex
            "
          >
            <ChevronLeft size={42} strokeWidth={1.5} />
          </button>
        )}

        <Swiper
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            updateSwiperState(swiper);
          }}
          onSlideChange={updateSwiperState}
          onBreakpoint={updateSwiperState}
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
          {people.map((person) => {
            const detailPath = `/people/${person.id}`;

            return (
              <SwiperSlide key={person.id}>
                <Link to={detailPath} className="group block">
                  <div className="aspect-[2/3] overflow-hidden rounded-xl bg-white/10">
                    <img
                      src={`${ORIGINAL_URL}${person.profile_path}`}
                      alt={person.displayName}
                      className="
                        h-full
                        w-full
                        object-cover
                        transition-transform
                        duration-300
                        group-hover:scale-105
                      "
                    />
                  </div>

                  <div className="mt-3">
                    <h3 className="truncate text-[16px] md:text-[18px] xl:text-[20px] font-semibold text-white">
                      {person.displayName}
                    </h3>
                  </div>
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>

        {!isEnd && (
          <button
            type="button"
            aria-label="다음 인물 보기"
            onClick={() => swiperRef.current?.slideNext()}
            className="
              absolute
              top-0
              bottom-0
              right-0
              z-[50]
              hidden
              w-10
              cursor-pointer
              items-center
              justify-center
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
