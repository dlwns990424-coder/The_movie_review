import { Link, NavLink, useNavigate } from "react-router-dom";
import { CircleUserRound, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useAuth } from "../../../context/AuthContext";

export default function Header() {
  const navigate = useNavigate();
  const profileRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const { currentUser, isLoggedIn, logout } = useAuth();

  const closeMobileMenu = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    logout();

    setOpen(false);
    setIsProfileOpen(false);

    navigate("/");
  };

  // 프로필 메뉴 바깥을 누르면 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="fixed z-50 flex h-[60px] w-full items-center justify-between bg-black/0 px-[20px] text-white md:h-[80px] md:px-[40px] lg:px-[60px]">
      <div className="flex items-center">
        <Link to="/" className="mr-[50px]" onClick={closeMobileMenu}>
          <h1 className="text-[20px] font-bold text-[#33ddff] md:text-[30px]">
            THE MOVIE
          </h1>
        </Link>

        <nav className="hidden md:block">
          <ul className="flex items-center space-x-10">
            <li>
              <NavLink
                to="/movie"
                className="text-white transition-colors hover:!text-[#33ddff]"
              >
                영화
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/tv"
                className="text-white transition-colors hover:!text-[#33ddff]"
              >
                시리즈
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/people"
                className="text-white transition-colors hover:!text-[#33ddff]"
              >
                인기 인물
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>

      <div className="hidden items-center gap-8 md:flex">
        <Link
          to="/search"
          className="text-white transition-colors hover:text-[#33ddff]"
        >
          검색
        </Link>

        {isLoggedIn ? (
          <div ref={profileRef} className="relative">
            <button
              type="button"
              onClick={() => setIsProfileOpen((prev) => !prev)}
              aria-label="마이페이지 메뉴"
              aria-expanded={isProfileOpen}
              className={`flex cursor-pointer items-center justify-center transition-colors ${
                isProfileOpen
                  ? "text-[#33ddff]"
                  : "text-white hover:text-[#33ddff]"
              }`}
            >
              <CircleUserRound size={30} strokeWidth={1.7} />
            </button>

            {isProfileOpen && (
              <div className="absolute top-[45px] right-0 w-[210px] overflow-hidden rounded-xl border border-white/10 bg-[#181818] shadow-2xl">
                <div className="border-b border-white/10 px-5 py-4">
                  <p className="truncate font-semibold text-white">
                    {currentUser.nickname} 님
                  </p>
                </div>

                <Link
                  to="/wishlist"
                  onClick={() => setIsProfileOpen(false)}
                  className="block px-5 py-4 text-sm text-white/80 transition hover:bg-white/10 hover:text-[#33ddff]"
                >
                  내가 찜한 리스트
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="block w-full cursor-pointer px-5 py-4 text-left text-sm text-white/80 transition hover:bg-white/10 hover:text-[#33ddff]"
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

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
        className="cursor-pointer md:hidden"
      >
        {open ? <X size={28} /> : <Menu size={28} />}
      </button>

      {open && (
        <div className="absolute top-[60px] left-0 flex w-full flex-col gap-5 bg-black/95 px-5 py-6 md:hidden">
          <NavLink to="/movie" onClick={closeMobileMenu}>
            영화
          </NavLink>

          <NavLink to="/tv" onClick={closeMobileMenu}>
            시리즈
          </NavLink>

          <NavLink to="/people" onClick={closeMobileMenu}>
            인기 인물
          </NavLink>

          <NavLink to="/search" onClick={closeMobileMenu}>
            검색
          </NavLink>

          {isLoggedIn ? (
            <>
              <p className="text-white/60">{currentUser.nickname} 님</p>

              <NavLink to="/wishlist" onClick={closeMobileMenu}>
                내가 찜한 리스트
              </NavLink>

              <button
                type="button"
                onClick={handleLogout}
                className="w-fit cursor-pointer"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" onClick={closeMobileMenu}>
                로그인
              </NavLink>

              <NavLink to="/signup" onClick={closeMobileMenu}>
                회원가입
              </NavLink>
            </>
          )}
        </div>
      )}
    </header>
  );
}
