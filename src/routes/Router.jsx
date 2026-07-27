import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/home/Home";
import MovieList from "../pages/movie/MovieList";
import MovieDetail from "../pages/movie/MovieDetail";
import TvList from "../pages/tv/TvList";
import TvDetail from "../pages/tv/TvDetail";
import PersonDetail from "../pages/people/PersonDetail";
import PeopleList from "../pages/people/PeopleList";
import MyPage from "../pages/mypage/MyPage";
import Search from "../pages/search/Search";
import Signup from "../pages/signup/Signup";
import Login from "../pages/login/Login";
export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/movie" element={<MovieList />} />
          <Route path="/movie/:movieId" element={<MovieDetail />} />

          <Route path="/tv" element={<TvList />} />
          <Route path="/tv/:tvId" element={<TvDetail />} />

          <Route path="/people" element={<PeopleList />} />
          <Route path="/people/:personId" element={<PersonDetail />} />

          <Route path="/search" element={<Search />} />
          <Route path="/mypage" element={<MyPage />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}
