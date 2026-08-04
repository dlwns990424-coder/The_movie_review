import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { CircleUserRound, Heart, Home, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useAuth } from "../../../context/AuthContext";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const desktopProfileRef = useRef(null);
  const mobileProfileRef = useRef(null);

  const [isDesktopProfileOpen, setIsDesktopProfileOpen] = useState(false);

  const [isMobileProfileOpen, setIsMobileProfileOpen] = useState(false);

  const [isScrolled, setIsScrolled] = useState(false);

  const { currentUser, isLoggedIn, logout } = useAuth();

  // 현재 검색 페이지인지 확인
  const isSearchPage = location.pathname === "/search";

  const displayName =
    currentUser?.nickname || currentUser?.username || "사용자";

  const closeProfileMenus = () => {
    setIsDesktopProfileOpen(false);
    setIsMobileProfileOpen(false);
  };

  // 찜 목록 이동
  const handleWishlistNavigate = () => {
    closeProfileMenus();

    if (isLoggedIn) {
      navigate("/wishlist");
      return;
    }

    navigate("/login", {
      state: {
        from: "/wishlist",
      },
    });
  };

  const handleLogout = () => {
    logout();
    closeProfileMenus();
    navigate("/");
  };

  const handleMobileProfile = () => {
    if (!isLoggedIn) {
      navigate("/login", {
        state: {
          from: "/mypage",
        },
      });

      return;
    }

    setIsMobileProfileOpen((prev) => !prev);
  };

  // 프로필 메뉴 바깥을 클릭하면 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      const clickedDesktopProfile = desktopProfileRef.current?.contains(
        event.target,
      );

      const clickedMobileProfile = mobileProfileRef.current?.contains(
        event.target,
      );

      if (!clickedDesktopProfile && !clickedMobileProfile) {
        closeProfileMenus();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 스크롤하면 Header 배경 표시
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // 페이지가 바뀌면 프로필 메뉴 닫기
  useEffect(() => {
    closeProfileMenus();
  }, [location.pathname]);

  return (
    <>
      {/* 상단 Header */}
      <header
        className={`
          fixed
          top-0
          left-0
          z-50
          w-full
          text-white
          transition-colors
          duration-300
          ${isScrolled ? "bg-black/80 backdrop-blur-md" : "bg-transparent"}
        `}
      >
        <div
          className="
            flex
            h-[60px]
            w-full
            items-center
            justify-between
            px-[20px]
            md:h-[80px]
            md:px-[40px]
            lg:px-[60px]
          "
        >
          {/* 왼쪽: 로고 + 영화 + 시리즈 + 찜 목록 */}
          <div className="flex min-w-0 items-center">
            <Link
              to="/"
              onClick={closeProfileMenus}
              className="mr-5 shrink-0 md:mr-[50px]"
            >
              <h1 className="text-[20px] font-bold whitespace-nowrap text-[#33ddff] md:text-[30px]">
                THE MOVIE
              </h1>
            </Link>

            <nav>
              <ul className="flex items-center gap-8 md:gap-10">
                <li>
                  <NavLink
                    to="/movie"
                    onClick={closeProfileMenus}
                    className={({ isActive }) =>
                      `text-[14px] whitespace-nowrap transition-colors hover:text-[#33ddff] md:text-[16px] ${
                        isActive ? "text-[#33ddff]" : "text-white"
                      }`
                    }
                  >
                    영화
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/tv"
                    onClick={closeProfileMenus}
                    className={({ isActive }) =>
                      `text-[14px] whitespace-nowrap transition-colors hover:text-[#33ddff] md:text-[16px] ${
                        isActive ? "text-[#33ddff]" : "text-white"
                      }`
                    }
                  >
                    시리즈
                  </NavLink>
                </li>

                {/* PC 및 태블릿 찜 목록 */}
                <li className="hidden md:list-item">
                  {isLoggedIn ? (
                    <NavLink
                      to="/wishlist"
                      onClick={closeProfileMenus}
                      className={({ isActive }) =>
                        `text-[16px] whitespace-nowrap transition-colors hover:text-[#33ddff] ${
                          isActive ? "text-[#33ddff]" : "text-white"
                        }`
                      }
                    >
                      내가 찜한 리스트
                    </NavLink>
                  ) : (
                    <button
                      type="button"
                      onClick={handleWishlistNavigate}
                      className="cursor-pointer text-[16px] whitespace-nowrap text-white transition-colors hover:text-[#33ddff]"
                    >
                      내가 찜한 리스트
                    </button>
                  )}
                </li>
              </ul>
            </nav>
          </div>

          {/* PC 오른쪽 */}
          <div className="hidden items-center gap-8 md:flex">
            {/* 검색 페이지에서는 Header 검색 버튼 숨김 */}
            {!isSearchPage && (
              <button
                type="button"
                onClick={() => navigate("/search")}
                aria-label="영화, 시리즈, 인물 검색"
                className="
                  flex
                  h-10
                  w-10
                  cursor-pointer
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/20
                  bg-black/20
                  text-white
                  backdrop-blur-md
                  transition
                  hover:border-[#33ddff]
                  hover:text-[#33ddff]
                  lg:w-[240px]
                  lg:justify-start
                  lg:gap-3
                  lg:px-4
                "
              >
                <Search size={18} strokeWidth={1.8} />

                <span className="hidden lg:block">영화, 시리즈, 인물 검색</span>
              </button>
            )}

            {isLoggedIn ? (
              <div ref={desktopProfileRef} className="relative">
                <button
                  type="button"
                  onClick={() => setIsDesktopProfileOpen((prev) => !prev)}
                  aria-label="마이페이지 메뉴"
                  aria-expanded={isDesktopProfileOpen}
                  className={`flex cursor-pointer items-center justify-center transition-colors ${
                    isDesktopProfileOpen
                      ? "text-[#33ddff]"
                      : "text-white hover:text-[#33ddff]"
                  }`}
                >
                  <CircleUserRound size={30} strokeWidth={1.7} />
                </button>

                {isDesktopProfileOpen && (
                  <div
                    className="
                      absolute
                      top-[45px]
                      right-0
                      w-[210px]
                      overflow-hidden
                      rounded-xl
                      border
                      border-white/10
                      bg-[#181818]
                      shadow-2xl
                    "
                  >
                    <div className="border-b border-white/10 px-5 py-4">
                      <p className="truncate font-semibold text-white">
                        {displayName} 님
                      </p>
                    </div>

                    <Link
                      to="/mypage"
                      onClick={closeProfileMenus}
                      className="
                        block
                        px-5
                        py-4
                        text-[16px]
                        text-white/80
                        transition
                        hover:bg-white/10
                        hover:text-[#33ddff]
                      "
                    >
                      마이페이지
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="
                        block
                        w-full
                        cursor-pointer
                        px-5
                        py-4
                        text-left
                        text-[16px]
                        text-white/80
                        transition
                        hover:bg-white/10
                        hover:text-[#33ddff]
                      "
                    >
                      로그아웃
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-white transition-colors hover:text-[#33ddff]"
                >
                  로그인
                </Link>

                <Link
                  to="/signup"
                  className="text-white transition-colors hover:text-[#33ddff]"
                >
                  회원가입
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 모바일 하단 메뉴 */}
      <nav
        className="
          fixed
          right-0
          bottom-0
          left-0
          z-50
          flex
          h-[64px]
          items-center
          border-t
          border-white/10
          bg-black/90
          text-white
          backdrop-blur-md
          md:hidden
        "
      >
        {/* 홈 */}
        <NavLink
          to="/"
          end
          onClick={closeProfileMenus}
          className={({ isActive }) =>
            `flex h-full flex-1 flex-col items-center justify-center gap-1 text-[14px] transition-colors ${
              isActive ? "text-[#33ddff]" : "text-white/60"
            }`
          }
        >
          <Home size={20} strokeWidth={1.8} />
          <span>홈</span>
        </NavLink>

        {/* 검색 */}
        <NavLink
          to="/search"
          onClick={closeProfileMenus}
          className={({ isActive }) =>
            `flex h-full flex-1 flex-col items-center justify-center gap-1 text-[14px] transition-colors ${
              isActive ? "text-[#33ddff]" : "text-white/60"
            }`
          }
        >
          <Search size={20} strokeWidth={1.8} />
          <span>검색</span>
        </NavLink>

        {/* 찜 목록 */}
        {isLoggedIn ? (
          <NavLink
            to="/wishlist"
            onClick={closeProfileMenus}
            className={({ isActive }) =>
              `flex h-full flex-1 flex-col items-center justify-center gap-1 text-[14px] transition-colors ${
                isActive ? "text-[#33ddff]" : "text-white/60"
              }`
            }
          >
            <Heart size={20} strokeWidth={1.8} />
            <span>찜 목록</span>
          </NavLink>
        ) : (
          <button
            type="button"
            onClick={handleWishlistNavigate}
            className={`flex h-full flex-1 cursor-pointer flex-col items-center justify-center gap-1 text-[14px] transition-colors ${
              location.pathname === "/wishlist"
                ? "text-[#33ddff]"
                : "text-white/60"
            }`}
          >
            <Heart size={20} strokeWidth={1.8} />
            <span>찜 목록</span>
          </button>
        )}

        {/* 로그인 또는 마이페이지 */}
        <div ref={mobileProfileRef} className="relative flex h-full flex-1">
          <button
            type="button"
            onClick={handleMobileProfile}
            aria-label={isLoggedIn ? "마이페이지 메뉴" : "로그인"}
            aria-expanded={isMobileProfileOpen}
            className={`flex h-full w-full cursor-pointer flex-col items-center justify-center gap-1 !text-[14px] transition-colors ${
              isMobileProfileOpen || location.pathname === "/mypage"
                ? "text-[#33ddff]"
                : "text-white/60"
            }`}
          >
            <CircleUserRound size={20} strokeWidth={1.8} />

            <span>{isLoggedIn ? "마이페이지" : "로그인"}</span>
          </button>

          {/* 모바일 마이페이지 메뉴 */}
          {isLoggedIn && (
            <div
              className={`
                absolute
                right-3
                bottom-[76px]
                w-[210px]
                origin-bottom-right
                overflow-hidden
                rounded-xl
                border
                border-white/10
                bg-[#181818]
                shadow-2xl
                transition-all
                duration-200
                ${
                  isMobileProfileOpen
                    ? "visible translate-y-0 scale-100 opacity-100"
                    : "pointer-events-none invisible translate-y-2 scale-95 opacity-0"
                }
              `}
            >
              <div className="border-b border-white/10 px-5 py-4">
                <p className="truncate font-semibold text-white">
                  {displayName} 님
                </p>
              </div>

              <Link
                to="/mypage"
                onClick={closeProfileMenus}
                className="
                  block
                  px-5
                  py-4
                  text-[16px]
                  text-white/80
                  transition
                  hover:bg-white/10
                  hover:text-[#33ddff]
                "
              >
                마이페이지
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="
                  block
                  w-full
                  cursor-pointer
                  px-5
                  py-4
                  text-left
                  text-[16px]
                  text-white/80
                  transition
                  hover:bg-white/10
                  hover:text-[#33ddff]
                "
              >
                로그아웃
              </button>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
