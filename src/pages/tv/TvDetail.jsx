import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  ExternalLink,
  Heart,
  Play,
  Star,
} from "lucide-react";
import { toast } from "sonner";

import { getTvDetail } from "../../api/tvApi";
import { ORIGINAL_URL } from "../../constants/imageUrl";
import { useAuth } from "../../context/AuthContext";

import PageTitle from "../components/common/PageTitle";
import Loading from "../components/common/Loading";
import ReviewSection from "../components/common/ReviewSection";

export default function TvDetail() {
  const { tvId } = useParams();
  const navigate = useNavigate();

  const { currentUser, isLoggedIn } = useAuth();

  const [tv, setTv] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [showAllMobileCast, setShowAllMobileCast] = useState(false);
  const [showAllSeasons, setShowAllSeasons] = useState(false);

  const [isWishlisted, setIsWishlisted] = useState(false);

  // 로그인한 사용자별 찜 목록 localStorage key
  const wishlistKey = currentUser?.id ? `wishlist-${currentUser.id}` : null;

  // 시리즈 상세정보 요청
  useEffect(() => {
    if (!tvId) return;

    const loadTvDetail = async () => {
      try {
        setLoading(true);

        const tvData = await getTvDetail(tvId);

        setTv(tvData);
      } catch (error) {
        console.log("시리즈 상세정보 요청 실패:", error);
        setTv(null);
      } finally {
        setLoading(false);
      }
    };

    loadTvDetail();
  }, [tvId]);

  // 상세페이지가 변경되면 화면 맨 위로 이동
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });

    setShowAllMobileCast(false);
    setShowAllSeasons(false);
    setIsTrailerOpen(false);
  }, [tvId]);

  // 현재 시리즈가 찜 목록에 있는지 확인
  useEffect(() => {
    if (!wishlistKey || !tv) {
      setIsWishlisted(false);
      return;
    }

    try {
      const savedWishlist = JSON.parse(
        localStorage.getItem(wishlistKey) || "[]",
      );

      const alreadySaved = savedWishlist.some(
        (item) => item.id === tv.id && item.media_type === "tv",
      );

      setIsWishlisted(alreadySaved);
    } catch (error) {
      console.log("찜 목록 불러오기 실패:", error);
      setIsWishlisted(false);
    }
  }, [wishlistKey, tv]);

  // 찜 추가 및 해제
  const handleWishlist = () => {
    if (!isLoggedIn || !currentUser) {
      toast.warning("로그인이 필요한 기능입니다.");
      navigate("/login");
      return;
    }

    if (!tv || !wishlistKey) return;

    try {
      const savedWishlist = JSON.parse(
        localStorage.getItem(wishlistKey) || "[]",
      );

      const alreadySaved = savedWishlist.some(
        (item) => item.id === tv.id && item.media_type === "tv",
      );

      let nextWishlist;

      if (alreadySaved) {
        nextWishlist = savedWishlist.filter(
          (item) => !(item.id === tv.id && item.media_type === "tv"),
        );

        setIsWishlisted(false);
        toast("찜 목록에서 제거되었습니다.");
      } else {
        const wishlistItem = {
          id: tv.id,
          media_type: "tv",
          name: tv.name,
          original_name: tv.original_name,
          overview: tv.overview,
          poster_path: tv.poster_path,
          backdrop_path: tv.backdrop_path,
          vote_average: tv.vote_average,
          first_air_date: tv.first_air_date,
          genre_ids: tv.genres?.map((genre) => genre.id) || [],
          addedAt: new Date().toISOString(),
        };

        nextWishlist = [...savedWishlist, wishlistItem];

        setIsWishlisted(true);
        toast.success("찜 목록에 추가되었습니다.");
      }

      localStorage.setItem(wishlistKey, JSON.stringify(nextWishlist));
    } catch (error) {
      console.log("찜 목록 저장 실패:", error);
      toast.error("찜 목록을 변경하지 못했습니다.");
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!tv) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-black px-5 text-white">
        <h1 className="text-2xl font-bold">
          시리즈 정보를 불러오지 못했습니다.
        </h1>

        <Link to="/tv" className="mt-6 flex items-center gap-2 text-[#33ddff]">
          <ChevronLeft size={18} />
          시리즈 페이지로 돌아가기
        </Link>
      </main>
    );
  }

  const releaseYear = tv.first_air_date?.slice(0, 4);

  const genres = tv.genres?.map((genre) => genre.name).join(" · ") || "";

  const episodeRuntime =
    tv.episode_run_time?.find((runtime) => runtime > 0) || null;

  const runtimeText = episodeRuntime ? `회당 ${episodeRuntime}분` : null;

  const koreanCertification = tv.content_ratings?.results?.find(
    (country) => country.iso_3166_1 === "KR",
  )?.rating;

  const certificationText = koreanCertification
    ? koreanCertification === "ALL"
      ? "전체 관람가"
      : `${koreanCertification}세 이상`
    : null;

  const creators = tv.created_by || [];

  // 최대 12명
  const cast = tv.credits?.cast?.slice(0, 12) || [];

  // 모바일에서는 처음에 3명만 표시
  const mobileCast = showAllMobileCast ? cast : cast.slice(0, 3);

  const trailer =
    tv.videos?.results?.find(
      (video) =>
        video.site === "YouTube" &&
        video.type === "Trailer" &&
        video.iso_639_1 === "ko",
    ) ||
    tv.videos?.results?.find(
      (video) => video.site === "YouTube" && video.type === "Trailer",
    ) ||
    tv.videos?.results?.find((video) => video.site === "YouTube");

  const koreanProvider = tv["watch/providers"]?.results?.KR;

  const streamingProviders = koreanProvider?.flatrate || [];

  const rentProviders = koreanProvider?.rent || [];

  const buyProviders = koreanProvider?.buy || [];

  // 스페셜 시즌 제외
  const seasons =
    tv.seasons?.filter((season) => season.season_number > 0) || [];

  const visibleSeasons = showAllSeasons ? seasons : seasons.slice(0, 4);

  const recommendations =
    tv.recommendations?.results
      ?.filter((item) => item.poster_path)
      .slice(0, 12) || [];

  return (
    <>
      <PageTitle title={tv.name} />

      <main className="min-h-screen bg-black pb-24 text-white">
        {/* 상세 Hero */}
        <section className="relative min-h-[760px] w-full overflow-hidden">
          {/* 배경 이미지 */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: tv.backdrop_path
                ? `url(${ORIGINAL_URL}${tv.backdrop_path})`
                : "none",
            }}
          />

          {/* 배경 그라데이션 */}
          <div className="absolute inset-0 bg-black/10" />

          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-black/10" />

          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />

          {/* 상세 내용 */}
          <div className="relative z-10 flex min-h-[760px] w-full items-end px-[20px] pt-[120px] pb-16 md:px-[40px] lg:px-[60px]">
            {" "}
            <div className="flex w-full flex-col gap-8 md:flex-row md:items-end">
              {/* 포스터 */}
              <div className="hidden w-[240px] shrink-0 overflow-hidden rounded-xl bg-white/10 shadow-2xl md:block lg:w-[280px]">
                {tv.poster_path ? (
                  <img
                    src={`${ORIGINAL_URL}${tv.poster_path}`}
                    alt={tv.name}
                    className="aspect-[2/3] h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex aspect-[2/3] items-center justify-center text-white/40">
                    이미지 없음
                  </div>
                )}
              </div>

              {/* 시리즈 정보 */}
              <div className="max-w-[850px]">
                {tv.tagline && (
                  <p className="mb-3 text-sm font-medium text-[#33ddff] md:text-base">
                    {tv.tagline}
                  </p>
                )}

                <h1 className="text-4xl leading-tight font-bold md:text-5xl lg:text-6xl">
                  {tv.name}
                </h1>

                {tv.original_name && tv.original_name !== tv.name && (
                  <p className="mt-3 text-base text-white/50">
                    {tv.original_name}
                  </p>
                )}

                {/* 기본 정보 */}
                <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-white/75 md:text-base">
                  <span className="flex items-center gap-1 font-semibold text-[#33ddff]">
                    <Star size={17} fill="currentColor" />
                    {tv.vote_average?.toFixed(1)}
                  </span>

                  {releaseYear && <span>{releaseYear}</span>}

                  {runtimeText && <span>{runtimeText}</span>}

                  {tv.number_of_seasons > 0 && (
                    <span>시즌 {tv.number_of_seasons}개</span>
                  )}

                  {tv.number_of_episodes > 0 && (
                    <span>총 {tv.number_of_episodes}화</span>
                  )}

                  {certificationText && (
                    <span className="rounded border border-white/30 px-2 py-0.5 text-sm">
                      {certificationText}
                    </span>
                  )}
                </div>

                {genres && (
                  <p className="mt-4 text-sm text-white/65 md:text-base">
                    {genres}
                  </p>
                )}

                <p className="mt-6 line-clamp-5 max-w-[800px] text-base leading-7 text-white/75 md:text-lg md:leading-8">
                  {tv.overview || "등록된 줄거리 정보가 없습니다."}
                </p>

                {creators.length > 0 && (
                  <p className="mt-5 text-sm text-white/60">
                    <span className="mr-2 text-white/90">제작</span>

                    {creators.map((creator) => creator.name).join(" · ")}
                  </p>
                )}

                {/* 버튼 */}
                <div className="mt-8 flex flex-wrap gap-3">
                  {trailer && (
                    <button
                      type="button"
                      onClick={() => setIsTrailerOpen(true)}
                      className="flex h-12 cursor-pointer items-center gap-2 rounded-full bg-white px-6 font-semibold text-black transition hover:bg-[#33ddff]"
                    >
                      <Play size={19} fill="currentColor" />
                      예고편 보기
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleWishlist}
                    aria-pressed={isWishlisted}
                    className={`
                      flex
                      h-12
                      cursor-pointer
                      items-center
                      gap-2
                      rounded-full
                      border
                      px-6
                      backdrop-blur-md
                      transition
                      ${
                        isWishlisted
                          ? "border-[#33ddff] bg-[#33ddff]/15 text-[#33ddff]"
                          : "border-white/25 bg-black/30 text-white hover:border-[#33ddff] hover:text-[#33ddff]"
                      }
                    `}
                  >
                    <Heart
                      size={19}
                      fill={isWishlisted ? "currentColor" : "none"}
                    />

                    {isWishlisted ? "찜 해제" : "찜하기"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 출연진 */}
        <section className="w-full px-[20px] pt-16 md:px-[40px] lg:px-[60px]">
          <h2 className="mb-7 text-2xl font-bold md:text-3xl">주요 출연진</h2>

          {cast.length > 0 ? (
            <>
              {/* 모바일 */}
              <div className="md:hidden">
                <div className="grid grid-cols-3 gap-4">
                  {mobileCast.map((person) => (
                    <CastCard key={person.credit_id} person={person} />
                  ))}
                </div>

                {cast.length > 3 && (
                  <button
                    type="button"
                    onClick={() => setShowAllMobileCast((prev) => !prev)}
                    className="
                      mt-7
                      flex
                      h-11
                      w-full
                      cursor-pointer
                      items-center
                      justify-center
                      gap-2
                      rounded-lg
                      border
                      border-white/15
                      bg-white/5
                      text-sm
                      text-white/80
                      transition
                      hover:border-[#33ddff]
                      hover:text-[#33ddff]
                    "
                  >
                    {showAllMobileCast ? (
                      <>
                        접기
                        <ChevronUp size={17} />
                      </>
                    ) : (
                      <>
                        출연진 더보기
                        <ChevronDown size={17} />
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* 태블릿 및 PC */}
              <div className="hidden grid-cols-4 gap-4 md:grid lg:grid-cols-8 xl:grid-cols-10">
                {cast.map((person) => (
                  <CastCard key={person.credit_id} person={person} />
                ))}
              </div>
            </>
          ) : (
            <p className="text-white/50">등록된 출연진 정보가 없습니다.</p>
          )}
        </section>

        {/* OTT */}
        <section className="w-full px-[20px] pt-20 md:px-[40px] lg:px-[60px]">
          {" "}
          <div className="mb-7 flex items-center justify-between gap-4">
            <h2 className="text-2xl font-bold md:text-3xl">시청 가능한 OTT</h2>
          </div>
          {streamingProviders.length > 0 ||
          rentProviders.length > 0 ||
          buyProviders.length > 0 ? (
            <div className="space-y-8">
              <ProviderList title="스트리밍" providers={streamingProviders} />

              <ProviderList title="대여" providers={rentProviders} />

              <ProviderList title="구매" providers={buyProviders} />
            </div>
          ) : (
            <div className="rounded-xl border border-white/10 bg-white/5 px-6 py-8 text-white/50">
              현재 확인 가능한 국내 OTT 정보가 없습니다.
            </div>
          )}
        </section>

        {/* 시즌 목록 */}
        <section className="w-full px-[20px] pt-20 md:px-[40px] lg:px-[60px]">
          <h2 className="mb-7 text-2xl font-bold md:text-3xl">시즌 목록</h2>

          {seasons.length > 0 ? (
            <>
              <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
                {visibleSeasons.map((season) => (
                  <SeasonCard key={season.id} season={season} />
                ))}
              </div>

              {seasons.length > 4 && (
                <button
                  type="button"
                  onClick={() => setShowAllSeasons((prev) => !prev)}
                  className="
                    mt-8
                    flex
                    h-11
                    w-full
                    cursor-pointer
                    items-center
                    justify-center
                    gap-2
                    rounded-lg
                    border
                    border-white/15
                    bg-white/5
                    text-sm
                    text-white/80
                    transition
                    hover:border-[#33ddff]
                    hover:text-[#33ddff]
                  "
                >
                  {showAllSeasons ? (
                    <>
                      시즌 접기
                      <ChevronUp size={17} />
                    </>
                  ) : (
                    <>
                      시즌 더보기
                      <ChevronDown size={17} />
                    </>
                  )}
                </button>
              )}
            </>
          ) : (
            <p className="text-white/50">등록된 시즌 정보가 없습니다.</p>
          )}
        </section>

        {/* 추천 시리즈 */}
        <section className="w-full px-[20px] pt-20 md:px-[40px] lg:px-[60px]">
          <h2 className="mb-7 text-2xl font-bold md:text-3xl">추천 시리즈</h2>

          {recommendations.length > 0 ? (
            <div className="grid grid-cols-3 gap-x-4 gap-y-8 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8">
              {recommendations.map((item) => (
                <Link
                  key={item.id}
                  to={`/tv/${item.id}`}
                  className="group min-w-0"
                >
                  <div className="aspect-[2/3] overflow-hidden rounded-lg bg-white/10">
                    <img
                      src={`${ORIGINAL_URL}${item.poster_path}`}
                      alt={item.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  <h3 className="mt-3 truncate text-sm font-semibold transition-colors group-hover:text-[#33ddff]">
                    {item.name}
                  </h3>

                  <div className="mt-1 flex items-center gap-2 text-xs text-white/50">
                    <span>★ {item.vote_average?.toFixed(1)}</span>

                    {item.first_air_date && (
                      <span>{item.first_air_date.slice(0, 4)}</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-white/50">등록된 추천 시리즈가 없습니다.</p>
          )}
        </section>

        {/* 리뷰 */}
        <ReviewSection
          mediaType="tv"
          contentId={tv.id}
          contentTitle={tv.name}
          posterPath={tv.poster_path}
        />
      </main>

      {/* 예고편 모달 */}
      {isTrailerOpen && trailer && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/85 px-5 backdrop-blur-sm"
          onClick={() => setIsTrailerOpen(false)}
        >
          <div
            className="w-full max-w-[1000px]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex justify-end">
              <button
                type="button"
                onClick={() => setIsTrailerOpen(false)}
                className="cursor-pointer text-sm text-white/70 transition hover:text-white"
              >
                닫기
              </button>
            </div>

            <div className="aspect-video w-full overflow-hidden rounded-xl bg-black shadow-2xl">
              <iframe
                src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
                title={`${tv.name} 예고편`}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// TMDB 출연진 순서를 기준으로 표시
const getCastRole = (order) => {
  if (order <= 2) return "주연";
  if (order <= 7) return "조연";

  return "출연";
};

// 출연진 카드
function CastCard({ person }) {
  return (
    <Link to={`/people/${person.id}`} className="group min-w-0">
      <div className="aspect-[2/3] overflow-hidden rounded-lg bg-white/10">
        {person.profile_path ? (
          <img
            src={`${ORIGINAL_URL}${person.profile_path}`}
            alt={person.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center px-2 text-center text-xs text-white/30">
            이미지 없음
          </div>
        )}
      </div>

      <h3 className="mt-3 truncate text-sm font-semibold text-white transition-colors group-hover:text-[#33ddff]">
        {person.name}
      </h3>

      <p className="mt-1 text-xs text-white/45">{getCastRole(person.order)}</p>
    </Link>
  );
}

// 시즌 카드
function SeasonCard({ season }) {
  const airYear = season.air_date?.slice(0, 4);

  return (
    <div className="min-w-0">
      <div className="aspect-[2/3] overflow-hidden rounded-lg bg-white/10">
        {season.poster_path ? (
          <img
            src={`${ORIGINAL_URL}${season.poster_path}`}
            alt={season.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center px-2 text-center text-xs text-white/30">
            이미지 없음
          </div>
        )}
      </div>

      <h3 className="mt-3 truncate text-sm font-semibold text-white">
        {season.name}
      </h3>

      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-white/45">
        {airYear && <span>{airYear}</span>}

        {season.episode_count > 0 && <span>{season.episode_count}화</span>}
      </div>
    </div>
  );
}

// OTT 제공 서비스
function ProviderList({ title, providers }) {
  if (!providers || providers.length === 0) return null;

  return (
    <div>
      <h3 className="mb-4 text-base font-semibold text-white/70">{title}</h3>

      <div className="flex flex-wrap gap-4">
        {providers.map((provider) => (
          <div
            key={`${title}-${provider.provider_id}`}
            className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3"
          >
            <img
              src={`${ORIGINAL_URL}${provider.logo_path}`}
              alt={provider.provider_name}
              className="h-11 w-11 rounded-lg object-cover"
            />

            <span className="max-w-[150px] truncate text-sm text-white/80">
              {provider.provider_name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
