import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

import { ORIGINAL_URL } from "../../../constants/imageUrl";
import { getTvGenreName } from "../../../api/tvApi";
import { useWishlist } from "../../hook/useWishlist";

export default function ContentHero({
  item,
  detail,
  mediaType,
  heroLogo,
  genres = [],
  selectedGenre,
  onGenreChange,
  showGenreSelector = false,
}) {
  const [isGenreOpen, setIsGenreOpen] = useState(false);

  const { isWishlisted, toggleWishlist } = useWishlist();

  const detailPath =
    mediaType === "movie" ? `/movie/${item.id}` : `/tv/${item.id}`;

  const contentType = mediaType === "movie" ? "영화" : "시리즈";

  const itemIsWishlisted = isWishlisted(item.id, mediaType);

  const contentGenres = detail.genres
    ?.slice(0, 2)
    .map((genre) =>
      mediaType === "tv" ? getTvGenreName(genre.id, genre.name) : genre.name,
    )
    .join(" · ");

  const releaseYear = (detail.release_date || detail.first_air_date)?.slice(
    0,
    4,
  );

  const runtime =
    mediaType === "movie" ? detail.runtime : detail.episode_run_time?.[0];

  const certification =
    mediaType === "movie"
      ? detail.release_dates?.results
          ?.find((country) => country.iso_3166_1 === "KR")
          ?.release_dates?.find((release) => release.certification)
          ?.certification
      : detail.content_ratings?.results?.find(
          (country) => country.iso_3166_1 === "KR",
        )?.rating;

  let certificationText = "";
  let certificationClass = "";

  switch (certification) {
    case "ALL":
      certificationText = "전체";
      certificationClass = "bg-green-500";
      break;

    case "12":
      certificationText = "12";
      certificationClass = "bg-yellow-500 text-black";
      break;

    case "15":
      certificationText = "15";
      certificationClass = "bg-orange-500";
      break;

    case "18":
    case "19":
      certificationText = "19";
      certificationClass = "bg-red-600";
      break;

    default:
      certificationText = certification;
      certificationClass = "bg-gray-500";
  }

  const handleGenreSelect = (genre) => {
    onGenreChange?.(genre);
    setIsGenreOpen(false);
  };

  const handleWishlist = (event) => {
    toggleWishlist(event, item, mediaType);
  };

  return (
    <section
      className="
        relative
        h-[680px]
        w-full
        overflow-hidden
        px-[20px]
        pt-[85px]
        pb-[20px]
        sm:h-[720px]
        md:h-[780px]
        md:px-[40px]
        md:pt-[100px]
        md:pb-[40px]
        lg:h-screen
        lg:min-h-[760px]
        lg:px-[60px]
        lg:pb-[60px]
      "
    >
      {/* 바깥쪽 흐린 배경 */}
      <div
        className="
          absolute
          top-0
          left-0
          -z-30
          h-full
          w-full
          scale-125
          bg-cover
          bg-center
          bg-no-repeat
          brightness-[0.4]
          blur-3xl
          lg:scale-140
        "
        style={{
          backgroundImage: item.backdrop_path
            ? `url(${ORIGINAL_URL}${item.backdrop_path})`
            : "none",
        }}
      />

      {/* 바깥 배경 그라데이션 */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-t from-black via-black/55 to-transparent" />

      {/* 메인 Hero */}
      <div
        className="
          relative
          h-full
          w-full
          overflow-hidden
          rounded-2xl
          bg-cover
          bg-center
          bg-no-repeat
          md:rounded-3xl
        "
        style={{
          backgroundImage: item.backdrop_path
            ? `url(${ORIGINAL_URL}${item.backdrop_path})`
            : "none",
        }}
      >
        {/* 전체 어두운 오버레이 */}
        <div className="pointer-events-none absolute inset-0 bg-black/20" />

        {/* 모바일 하단 가독성 */}
        <div
          className="
            pointer-events-none
            absolute
            inset-0
            bg-gradient-to-t
            from-black
            via-black/50
            to-black/5
            md:from-black/90
            md:via-black/25
            md:to-transparent
          "
        />

        {/* PC 좌측 텍스트 가독성 */}
        <div
          className="
            pointer-events-none
            absolute
            inset-0
            hidden
            bg-gradient-to-r
            from-black/85
            via-black/30
            to-transparent
            md:block
          "
        />

        {/* 장르 선택 */}
        {showGenreSelector && (
          <div
            className="
      absolute
      top-[18px]
      left-[18px]
      z-30
      flex
      items-center
      gap-2
      sm:top-[24px]
      sm:left-[24px]
      sm:gap-3
      md:top-[30px]
      md:left-[30px]
      md:gap-4
    "
          >
            <h1 className="text-xl font-bold text-white sm:text-2xl md:text-[32px]">
              {contentType}
            </h1>

            <div className="relative">
              <button
                type="button"
                onClick={() => setIsGenreOpen((prev) => !prev)}
                aria-expanded={isGenreOpen}
                className={`
                  group
                  flex
                  h-10
                  min-w-[120px]
                  cursor-pointer
                  items-center
                  justify-between
                  gap-2
                  rounded-full
                  border
                  px-4
                  text-xs
                  font-semibold
                  text-white
                  shadow-lg
                  backdrop-blur-xl
                  transition-all
                  duration-300
                  sm:h-11
                  sm:min-w-[140px]
                  sm:text-sm
                  md:h-12
                  md:min-w-[150px]
                  md:px-5
                  ${
                    isGenreOpen
                      ? "border-[#33ddff] bg-[#33ddff]/20 text-[#33ddff]"
                      : "border-white/25 bg-black/65 hover:border-[#33ddff]/70 hover:bg-black/85"
                  }
                `}
              >
                <span className="truncate">
                  {selectedGenre?.name || "장르 선택"}
                </span>

                <span
                  className={`
            shrink-0
            text-[10px]
            transition-transform
            duration-300
            group-hover:scale-125
            ${isGenreOpen ? "rotate-180" : ""}
          `}
                >
                  ▼
                </span>
              </button>

              <div
                className={`
                  absolute
                  top-[48px]
                  left-0
                  w-[280px]
                  rounded-2xl
                  border
                  border-white/20
                  bg-black/90
                  p-3
                  shadow-2xl
                  backdrop-blur-xl
                  transition-opacity
                  duration-300
                  sm:top-[52px]
                  sm:w-[330px]
                  sm:p-4
                  md:top-[57px]
                  md:w-[360px]
                  ${
                    isGenreOpen
                      ? "pointer-events-auto visible opacity-100"
                      : "pointer-events-none invisible opacity-0"
                  }
                `}
              >
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {genres.map((genre, index) => {
                    const genreKey = genre.key ?? `genre-${genre.id}`;

                    const selectedKey =
                      selectedGenre?.key ?? `genre-${selectedGenre?.id}`;

                    const isSelected = selectedKey === genreKey;

                    return (
                      <button
                        key={`${genreKey}-${index}`}
                        type="button"
                        onClick={() => handleGenreSelect(genre)}
                        className={`
                          cursor-pointer
                          rounded-lg
                          px-3
                          py-2
                          text-xs
                          transition-colors
                          duration-300
                          sm:text-sm
                          ${
                            isSelected
                              ? "bg-white font-semibold text-black"
                              : "bg-white/10 text-white hover:bg-[#33ddff] hover:text-black"
                          }
                        `}
                      >
                        {genre.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 콘텐츠 정보 */}
        <div
          className="
            absolute
            bottom-0
            left-0
            z-10
            flex
            w-full
            flex-col
            gap-4
            px-[20px]
            pb-[28px]
            text-white
            sm:px-[28px]
            sm:pb-[36px]
            md:w-[65%]
            md:gap-5
            md:px-[40px]
            md:pb-[45px]
            lg:w-[55%]
            lg:max-w-[900px]
            lg:px-[50px]
            lg:pb-[50px]
          "
        >
          {/* 로고 또는 제목 */}
          <div className="w-full">
            {heroLogo ? (
              <img
                src={`${ORIGINAL_URL}${heroLogo.file_path}`}
                alt={item.title || item.name}
                className="
                  max-h-[105px]
                  w-auto
                  max-w-[80%]
                  object-contain
                  object-left
                  sm:max-h-[135px]
                  md:max-h-[190px]
                  md:max-w-full
                  lg:max-h-[240px]
                "
              />
            ) : (
              <h2
                className="
                  line-clamp-2
                  text-3xl
                  leading-tight
                  font-bold
                  sm:text-4xl
                  md:text-5xl
                  lg:text-6xl
                "
              >
                {item.title || item.name}
              </h2>
            )}
          </div>

          {/* 콘텐츠 부가 정보 */}
          <div
            className="
              flex
              flex-wrap
              items-center
              gap-x-2
              gap-y-2
              text-xs
              font-medium
              text-white/85
              sm:text-sm
              md:gap-x-3
              md:text-base
            "
          >
            <span>{contentType}</span>

            {contentGenres && (
              <>
                <span className="h-1 w-1 rounded-full bg-white/50" />
                <span>{contentGenres}</span>
              </>
            )}

            {releaseYear && (
              <>
                <span className="h-1 w-1 rounded-full bg-white/50" />
                <span>{releaseYear}</span>
              </>
            )}

            {runtime && (
              <>
                <span className="h-1 w-1 rounded-full bg-white/50" />
                <span>
                  {mediaType === "movie" ? `${runtime}분` : `회당 ${runtime}분`}
                </span>
              </>
            )}

            {certification && (
              <>
                <span className="h-1 w-1 rounded-full bg-white/50" />

                <span
                  className={`
                    rounded-md
                    px-2
                    py-1
                    text-[11px]
                    font-bold
                    text-white
                    md:text-xs
                    ${certificationClass}
                  `}
                >
                  {certificationText}
                </span>
              </>
            )}
          </div>

          {/* 줄거리 */}
          <p
            className="
              line-clamp-3
              max-w-[760px]
              text-sm
              leading-6
              text-white/80
              drop-shadow-md
              sm:text-base
              sm:leading-7
              md:text-lg
              md:leading-8
            "
          >
            {detail.overview || "등록된 줄거리가 없습니다."}
          </p>

          {/* 버튼 */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to={detailPath}
              className="
                flex
                h-11
                min-w-[120px]
                items-center
                justify-center
                rounded-full
                bg-white
                px-5
                text-sm
                font-bold
                text-black
                shadow-lg
                transition
                hover:bg-[#33ddff]
                active:scale-[0.98]
                md:h-12
                md:min-w-[135px]
                md:px-6
                md:text-base
              "
            >
              상세 정보
            </Link>

            <button
              type="button"
              onClick={handleWishlist}
              aria-label={itemIsWishlisted ? "찜 해제" : "찜하기"}
              aria-pressed={itemIsWishlisted}
              className={`
                flex
                h-11
                min-w-[120px]
                cursor-pointer
                items-center
                justify-center
                gap-2
                rounded-full
                border
                px-5
                text-sm
                font-bold
                shadow-lg
                backdrop-blur-xl
                transition
                active:scale-[0.98]
                md:h-12
                md:min-w-[135px]
                md:px-6
                md:text-base
                ${
                  itemIsWishlisted
                    ? "border-[#33ddff] bg-[#33ddff] text-black"
                    : "border-white/35 bg-black/65 text-white hover:border-[#33ddff] hover:bg-black/85 hover:text-[#33ddff]"
                }
              `}
            >
              <Heart
                size={18}
                strokeWidth={2}
                fill={itemIsWishlisted ? "currentColor" : "none"}
              />

              {itemIsWishlisted ? "찜 해제" : "찜하기"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
