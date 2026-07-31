import { Link } from "react-router-dom";
import { ORIGINAL_URL } from "../../constants/imageUrl";
export default function ContentHero({ item, detail, mediaType, heroLogo }) {
  console.log(item);
  console.log(detail);
  console.log(mediaType);
  // 경로 설정(상세정보)
  const detailPath =
    mediaType === "movie" ? `/movie/${item.id}` : `/tv/${item.id}`;
  // 콘텐츠 타입(영화 / 시리즈)
  const contentType = mediaType === "movie" ? "영화" : "시리즈";

  // 장르 최대 2개만 가져와 " · "로 연결
  // 예) 액션 · 모험
  const genres = detail.genres
    ?.slice(0, 2)
    .map((genre) => genre.name)
    .join(" · ");

  // 개봉년도(영화) 또는 첫 방영년도(시리즈)
  // "2025-07-15" → "2025"
  const releaseYear = (detail.release_date || detail.first_air_date)?.slice(
    0,
    4,
  );

  // 러닝타임
  // 영화 : runtime
  // 시리즈 : episode_run_time의 첫 번째 값
  const runtime =
    mediaType === "movie" ? detail.runtime : detail.episode_run_time?.[0];

  // 한국 관람등급 가져오기
  const certification =
    mediaType === "movie"
      ? // 영화인 경우 release_dates에서 KR 찾기
        detail.release_dates?.results
          ?.find((country) => country.iso_3166_1 === "KR")
          ?.release_dates?.find((release) => release.certification)
          ?.certification
      : // 시리즈인 경우 content_ratings에서 KR 찾기
        detail.content_ratings?.results?.find(
          (country) => country.iso_3166_1 === "KR",
        )?.rating;

  // 관람등급 스타일
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
  return (
    <section className="w-full max-w-[1920px] overflow-hidden h-screen pt-[100px] px-[60px] pb-[20px] relative">
      <div
        className="w-full overflow-hidden h-screen absolute top-0 left-0 -z-30 blur-3xl scale-140 brightness-50 bg-cover bg-center bg-no-repeat "
        style={{
          backgroundImage: `url(${ORIGINAL_URL}${item.backdrop_path})`,
        }}
      ></div>

      <div className="absolute inset-0 -z-20 bg-gradient-to-t from-black/80 via-black/60 via-60% to-transparent" />
      <div
        className="w-full h-[100%]  rounded-3xl overflow-hidden relative bg-cover bg-center bg-no-repeat  "
        style={{
          backgroundImage: `url(${ORIGINAL_URL}${item.backdrop_path}) `,
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
            radial-gradient(
              ellipse at center,
              transparent 35%,
              rgba(0,0,0,0.2) 60%,
              rgba(0,0,0,0.5) 85%,
              rgba(0,0,0,0.9) 100%
            )
          `,
          }}
        ></div>
        <div className="w-[50%] h-auto absolute bottom-0 left-0 pb-[50px] px-[50px] flex flex-col gap-5 ">
          <div className="w-full h-auto ">
            {heroLogo ? (
              <img
                src={`${ORIGINAL_URL}${heroLogo.file_path}`}
                alt={item.title || item.name}
                className="h-full object-contain"
              />
            ) : (
              <h2>{item.title || item.name}</h2>
            )}
          </div>
          <div className="w-full h-[35%] space-y-[20px] ">
            <p className="flex items-center gap-3 text-white text-[18px]">
              {/* 영화 / 시리즈 */}
              <span>{contentType}</span>

              {/* 장르 */}
              {genres && (
                <>
                  <span className="w-[6px] h-[6px] bg-white/50 rounded-2xl"></span>
                  <span>{genres}</span>
                </>
              )}

              {/* 개봉년도 */}
              {releaseYear && (
                <>
                  <span className="w-[6px] h-[6px] bg-white/50 rounded-2xl"></span>
                  <span>{releaseYear}</span>
                </>
              )}

              {/* 러닝타임 */}
              {runtime && (
                <>
                  <span className="w-[6px] h-[6px] bg-white/50 rounded-2xl"></span>
                  <span>{runtime}분</span>
                </>
              )}

              {/* 한국 관람등급 */}
              {certification && (
                <>
                  <span className="w-[6px] h-[6px] bg-white/50 rounded-2xl"></span>
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
            className="block w-[120px] py-[14px] bg-white/20 hover:bg-white/80 hover:text-black transition text-white text-center rounded-[50px]"
          >
            상세 정보
          </Link>
        </div>
      </div>
    </section>
  );
}
