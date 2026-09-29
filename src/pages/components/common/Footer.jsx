import { Link, NavLink } from "react-router-dom";
import BrandLogo from "./BrandLogo";

export default function Footer() {
  return (
    <footer className="bg-black text-gray-400 px-[20px] md:px-[40px] lg:px-[60px] py-[30px]">
      <div className="w-full max-w-[1200px] mx-auto">
        <div className="flex flex-col items-start md:items-center gap-6">
          <Link to="/" aria-label="MAMORI 홈으로 이동">
            <BrandLogo className="w-[150px] md:w-[170px]" />
          </Link>
          <p className="-mt-3 text-[11px] tracking-[0.28em] text-white/35 md:text-[12px]">
            MY MOVIE REVIEW
          </p>

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
            <p>
              This product uses the TMDB API but is not endorsed or certified by
              TMDB.
            </p>
            <p>© 2026 MAMORI</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
