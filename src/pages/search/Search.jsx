import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Search as SearchIcon, Star, UserRound, X } from "lucide-react";

import { getMultiSearch } from "../../api/searchApi";
import { W500_URL } from "../../constants/imageUrl";
import { useAuth } from "../../context/AuthContext";

import PageTitle from "../components/common/PageTitle";
import Loading from "../components/common/Loading";

const SEARCH_FILTERS = [
  {
    key: "all",
    name: "전체",
  },
  {
    key: "movie",
    name: "영화",
  },
  {
    key: "tv",
    name: "시리즈",
  },
  {
    key: "person",
    name: "인물",
  },
];

const MAX_RECENT_SEARCHES = 8;

export default function Search() {
  const navigate = useNavigate();

  const { currentUser, isLoggedIn } = useAuth();

  const inputRef = useRef(null);
  const searchAreaRef = useRef(null);

  const [searchParams] = useSearchParams();

  // 주소에 저장된 검색어
  const queryFromUrl = searchParams.get("query") || "";

  // 입력창에 표시되는 검색어
  const [keyword, setKeyword] = useState(queryFromUrl);

  // 실제 전체 검색에 사용된 검색어
  const [searchedKeyword, setSearchedKeyword] = useState(queryFromUrl);

  // 전체 검색 결과
  const [results, setResults] = useState([]);

  // 입력 중 미리보기 결과
  const [previewResults, setPreviewResults] = useState([]);

  // 로그인 사용자별 최근 검색어
  const [recentSearches, setRecentSearches] = useState([]);

  // 현재 선택된 필터
  const [selectedFilter, setSelectedFilter] = useState("all");

  // 현재 검색 결과 페이지
  const [page, setPage] = useState(1);

  // 마지막 검색 결과 페이지
  const [totalPages, setTotalPages] = useState(0);

  // 전체 검색 로딩
  const [loading, setLoading] = useState(false);

  // 추가 결과 로딩
  const [moreLoading, setMoreLoading] = useState(false);

  // 미리보기 로딩
  const [previewLoading, setPreviewLoading] = useState(false);

  // 검색창 포커스 상태
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const trimmedKeyword = keyword.trim();

  // 사용자마다 다른 최근 검색어 저장 키 사용
  const recentSearchKey =
    isLoggedIn && (currentUser?.id || currentUser?.username)
      ? `recent-searches-${currentUser.id || currentUser.username}`
      : null;

  // 검색창 자동 포커스
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // 로그인 사용자별 최근 검색어 불러오기
  useEffect(() => {
    if (!recentSearchKey) {
      setRecentSearches([]);
      return;
    }

    try {
      const savedRecentSearches = JSON.parse(
        localStorage.getItem(recentSearchKey) || "[]",
      );

      if (Array.isArray(savedRecentSearches)) {
        setRecentSearches(savedRecentSearches);
      } else {
        setRecentSearches([]);
      }
    } catch (error) {
      console.log("최근 검색어 불러오기 실패:", error);
      setRecentSearches([]);
    }
  }, [recentSearchKey]);

  // URL 검색어가 있으면 전체 검색
  useEffect(() => {
    if (!queryFromUrl.trim()) {
      setResults([]);
      setSearchedKeyword("");
      setSelectedFilter("all");
      setPage(1);
      setTotalPages(0);
      return;
    }

    setKeyword(queryFromUrl);
    setSearchedKeyword(queryFromUrl);
    setSelectedFilter("all");
    setPreviewResults([]);
    setIsSearchFocused(false);

    const loadInitialSearch = async () => {
      try {
        setLoading(true);

        const searchData = await getMultiSearch(queryFromUrl, 1);

        setResults(filterSupportedResults(searchData.results));
        setPage(searchData.page || 1);
        setTotalPages(searchData.total_pages || 0);
      } catch (error) {
        console.log("검색 결과 요청 실패:", error);

        setResults([]);
        setPage(1);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    };

    loadInitialSearch();
  }, [queryFromUrl]);

  // 입력 중 300ms 뒤 미리보기 검색
  useEffect(() => {
    // 검색어가 없거나 이미 전체 검색한 검색어와 같으면 미리보기 숨김
    if (!trimmedKeyword || trimmedKeyword === searchedKeyword) {
      setPreviewResults([]);
      setPreviewLoading(false);
      return;
    }

    let isCancelled = false;

    const debounceTimer = setTimeout(async () => {
      try {
        setPreviewLoading(true);

        const searchData = await getMultiSearch(trimmedKeyword, 1);

        if (isCancelled) return;

        const supportedResults = filterSupportedResults(searchData.results);

        // 영화 2개
        const movieResults = supportedResults
          .filter((item) => item.media_type === "movie")
          .slice(0, 2);

        // 시리즈 2개
        const tvResults = supportedResults
          .filter((item) => item.media_type === "tv")
          .slice(0, 2);

        // 인물 2개
        const personResults = supportedResults
          .filter((item) => item.media_type === "person")
          .slice(0, 2);

        setPreviewResults([...movieResults, ...tvResults, ...personResults]);
      } catch (error) {
        console.log("검색 미리보기 요청 실패:", error);

        if (!isCancelled) {
          setPreviewResults([]);
        }
      } finally {
        if (!isCancelled) {
          setPreviewLoading(false);
        }
      }
    }, 300);

    return () => {
      isCancelled = true;
      clearTimeout(debounceTimer);
    };
  }, [trimmedKeyword, searchedKeyword]);

  // 검색 영역 바깥을 클릭하면 미리보기 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchAreaRef.current &&
        !searchAreaRef.current.contains(event.target)
      ) {
        setIsSearchFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 선택한 탭에 따라 전체 검색 결과 필터링
  const filteredResults = useMemo(() => {
    if (selectedFilter === "all") {
      return results;
    }

    return results.filter((item) => item.media_type === selectedFilter);
  }, [results, selectedFilter]);

  // 필터별 결과 개수
  const resultCounts = useMemo(() => {
    return {
      all: results.length,

      movie: results.filter((item) => item.media_type === "movie").length,

      tv: results.filter((item) => item.media_type === "tv").length,

      person: results.filter((item) => item.media_type === "person").length,
    };
  }, [results]);

  // 입력 중 미리보기 표시 여부
  const showPreview =
    isSearchFocused &&
    trimmedKeyword.length > 0 &&
    trimmedKeyword !== searchedKeyword;

  // 최근 검색어 저장
  const saveRecentSearch = (searchKeyword) => {
    if (!recentSearchKey) return;

    const normalizedKeyword = searchKeyword.trim();

    if (!normalizedKeyword) return;

    setRecentSearches((previousSearches) => {
      const nextRecentSearches = [
        normalizedKeyword,
        ...previousSearches.filter(
          (item) => item.toLowerCase() !== normalizedKeyword.toLowerCase(),
        ),
      ].slice(0, MAX_RECENT_SEARCHES);

      try {
        localStorage.setItem(
          recentSearchKey,
          JSON.stringify(nextRecentSearches),
        );
      } catch (error) {
        console.log("최근 검색어 저장 실패:", error);
      }

      return nextRecentSearches;
    });
  };

  // 검색 실행
  const submitSearch = () => {
    if (!trimmedKeyword) {
      inputRef.current?.focus();
      return;
    }

    // 로그인한 사용자일 때만 최근 검색어 저장
    saveRecentSearch(trimmedKeyword);

    setIsSearchFocused(false);
    setPreviewResults([]);
    setSelectedFilter("all");

    // URL 검색어와 같다면 직접 다시 요청
    if (trimmedKeyword === queryFromUrl) {
      const reloadSearch = async () => {
        try {
          setLoading(true);

          const searchData = await getMultiSearch(trimmedKeyword, 1);

          setResults(filterSupportedResults(searchData.results));

          setSearchedKeyword(trimmedKeyword);
          setPage(searchData.page || 1);
          setTotalPages(searchData.total_pages || 0);
        } catch (error) {
          console.log("검색 결과 요청 실패:", error);

          setResults([]);
          setPage(1);
          setTotalPages(0);
        } finally {
          setLoading(false);
        }
      };

      reloadSearch();
      return;
    }

    navigate(`/search?query=${encodeURIComponent(trimmedKeyword)}`);
  };

  // Enter 또는 검색 버튼
  const handleSubmit = (event) => {
    event.preventDefault();
    submitSearch();
  };

  // 입력창 초기화
  const handleClearKeyword = () => {
    setKeyword("");
    setPreviewResults([]);
    setPreviewLoading(false);
    setIsSearchFocused(true);

    inputRef.current?.focus();
  };

  // 미리보기 결과 클릭
  const handlePreviewClick = () => {
    setIsSearchFocused(false);
    setPreviewResults([]);
  };

  // 최근 검색어 클릭
  const handleRecentSearchClick = (searchKeyword) => {
    setKeyword(searchKeyword);
    setSelectedFilter("all");
    setIsSearchFocused(false);

    saveRecentSearch(searchKeyword);

    navigate(`/search?query=${encodeURIComponent(searchKeyword)}`);
  };

  // 최근 검색어 개별 삭제
  const handleDeleteRecentSearch = (searchKeyword) => {
    if (!recentSearchKey) return;

    setRecentSearches((previousSearches) => {
      const nextRecentSearches = previousSearches.filter(
        (item) => item !== searchKeyword,
      );

      try {
        localStorage.setItem(
          recentSearchKey,
          JSON.stringify(nextRecentSearches),
        );
      } catch (error) {
        console.log("최근 검색어 삭제 실패:", error);
      }

      return nextRecentSearches;
    });
  };

  // 최근 검색어 전체 삭제
  const handleClearRecentSearches = () => {
    if (!recentSearchKey) return;

    setRecentSearches([]);

    try {
      localStorage.removeItem(recentSearchKey);
    } catch (error) {
      console.log("최근 검색어 전체 삭제 실패:", error);
    }
  };

  // 검색 결과 더 불러오기
  const handleLoadMore = async () => {
    const nextPage = page + 1;

    if (!searchedKeyword || nextPage > totalPages || moreLoading) {
      return;
    }

    try {
      setMoreLoading(true);

      const searchData = await getMultiSearch(searchedKeyword, nextPage);

      const nextResults = filterSupportedResults(searchData.results);

      setResults((prev) => removeDuplicateResults([...prev, ...nextResults]));

      setPage(searchData.page || nextPage);
      setTotalPages(searchData.total_pages || totalPages);
    } catch (error) {
      console.log("추가 검색 결과 요청 실패:", error);
    } finally {
      setMoreLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <PageTitle title="검색" />

      <main className="min-h-screen bg-black px-[20px] pt-[100px] pb-28 text-white md:px-[40px] md:pt-[130px] lg:px-[60px]">
        {/* 검색 상단 */}
        <section className="mx-auto w-full max-w-[1100px]">
          <div className="text-center">
            <h1 className="text-3xl font-bold md:text-4xl">
              영화, 시리즈, 인물을 한 번에 검색해보세요.
            </h1>
          </div>

          {/* 검색창과 미리보기 영역 */}
          <div ref={searchAreaRef} className="relative mt-8">
            {/* 검색 폼 */}
            <form onSubmit={handleSubmit} className="relative z-20">
              <SearchIcon
                size={22}
                strokeWidth={1.8}
                className="pointer-events-none absolute top-1/2 left-5 -translate-y-1/2 text-white/40"
              />

              <input
                ref={inputRef}
                type="search"
                value={keyword}
                onChange={(event) => {
                  setKeyword(event.target.value);
                  setIsSearchFocused(true);
                }}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="영화, 시리즈, 인물을 검색해보세요"
                autoComplete="off"
                className="
                  h-[58px]
                  w-full
                  rounded-full
                  border
                  border-white/15
                  bg-[#111]
                  pr-[125px]
                  pl-[54px]
                  text-base
                  text-white
                  outline-none
                  transition
                  placeholder:text-white/30
                  focus:border-[#33ddff]
                  md:h-[64px]
                  md:text-lg
                "
              />

              {keyword && (
                <button
                  type="button"
                  onClick={handleClearKeyword}
                  aria-label="검색어 지우기"
                  className="
                    absolute
                    top-1/2
                    right-[92px]
                    flex
                    h-8
                    w-8
                    -translate-y-1/2
                    items-center
                    justify-center
                    rounded-full
                    bg-white/10
                    text-white/50
                    transition
                    hover:bg-white/20
                    hover:text-white
                    md:right-[106px]
                  "
                >
                  <X size={16} />
                </button>
              )}

              <button
                type="submit"
                className="
                  absolute
                  top-1/2
                  right-2
                  h-[44px]
                  -translate-y-1/2
                  rounded-full
                  bg-[#33ddff]
                  px-5
                  text-sm
                  font-semibold
                  text-black
                  transition
                  hover:opacity-90
                  active:scale-[0.98]
                  md:h-[48px]
                  md:px-6
                  md:text-base
                "
              >
                검색
              </button>
            </form>

            {/* 입력 중 검색 미리보기 */}
            <div
              className={`
                absolute
                top-[68px]
                right-0
                left-0
                z-10
                overflow-hidden
                rounded-2xl
                border
                border-white/10
                bg-[#181818]
                shadow-2xl
                transition-all
                duration-200
                md:top-[74px]
                ${
                  showPreview
                    ? "visible translate-y-0 opacity-100"
                    : "pointer-events-none invisible -translate-y-2 opacity-0"
                }
              `}
            >
              {/* 미리보기 로딩 */}
              {previewLoading && (
                <div className="flex min-h-[150px] items-center justify-center">
                  <div className="h-7 w-7 animate-spin rounded-full border-2 border-white/20 border-t-[#33ddff]" />
                </div>
              )}

              {/* 미리보기 결과 있음 */}
              {!previewLoading && previewResults.length > 0 && (
                <>
                  <div className="max-h-[470px] overflow-y-auto p-2 md:p-3">
                    {previewResults.map((item) => (
                      <PreviewResultItem
                        key={`${item.media_type}-${item.id}`}
                        item={item}
                        onClick={handlePreviewClick}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={submitSearch}
                    className="
                      flex
                      h-[54px]
                      w-full
                      cursor-pointer
                      items-center
                      justify-center
                      border-t
                      border-white/10
                      px-4
                      text-sm
                      font-semibold
                      text-[#33ddff]
                      transition
                      hover:bg-white/5
                    "
                  >
                    “{trimmedKeyword}” 전체 검색 결과 보기
                  </button>
                </>
              )}

              {/* 미리보기 결과 없음 */}
              {!previewLoading &&
                trimmedKeyword &&
                previewResults.length === 0 && (
                  <div className="px-5 py-10 text-center">
                    <SearchIcon
                      size={34}
                      strokeWidth={1.4}
                      className="mx-auto text-white/20"
                    />

                    <p className="mt-4 text-sm text-white/60">
                      일치하는 미리보기 결과가 없습니다.
                    </p>

                    <button
                      type="button"
                      onClick={submitSearch}
                      className="mt-4 cursor-pointer text-sm font-semibold text-[#33ddff]"
                    >
                      전체 검색 결과 확인
                    </button>
                  </div>
                )}
            </div>
          </div>
        </section>

        {/* 검색 전 화면 */}
        {!searchedKeyword && !showPreview && (
          <section className="mx-auto mt-14 w-full max-w-[1100px]">
            {isLoggedIn && recentSearches.length > 0 ? (
              <div>
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-xl font-bold md:text-2xl">최근 검색어</h2>

                  <button
                    type="button"
                    onClick={handleClearRecentSearches}
                    className="cursor-pointer text-sm text-white/40 transition hover:text-[#33ddff]"
                  >
                    전체 삭제
                  </button>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  {recentSearches.map((searchKeyword) => (
                    <div
                      key={searchKeyword}
                      className="flex items-center overflow-hidden rounded-full border border-white/15 bg-white/5"
                    >
                      <button
                        type="button"
                        onClick={() => handleRecentSearchClick(searchKeyword)}
                        className="cursor-pointer px-4 py-2.5 text-sm text-white/75 transition hover:text-[#33ddff]"
                      >
                        {searchKeyword}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteRecentSearch(searchKeyword)}
                        aria-label={`${searchKeyword} 최근 검색어 삭제`}
                        className="flex self-stretch cursor-pointer items-center justify-center border-l border-white/10 px-3 text-white/35 transition hover:bg-white/10 hover:text-white"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex min-h-[360px] items-center justify-center text-center">
                <div>
                  <SearchIcon
                    size={52}
                    strokeWidth={1.3}
                    className="mx-auto text-white/20"
                  />

                  <p className="mt-5 text-lg font-semibold text-white/70">
                    검색어를 입력해주세요.
                  </p>

                  <p className="mt-2 text-sm text-white/40">
                    작품명이나 배우 이름으로 검색할 수 있습니다.
                  </p>

                  {!isLoggedIn && (
                    <p className="mt-4 text-xs text-white/30">
                      로그인하면 최근 검색어가 계정별로 저장됩니다.
                    </p>
                  )}
                </div>
              </div>
            )}
          </section>
        )}

        {/* 전체 검색 결과 */}
        {searchedKeyword && (
          <section className="mt-14">
            <div className="flex flex-col gap-6 border-b border-white/10 pb-6 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-2xl font-bold md:text-3xl">검색 결과</h2>

                <p className="mt-2 text-sm text-white/50">
                  <span className="font-semibold text-[#33ddff]">
                    “{searchedKeyword}”
                  </span>
                  에 대한 결과입니다.
                </p>
              </div>

              {/* 결과 필터 */}
              <div className="flex max-w-full gap-2 overflow-x-auto pb-1">
                {SEARCH_FILTERS.map((filter) => (
                  <button
                    key={filter.key}
                    type="button"
                    onClick={() => setSelectedFilter(filter.key)}
                    className={`
                      shrink-0
                      rounded-full
                      border
                      px-4
                      py-2
                      text-sm
                      transition
                      ${
                        selectedFilter === filter.key
                          ? "border-[#33ddff] bg-[#33ddff] font-semibold text-black"
                          : "border-white/15 bg-white/5 text-white/60 hover:border-white/30 hover:text-white"
                      }
                    `}
                  >
                    {filter.name}

                    <span className="ml-1.5 opacity-70">
                      {resultCounts[filter.key]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 검색 결과 카드 */}
            {filteredResults.length > 0 ? (
              <div
                className="
                  mt-8
                  grid
                  grid-cols-2
                  gap-x-4
                  gap-y-9
                  sm:grid-cols-3
                  md:grid-cols-4
                  lg:grid-cols-5
                  xl:grid-cols-6
                "
              >
                {filteredResults.map((item) => (
                  <SearchResultCard
                    key={`${item.media_type}-${item.id}`}
                    item={item}
                  />
                ))}
              </div>
            ) : (
              <div className="mt-8 flex min-h-[300px] items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] px-5 text-center">
                <div>
                  <p className="text-lg font-semibold text-white/70">
                    검색 결과가 없습니다.
                  </p>

                  <p className="mt-2 text-sm text-white/40">
                    다른 검색어나 필터를 선택해보세요.
                  </p>
                </div>
              </div>
            )}

            {/* 검색 결과 더보기 */}
            {page < totalPages && (
              <button
                type="button"
                onClick={handleLoadMore}
                disabled={moreLoading}
                className={`
                  mt-12
                  flex
                  h-12
                  w-full
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-white/15
                  bg-white/5
                  text-sm
                  font-semibold
                  transition
                  ${
                    moreLoading
                      ? "cursor-not-allowed text-white/30"
                      : "cursor-pointer text-white/80 hover:border-[#33ddff] hover:text-[#33ddff]"
                  }
                `}
              >
                {moreLoading
                  ? "검색 결과를 불러오는 중..."
                  : "검색 결과 더보기"}
              </button>
            )}
          </section>
        )}
      </main>
    </>
  );
}

// 입력 중 미리보기 한 줄
function PreviewResultItem({ item, onClick }) {
  const isMovie = item.media_type === "movie";
  const isTv = item.media_type === "tv";
  const isPerson = item.media_type === "person";

  const title = isMovie ? item.title : item.name;

  const date = isMovie ? item.release_date : isTv ? item.first_air_date : null;

  const year = date?.slice(0, 4);

  const detailPath = isMovie
    ? `/movie/${item.id}`
    : isTv
      ? `/tv/${item.id}`
      : `/people/${item.id}`;

  const imagePath = isPerson ? item.profile_path : item.poster_path;

  const contentType = isMovie ? "영화" : isTv ? "시리즈" : "인물";

  const personDepartment = isPerson
    ? translateDepartment(item.known_for_department)
    : null;

  return (
    <Link
      to={detailPath}
      onClick={onClick}
      className="group flex min-w-0 items-center gap-4 rounded-xl p-3 transition hover:bg-white/10"
    >
      <div className="flex h-[88px] w-[62px] shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white/10">
        {imagePath ? (
          <img
            src={`${W500_URL}${imagePath}`}
            alt={title}
            className="h-full w-full object-cover"
          />
        ) : (
          <UserRound size={24} strokeWidth={1.5} className="text-white/25" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded bg-white/10 px-2 py-1 text-[10px] text-white/50">
            {contentType}
          </span>

          {year && <span className="text-xs text-white/35">{year}</span>}
        </div>

        <h3 className="mt-2 truncate text-sm font-semibold text-white transition-colors group-hover:text-[#33ddff] md:text-base">
          {title}
        </h3>

        {!isPerson && item.vote_average > 0 && (
          <p className="mt-1 flex items-center gap-1 text-xs text-[#33ddff]">
            <Star size={12} fill="currentColor" />
            {item.vote_average.toFixed(1)}
          </p>
        )}

        {isPerson && personDepartment && (
          <p className="mt-1 text-xs text-white/40">{personDepartment}</p>
        )}
      </div>
    </Link>
  );
}

// 전체 검색 결과 카드
function SearchResultCard({ item }) {
  const isMovie = item.media_type === "movie";
  const isTv = item.media_type === "tv";
  const isPerson = item.media_type === "person";

  const title = isMovie ? item.title : item.name;

  const date = isMovie ? item.release_date : isTv ? item.first_air_date : null;

  const year = date?.slice(0, 4);

  const detailPath = isMovie
    ? `/movie/${item.id}`
    : isTv
      ? `/tv/${item.id}`
      : `/people/${item.id}`;

  const imagePath = isPerson ? item.profile_path : item.poster_path;

  const contentType = isMovie ? "영화" : isTv ? "시리즈" : "인물";

  const personDepartment = isPerson
    ? translateDepartment(item.known_for_department)
    : null;

  return (
    <Link to={detailPath} className="group min-w-0">
      <div className="aspect-[2/3] overflow-hidden rounded-xl bg-white/10">
        {imagePath ? (
          <img
            src={`${W500_URL}${imagePath}`}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 px-4 text-center text-white/30">
            <SearchIcon size={28} strokeWidth={1.4} />

            <span className="text-xs">등록된 이미지가 없습니다.</span>
          </div>
        )}
      </div>

      <div className="mt-3">
        <div className="flex items-center gap-2">
          <span className="rounded bg-white/10 px-2 py-1 text-[11px] text-white/55">
            {contentType}
          </span>

          {year && <span className="text-xs text-white/40">{year}</span>}
        </div>

        <h3 className="mt-2 line-clamp-2 text-sm leading-5 font-semibold text-white transition-colors group-hover:text-[#33ddff] md:text-base">
          {title}
        </h3>

        {!isPerson && item.vote_average > 0 && (
          <p className="mt-2 flex items-center gap-1 text-xs text-[#33ddff]">
            <Star size={13} fill="currentColor" />
            {item.vote_average.toFixed(1)}
          </p>
        )}

        {isPerson && personDepartment && (
          <p className="mt-2 text-xs text-white/45">{personDepartment}</p>
        )}
      </div>
    </Link>
  );
}

// 영화, 시리즈, 인물 결과만 남기기
function filterSupportedResults(results = []) {
  return results.filter(
    (item) =>
      item.media_type === "movie" ||
      item.media_type === "tv" ||
      item.media_type === "person",
  );
}

// 추가 검색 결과 중복 제거
function removeDuplicateResults(results) {
  const uniqueMap = new Map();

  results.forEach((item) => {
    const key = `${item.media_type}-${item.id}`;

    if (!uniqueMap.has(key)) {
      uniqueMap.set(key, item);
    }
  });

  return Array.from(uniqueMap.values());
}

// 인물 직업 한글 표시
function translateDepartment(department) {
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

  return departmentMap[department] || department || "인물";
}
