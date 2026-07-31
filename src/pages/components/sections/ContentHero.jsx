import { useState } from "react";
import { Link } from "react-router-dom";
import { ORIGINAL_URL } from "../../../constants/imageUrl";

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

  const detailPath =
    mediaType === "movie" ? `/movie/${item.id}` : `/tv/${item.id}`;

  const contentType = mediaType === "movie" ? "영화" : "시리즈";

  const contentGenres = detail.genres
    ?.slice(0, 2)
    .map((genre) => genre.name)
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
      certificationClass = "bg-yellow-500";
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
    onGenreChange(genre);
    setIsGenreOpen(false);
  };

  return (
    <section className="w-full max-w-[1920px] overflow-hidden h-screen pt-[100px] px-[60px] pb-[60px] relative">
      <div
        className="w-full overflow-hidden h-screen absolute top-0 left-0 -z-30 blur-3xl scale-140 brightness-50 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${ORIGINAL_URL}${item.backdrop_path})`,
        }}
      />

      <div className="absolute inset-0 -z-20 bg-gradient-to-t from-black/80 via-black/60 via-60%  to-transparent" />

      <div
        className="w-full h-full rounded-3xl overflow-hidden relative bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${ORIGINAL_URL}${item.backdrop_path})`,
        }}
      >
        {showGenreSelector && (
          <div className="absolute top-[30px] left-[30px] z-30 flex items-center gap-4">
            <h1 className="text-[32px] font-bold text-white">{contentType}</h1>

            <div className="relative">
              <button
                type="button"
                onClick={() => setIsGenreOpen((prev) => !prev)}
                className="min-w-[150px] px-5 py-3 bg-black/40 border border-white/20 backdrop-blur-md text-white rounded-full flex items-center justify-between gap-3 cursor-pointer hover:bg-white/20 transition"
              >
                <span>{selectedGenre?.name || "장르 선택"}</span>
                <span
                  className={`text-[12px] transition-transform ${
                    isGenreOpen ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              </button>

              {isGenreOpen && (
                <div className="w-[360px] absolute top-[55px] left-0 p-4 bg-black/80 border border-white/20 backdrop-blur-xl rounded-2xl shadow-2xl">
                  <div className="grid grid-cols-3 gap-2">
                    {genres.map((genre) => (
                      <button
                        key={genre.id}
                        type="button"
                        onClick={() => handleGenreSelect(genre)}
                        className={`px-3 py-2 rounded-lg text-[14px] cursor-pointer transition ${
                          selectedGenre?.id === genre.id
                            ? "bg-white text-black"
                            : "bg-white/10 text-white hover:bg-white/20"
                        }`}
                      >
                        {genre.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 좌측 텍스트 가독성용 그라데이션 */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-black/70 via-black/10 to-transparent" />

        <div className="w-[50%] h-auto absolute bottom-0 left-0 pb-[50px] px-[50px] flex flex-col gap-5">
          <div className="w-full h-auto ">
            {heroLogo ? (
              <img
                src={`${ORIGINAL_URL}${heroLogo.file_path}`}
                alt={item.title || item.name}
                className="w-[100%]  max-h-[300px] object-contain object-left"
              />
            ) : (
              <h2>{item.title || item.name}</h2>
            )}
          </div>

          <div className="w-full h-[35%] space-y-[20px]">
            <p className="flex items-center gap-3 text-white text-[18px]">
              <span>{contentType}</span>

              {contentGenres && (
                <>
                  <span className="w-[6px] h-[6px] bg-white/50 rounded-2xl" />
                  <span>{contentGenres}</span>
                </>
              )}

              {releaseYear && (
                <>
                  <span className="w-[6px] h-[6px] bg-white/50 rounded-2xl" />
                  <span>{releaseYear}</span>
                </>
              )}

              {runtime && (
                <>
                  <span className="w-[6px] h-[6px] bg-white/50 rounded-2xl" />
                  <span>{runtime}분</span>
                </>
              )}

              {certification && (
                <>
                  <span className="w-[6px] h-[6px] bg-white/50 rounded-2xl" />
                  <span
                    className={`px-2 py-1 rounded-md text-[14px] font-bold text-white ${certificationClass}`}
                  >
                    {certificationText}
                  </span>
                </>
              )}
            </p>

            <p className="text-lg text-white leading-8 line-clamp-3">
              {detail.overview || "등록된 줄거리가 없습니다."}
            </p>
          </div>

          <Link
            to={detailPath}
            className="block w-[120px] px-5 py-3 border-none bg-black/40 border backdrop-blur-md text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-white/20 transition"
          >
            상세 정보
          </Link>
        </div>
      </div>
    </section>
  );
}
