import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { ORIGINAL_URL } from "../../../constants/imageUrl";
import { getContentDetail } from "../../../api/contentApi";

const detailCache = new Map();

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

export default function HoverPreviewCard({
  item,
  mediaType,
  detailPath,
  isVisible,
  isWishlisted,
  handleWishlist,
  position = "center",
  infoType = "rating",
}) {
  const [detail, setDetail] = useState(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  const title = mediaType === "movie" ? item.title : item.name;

  const date = mediaType === "movie" ? item.release_date : item.first_air_date;

  const year = date?.slice(0, 4);
  const dDay = getDDay(date);

  const genreNames =
    detail?.genres?.map((genre) => genre.name).slice(0, 3) || [];

  const positionClass = {
    left: "left-0 translate-x-0",
    center: "left-1/2 -translate-x-1/2",
    right: "right-0 left-auto translate-x-0",
  }[position];

  useEffect(() => {
    if (!isVisible) return;

    const cacheKey = `${mediaType}-${item.id}`;

    const loadDetail = async () => {
      try {
        setIsDetailLoading(true);

        if (detailCache.has(cacheKey)) {
          setDetail(detailCache.get(cacheKey));
          return;
        }

        const detailData = await getContentDetail(mediaType, item.id);

        detailCache.set(cacheKey, detailData);
        setDetail(detailData);
      } catch (error) {
        console.log("Hover 상세정보 요청 실패:", error);
      } finally {
        setIsDetailLoading(false);
      }
    };

    loadDetail();
  }, [isVisible, mediaType, item.id]);

  const canShowHover = isVisible && !isDetailLoading && detail;

  return (
    <div
      className={`
        absolute
        top-1/2
        z-[900]
        hidden
        w-[400px]
        -translate-y-1/2
        overflow-hidden
        rounded-xl
        bg-[#181818]
        shadow-2xl
        transition-all
        duration-300
        md:block
        ${positionClass}
        ${
          canShowHover
            ? "visible scale-100 opacity-100"
            : "pointer-events-none invisible scale-90 opacity-0"
        }
      `}
    >
      <Link to={detailPath} className="block">
        <div className="relative aspect-video w-full overflow-hidden bg-black">
          <img
            src={`${ORIGINAL_URL}${item.backdrop_path || item.poster_path}`}
            alt={title}
            className="h-full w-full object-cover"
          />
        </div>
      </Link>

      <div className="p-4">
        <div className="flex items-center justify-between gap-3">
          <Link to={detailPath} className="min-w-0 flex-1">
            <h3 className="truncate text-lg font-bold text-white hover:text-[#33ddff]">
              {title}
            </h3>
          </Link>

          <button
            type="button"
            onClick={(e) => handleWishlist(e, item)}
            aria-label={isWishlisted ? "찜 해제" : "찜하기"}
            className={`
              flex
              h-11
              w-11
              shrink-0
              cursor-pointer
              items-center
              justify-center
              rounded-full
              border
              transition
              ${
                isWishlisted
                  ? "scale-[120%] text-[#33ddff]"
                  : "text-white hover:text-[#33ddff]"
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

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/70">
          {infoType === "release" ? (
            <>
              {dDay && (
                <span className="font-semibold text-[#33ddff]">{dDay}</span>
              )}

              <span>{mediaType === "movie" ? "영화" : "시리즈"}</span>

              {date && <span>{date.replaceAll("-", ".")}</span>}
            </>
          ) : (
            <>
              <span className="text-[#33ddff]">
                ★ {item.vote_average?.toFixed(1)}
              </span>

              <span>{mediaType === "movie" ? "영화" : "시리즈"}</span>

              {year && <span>{year}</span>}
            </>
          )}

          {genreNames.length > 0 && <span>{genreNames.join(" · ")}</span>}
        </div>

        <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/60">
          {item.overview || "등록된 줄거리 정보가 없습니다."}
        </p>

        <Link
          to={detailPath}
          className="
            mt-5
            flex
            h-11
            w-full
            items-center
            justify-center
            rounded-lg
            bg-white
            text-sm
            font-semibold
            text-black
            transition-all
            duration-200
            hover:bg-[#5be5ff]
            active:scale-[0.98]
          "
        >
          상세 보기
        </Link>
      </div>
    </div>
  );
}
