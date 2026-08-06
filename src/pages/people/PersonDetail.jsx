import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronDown, ChevronLeft, ChevronUp, Star } from "lucide-react";

import { getPeopleCredits, getPeopleDetail } from "../../api/peopleApi";
import { ORIGINAL_URL } from "../../constants/imageUrl";

import PageTitle from "../components/common/PageTitle";
import Loading from "../components/common/Loading";

export default function PersonDetail() {
  const { personId } = useParams();

  const [person, setPerson] = useState(null);

  const [credits, setCredits] = useState({
    cast: [],
    crew: [],
  });

  const [loading, setLoading] = useState(true);

  // 소개글 펼침 상태
  const [showFullBiography, setShowFullBiography] = useState(false);

  // 소개글 더보기 버튼 표시 여부
  const [showBiographyButton, setShowBiographyButton] = useState(false);

  // 영화 전체 목록 펼침 상태
  const [showAllMovies, setShowAllMovies] = useState(false);

  // 시리즈 전체 목록 펼침 상태
  const [showAllTv, setShowAllTv] = useState(false);

  const biographyRef = useRef(null);

  // 인물 상세정보와 출연 작품 요청
  useEffect(() => {
    if (!personId) return;

    const loadPersonDetail = async () => {
      try {
        setLoading(true);

        const [personData, creditData] = await Promise.all([
          getPeopleDetail(personId),
          getPeopleCredits(personId),
        ]);

        setPerson(personData);

        setCredits({
          cast: creditData?.cast || [],
          crew: creditData?.crew || [],
        });
      } catch (error) {
        console.log("인물 상세정보 요청 실패:", error);

        setPerson(null);

        setCredits({
          cast: [],
          crew: [],
        });
      } finally {
        setLoading(false);
      }
    };

    loadPersonDetail();
  }, [personId]);

  // 다른 인물 상세페이지로 이동하면 상태 초기화
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });

    setShowFullBiography(false);
    setShowBiographyButton(false);
    setShowAllMovies(false);
    setShowAllTv(false);
  }, [personId]);

  // 소개글이 4줄을 초과하는지 확인
  useEffect(() => {
    const biographyElement = biographyRef.current;

    if (!biographyElement || showFullBiography) return;

    const checkBiographyOverflow = () => {
      const isOverflowing =
        biographyElement.scrollHeight > biographyElement.clientHeight + 1;

      setShowBiographyButton(isOverflowing);
    };

    const animationFrame = requestAnimationFrame(checkBiographyOverflow);

    const resizeObserver = new ResizeObserver(() => {
      checkBiographyOverflow();
    });

    resizeObserver.observe(biographyElement);

    return () => {
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
    };
  }, [person?.biography, showFullBiography]);

  if (loading) {
    return <Loading />;
  }

  if (!person) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-black px-[20px] text-center text-white md:px-[40px] lg:px-[60px]">
        <h1 className="text-2xl font-bold">인물 정보를 불러오지 못했습니다.</h1>

        <Link to="/" className="mt-6 flex items-center gap-2 text-[#33ddff]">
          <ChevronLeft size={18} />
          홈으로 돌아가기
        </Link>
      </main>
    );
  }

  const departmentMap = {
    Acting: "배우",
    Directing: "감독",
    Writing: "각본",
    Production: "제작",
    Camera: "촬영",
    Editing: "편집",
    Sound: "음향",
    Art: "미술",
    Costume: "의상",
    Crew: "제작진",
    VisualEffects: "시각효과",
  };

  const department =
    departmentMap[person.known_for_department] ||
    person.known_for_department ||
    "정보 없음";

  const genderText =
    person.gender === 1 ? "여성" : person.gender === 2 ? "남성" : null;

  const birthdayText = person.birthday
    ? person.birthday.replaceAll("-", ".")
    : null;

  const deathdayText = person.deathday
    ? person.deathday.replaceAll("-", ".")
    : null;

  const age = getAge(person.birthday, person.deathday);

  const biography = person.biography || "등록된 인물 소개가 없습니다.";

  // 출연 영화 전체 목록
  const movieCredits = getUniqueCredits(
    credits.cast.filter(
      (item) => item.media_type === "movie" && item.poster_path,
    ),
  ).sort(sortCreditsByDate);

  // 출연 시리즈 전체 목록
  const tvCredits = getUniqueCredits(
    credits.cast.filter((item) => item.media_type === "tv" && item.poster_path),
  ).sort(sortCreditsByDate);

  // 기본 6개, 더보기 클릭 시 전체
  const visibleMovieCredits = showAllMovies
    ? movieCredits
    : movieCredits.slice(0, 6);

  const visibleTvCredits = showAllTv ? tvCredits : tvCredits.slice(0, 6);

  return (
    <>
      <PageTitle title={person.name} />

      <main className="min-h-screen bg-black pb-24 text-white">
        {/* 인물 Hero */}
        <section
          className="
            flex
            min-h-[460px]
            w-full
            items-center
            px-[20px]
            pt-[90px]
            pb-6
            md:min-h-[520px]
            md:px-[40px]
            md:pt-[120px]
            md:pb-8
            lg:px-[60px]
          "
        >
          <div className="flex w-full flex-col gap-8 md:flex-row md:items-start lg:gap-12">
            {/* 프로필 이미지 */}
            <div
              className="
                mx-auto
                w-full
                max-w-[180px]
                shrink-0
                md:mx-0
                md:max-w-[210px]
                lg:max-w-[230px]
              "
            >
              <div className="group aspect-[2/3] overflow-hidden rounded-2xl bg-white/10 shadow-2xl">
                {person.profile_path ? (
                  <img
                    src={`${ORIGINAL_URL}${person.profile_path}`}
                    alt={person.name}
                    className="
                      h-full
                      w-full
                      object-cover
                      transition-transform
                      duration-300
                      group-hover:scale-105
                    "
                  />
                ) : (
                  <div className="flex h-full items-center justify-center px-5 text-center text-sm text-white/30">
                    등록된 프로필 이미지가 없습니다.
                  </div>
                )}
              </div>
            </div>

            {/* 인물 정보 */}
            <div className="min-w-0 flex-1">
              <p className="mb-2 text-sm font-semibold text-[#33ddff] md:text-base">
                {department}
              </p>

              <h1 className="text-3xl leading-tight font-bold md:text-4xl lg:text-5xl">
                {person.name}
              </h1>

              {person.also_known_as?.length > 0 && (
                <p className="mt-3 text-sm text-white/50 md:text-base">
                  {person.also_known_as[0]}
                </p>
              )}

              {/* 인물 기본정보 */}
              <div className="mt-7 flex flex-wrap gap-x-10 gap-y-5">
                {birthdayText && (
                  <PersonInfo
                    title="생년월일"
                    value={`${birthdayText}${
                      age !== null ? ` (${age}세)` : ""
                    }`}
                  />
                )}

                {deathdayText && (
                  <PersonInfo title="사망일" value={deathdayText} />
                )}

                {person.place_of_birth && (
                  <PersonInfo title="출생지" value={person.place_of_birth} />
                )}

                {genderText && <PersonInfo title="성별" value={genderText} />}
              </div>

              {/* 인물 소개 */}
              <div className="mt-8">
                <h2 className="mb-4 text-xl font-bold md:text-2xl">소개</h2>

                <p
                  ref={biographyRef}
                  className={`
                    max-w-[820px]
                    whitespace-pre-line
                    text-[15px]
                    leading-7
                    text-white/70
                    md:text-base
                    md:leading-8
                    ${showFullBiography ? "" : "line-clamp-4"}
                  `}
                >
                  {biography}
                </p>

                {person.biography && showBiographyButton && (
                  <button
                    type="button"
                    onClick={() => setShowFullBiography((prev) => !prev)}
                    className="
                      mt-4
                      flex
                      cursor-pointer
                      items-center
                      gap-2
                      text-sm
                      font-semibold
                      text-[#33ddff]
                      transition-colors
                      hover:text-[#66e7ff]
                    "
                  >
                    {showFullBiography ? (
                      <>
                        접기
                        <ChevronUp size={17} />
                      </>
                    ) : (
                      <>
                        더보기
                        <ChevronDown size={17} />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 출연 영화 */}
        <CreditListSection
          title="출연 영화"
          items={visibleMovieCredits}
          totalCount={movieCredits.length}
          mediaType="movie"
          isExpanded={showAllMovies}
          onToggle={() => setShowAllMovies((prev) => !prev)}
          emptyMessage="등록된 출연 영화가 없습니다."
        />

        {/* 출연 시리즈 */}
        <CreditListSection
          title="출연 시리즈"
          items={visibleTvCredits}
          totalCount={tvCredits.length}
          mediaType="tv"
          isExpanded={showAllTv}
          onToggle={() => setShowAllTv((prev) => !prev)}
          emptyMessage="등록된 출연 시리즈가 없습니다."
        />
      </main>
    </>
  );
}

// 인물 기본정보
function PersonInfo({ title, value }) {
  if (!value) return null;

  return (
    <div className="min-w-[120px] max-w-[320px]">
      <p className="mb-1 text-sm text-white/40">{title}</p>

      <p className="text-sm leading-6 text-white/85 md:text-base">{value}</p>
    </div>
  );
}

// 출연 작품 목록 영역
function CreditListSection({
  title,
  items,
  totalCount,
  mediaType,
  isExpanded,
  onToggle,
  emptyMessage,
}) {
  return (
    <section
      className="
        w-full
        px-[20px]
        pt-12
        md:px-[40px]
        md:pt-16
        lg:px-[60px]
      "
    >
      {/* 섹션 제목 */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 className="text-2xl font-bold md:text-3xl">{title}</h2>

        <span className="text-sm text-white/40">총 {totalCount}개</span>
      </div>

      {items.length > 0 ? (
        <>
          {/* 태블릿 / PC 헤더 */}
          <div
            className="
              hidden
              grid-cols-[90px_1fr_120px_120px]
              items-center
              border-b
              border-white/10
              px-4
              pb-4
              text-sm
              font-semibold
              text-white/40
              md:grid
            "
          >
            <span>연도</span>
            <span>제목</span>
            <span>역할</span>
            <span>평점</span>
          </div>

          {/* 작품 목록 */}
          <div className="divide-y divide-white/10">
            {items.map((item) => (
              <CreditListItem
                key={`${mediaType}-${item.id}`}
                item={item}
                mediaType={mediaType}
              />
            ))}
          </div>

          {/* 더보기 버튼 */}
          {totalCount > 6 && (
            <button
              type="button"
              onClick={onToggle}
              className="
                mt-6
                flex
                h-12
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
                font-semibold
                text-white/80
                transition
                hover:border-[#33ddff]
                hover:text-[#33ddff]
              "
            >
              {isExpanded ? (
                <>
                  접기
                  <ChevronUp size={17} />
                </>
              ) : (
                <>
                  더보기
                  <ChevronDown size={17} />
                </>
              )}
            </button>
          )}
        </>
      ) : (
        <div className="rounded-xl border border-white/10 bg-white/5 px-6 py-8 text-white/50">
          {emptyMessage}
        </div>
      )}
    </section>
  );
}

// 출연 작품 한 줄
function CreditListItem({ item, mediaType }) {
  const title = mediaType === "movie" ? item.title : item.name;

  const date = mediaType === "movie" ? item.release_date : item.first_air_date;

  const detailPath =
    mediaType === "movie" ? `/movie/${item.id}` : `/tv/${item.id}`;

  const year = date?.slice(0, 4) || "-";

  const rating =
    typeof item.vote_average === "number" && item.vote_average > 0
      ? item.vote_average.toFixed(1)
      : "-";

  return (
    <Link
      to={detailPath}
      className="
        group
        grid
        grid-cols-[70px_1fr]
        items-center
        gap-4
        py-5
        transition-colors
        hover:bg-white/[0.03]
        md:grid-cols-[90px_1fr_120px_120px]
        md:px-4
      "
    >
      {/* 연도 */}
      <span className="text-sm text-white/50 md:text-base">{year}</span>

      {/* 포스터 + 제목 */}
      <div className="flex min-w-0 items-center gap-4">
        <div className="h-[105px] w-[70px] shrink-0 overflow-hidden rounded-lg bg-white/10 md:h-[120px] md:w-[80px]">
          <img
            src={`${ORIGINAL_URL}${item.poster_path}`}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        <div className="min-w-0">
          <h3 className="line-clamp-2 text-sm font-semibold text-white transition-colors group-hover:text-[#33ddff] md:text-base">
            {title}
          </h3>

          {/* 모바일 정보 */}
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/45 md:hidden">
            <span>{getCreditRole(item.order)}</span>

            {rating !== "-" && (
              <span className="flex items-center gap-1 text-[#33ddff]">
                <Star size={12} fill="currentColor" />
                {rating}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 태블릿 / PC 역할 */}
      <span className="hidden text-sm text-white/55 md:block">
        {getCreditRole(item.order)}
      </span>

      {/* 태블릿 / PC 평점 */}
      <span className="hidden items-center gap-1 text-sm text-white/55 md:flex">
        {rating !== "-" ? (
          <>
            <Star size={14} fill="currentColor" className="text-[#33ddff]" />

            {rating}
          </>
        ) : (
          "-"
        )}
      </span>
    </Link>
  );
}

// 중복 작품 제거
function getUniqueCredits(items) {
  const uniqueMap = new Map();

  items.forEach((item) => {
    if (!uniqueMap.has(item.id)) {
      uniqueMap.set(item.id, item);
    }
  });

  return Array.from(uniqueMap.values());
}

// 최신 공개 작품 우선 정렬
function sortCreditsByDate(a, b) {
  const aDate = a.release_date || a.first_air_date || "";
  const bDate = b.release_date || b.first_air_date || "";

  if (!aDate && !bDate) {
    return (b.popularity || 0) - (a.popularity || 0);
  }

  if (!aDate) return 1;
  if (!bDate) return -1;

  return new Date(bDate) - new Date(aDate);
}

// 출연 순서를 기준으로 비중 표시
function getCreditRole(order) {
  if (typeof order !== "number") {
    return "출연";
  }

  if (order <= 2) {
    return "주연";
  }

  if (order <= 7) {
    return "조연";
  }

  return "출연";
}

// 나이 계산
function getAge(birthday, deathday) {
  if (!birthday) return null;

  const birthDate = new Date(`${birthday}T00:00:00`);

  const comparisonDate = deathday
    ? new Date(`${deathday}T00:00:00`)
    : new Date();

  if (
    Number.isNaN(birthDate.getTime()) ||
    Number.isNaN(comparisonDate.getTime())
  ) {
    return null;
  }

  let age = comparisonDate.getFullYear() - birthDate.getFullYear();

  const monthDifference = comparisonDate.getMonth() - birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && comparisonDate.getDate() < birthDate.getDate())
  ) {
    age -= 1;
  }

  return age;
}
