import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { W500_URL } from "../../constants/imageUrl";

export default function HoverPreviewCard({
  item,
  mediaType,
  detailPath,
  isVisible,
  isWishlisted,
  handleWishlist,
  position = "center",
}) {
  const title = mediaType === "movie" ? item.title : item.name;

  const date = mediaType === "movie" ? item.release_date : item.first_air_date;

  const year = date?.slice(0, 4);

  const positionClass = {
    left: "left-0 translate-x-0",
    center: "left-1/2 -translate-x-1/2",
    right: "right-0 left-auto translate-x-0",
  }[position];

  return (
    <div
      className={`
        absolute
        top-1/2
        z-[200]
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
          isVisible
            ? "visible scale-100 opacity-100"
            : "pointer-events-none invisible scale-90 opacity-0"
        }
      `}
    >
      <Link to={detailPath} className="block">
        <div className="aspect-video w-full bg-white/10">
          <img
            src={`${W500_URL}${item.backdrop_path || item.poster_path}`}
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
              flex h-11 w-11 shrink-0 cursor-pointer
              items-center justify-center rounded-full border transition
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

        <div className="mt-2 flex items-center gap-3 text-sm text-white/70">
          <span className="text-[#33ddff]">
            ★ {item.vote_average?.toFixed(1)}
          </span>

          {year && <span>{year}</span>}

          <span>{mediaType === "movie" ? "영화" : "시리즈"}</span>
        </div>

        <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/60">
          {item.overview || "등록된 줄거리 정보가 없습니다."}
        </p>
      </div>
    </div>
  );
}
