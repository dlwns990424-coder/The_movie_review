import Header from "../pages/components/common/Header";
import Footer from "../pages/components/common/Footer";
import { Outlet } from "react-router-dom";
import TopButton from "../pages/components/common/TopButton";

export default function MainLayout() {
  return (
    <>
      <Header />
      <Outlet />
      <TopButton />
      <Footer />
    </>
  );
}
