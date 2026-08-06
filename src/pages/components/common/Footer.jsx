import { Link, NavLink } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-black text-gray-400 px-[20px] md:px-[40px] lg:px-[60px] py-[30px]">
      <div className="w-full max-w-[1200px] mx-auto">
        <div className="flex flex-col items-start md:items-center gap-6">
          <Link to="/">
            <h3 className="text-[24px] md:text-[28px] lg:text-[30px] font-bold text-[#33ddff]">
              THE MOVIE
            </h3>
          </Link>

          <nav>
            <ul className="flex flex-wrap gap-5 md:gap-8 md:justify-center text-[15px] md:text-[16px]">
              <li>
                <NavLink
                  to="/movie"
                  className="hover:text-[#33ddff] transition-colors"
                >
                  영화
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/tv"
                  className="hover:text-[#33ddff] transition-colors"
                >
                  시리즈
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/wishlist"
                  className="hover:text-[#33ddff] transition-colors"
                >
                  내가 찜한 리스트
                </NavLink>
              </li>
            </ul>
          </nav>

          <div className="w-full border-t border-white/10 pt-5 text-[12px] md:text-[14px] leading-6 text-left md:text-center mb-16 md:mb-0">
            <p>© 2026 THE MOVIE</p>
            <p>
              This product uses the TMDB API but is not endorsed or certified by
              TMDB.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
