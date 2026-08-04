import { Link, NavLink } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-black text-gray-400 py-[30px] h-[240px] flex flex-col items-center justify-between">
      <div className="w-[27%]">
        <Link to="/">
          <h3 className="text-[30px] text-[#33ddff] font-bold">THE MOVIE</h3>
        </Link>
        <nav className="mt-[20px]">
          <ul className="flex justify-between">
            <li>
              <NavLink
                to="/movie"
                className=" hover:!text-[#33ddff] transition-colors"
              >
                영화
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/tv"
                className=" hover:!text-[#33ddff] transition-colors"
              >
                시리즈
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/wishlist"
                className=" hover:!text-[#33ddff] transition-colors"
              >
                내가 찜한 리스트
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
      <div className="text-[14px] w-[27%] space-y-1">
        <p>© 2026 THE MOVIE</p>
        <p>
          This product uses the TMDB API but is not endorsed or certified by
          TMDB.
        </p>
      </div>
    </footer>
  );
}
