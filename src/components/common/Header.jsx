import { Link, NavLink } from "react-router-dom";

export default function Header() {
  return (
    <header className="px-[20px] md:px-[40px] lg:px-[60px] w-full h-[60px] md:h-[80px] flex items-center justify-between bg-black/0 text-white fixed z-50">
      <div className="flex items-center">
        <Link to="/" className="mr-[50px]">
          <h1 className="text-[20px] md:text-[30px] text-[#33ddff] font-bold">
            THE MOVIE
          </h1>
        </Link>

        <nav>
          <ul className="flex justify-between space-x-10">
            <li>
              <NavLink
                to="/movie"
                className="text-white hover:!text-[#33ddff] transition-colors"
              >
                영화
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/tv"
                className="text-white hover:!text-[#33ddff] transition-colors"
              >
                시리즈
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/people"
                className="text-white hover:!text-[#33ddff] transition-colors"
              >
                인기배우
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/wishlist"
                className="text-white hover:!text-[#33ddff] transition-colors"
              >
                내가 찜한 리스트
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>

      <div className="space-x-10">
        <Link
          to="/search"
          className="text-white hover:!text-[#33ddff] transition-colors"
        >
          검색
        </Link>

        <Link
          to="/login"
          className="text-white hover:!text-[#33ddff] transition-colors"
        >
          로그인
        </Link>

        <Link
          to="/signup"
          className="text-white hover:!text-[#33ddff] transition-colors"
        >
          회원가입
        </Link>
      </div>
    </header>
  );
}
