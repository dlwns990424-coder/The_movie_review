import { HashRouter, Route, Routes } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/home/Home";
import Movie from "../pages/movie/Movie";
import MovieDetail from "../pages/movie/MovieDetail";
import Tv from "../pages/tv/Tv";
import TvDetail from "../pages/tv/TvDetail";
import PersonDetail from "../pages/people/PersonDetail";
import MyPage from "../pages/mypage/MyPage";
import Search from "../pages/search/Search";
import Signup from "../pages/signup/Signup";
import Login from "../pages/login/Login";
import Wishlist from "../pages/wishlist/Wishlist";
import ScrollToTop from "../pages/hook/ScrollToTop";
import NotFound from "../pages/notfound/NotFound";
export default function Router() {
  return (
    <HashRouter>
      <ScrollToTop />

      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/movie" element={<Movie />} />
          <Route path="/movie/:movieId" element={<MovieDetail />} />

          <Route path="/tv" element={<Tv />} />
          <Route path="/tv/:tvId" element={<TvDetail />} />

          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/people/:personId" element={<PersonDetail />} />
          <Route path="/search" element={<Search />} />
          <Route path="/mypage" element={<MyPage />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </HashRouter>
  );
}
