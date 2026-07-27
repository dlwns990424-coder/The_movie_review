import { Link, NavLink } from "react-router-dom";
export default function Header() {
  return (
    <header>
      <Link to="/">
        <h1>THE MOVIE</h1>
      </Link>

      <nav>
        <ul>
          <li>
            <NavLink to="/movie/popular">영화</NavLink>
          </li>
          <li>
            <NavLink to="/tv/popular">시리즈</NavLink>
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
