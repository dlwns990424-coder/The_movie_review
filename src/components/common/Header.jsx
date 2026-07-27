import { Link, NavLink } from "react-router-dom";
export default function Header() {
  return (
    <header className="px-[60px] w-full h-[60px] md:h-[80px] flex items-center justify-between bg-black text-white">
      <Link to="/">
        <h1 className="text-[30px] text-[#33ddff] font-bold">THE MOVIE</h1>
      </Link>

      <nav>
        <ul className="flex justify-between">
          <li>
            <NavLink to="/movie">영화</NavLink>
          </li>
          <li>
            <NavLink to="/tv">시리즈</NavLink>
          </li>
          <li>
            <NavLink to="/people">인기배우</NavLink>
          </li>
        </ul>
      </nav>
      <div>
        <Link to="/search">검색</Link>
        <Link to="/login">로그인</Link>
        <Link to="/signup">회원가입</Link>
      </div>
    </header>
  );
}
