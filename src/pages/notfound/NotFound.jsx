import { Link } from "react-router-dom";
import PageTitle from "../components/common/PageTitle";

export default function NotFound() {
  return (
    <>
      <PageTitle title="404 Not Found" />

      <section className="flex min-h-screen items-center justify-center bg-black px-5">
        <div className="max-w-[600px] text-center">
          <h1 className="text-[90px] font-extrabold text-[#33ddff] md:text-[140px]">
            404
          </h1>

          <h2 className="mt-2 text-3xl font-bold text-white md:text-4xl">
            페이지를 찾을 수 없습니다.
          </h2>

          <p className="mt-5 text-white/60 leading-7">
            요청하신 페이지가 존재하지 않거나
            <br />
            주소가 변경 또는 삭제되었습니다.
          </p>

          <div className="mt-10 flex justify-center gap-4">
            <Link
              to="/"
              className="
                flex
                h-12
                min-w-[150px]
                items-center
                justify-center
                rounded-full
                bg-[#33ddff]
                px-6
                font-semibold
                text-black
                transition
                hover:opacity-90
              "
            >
              홈으로 이동
            </Link>

            <button
              type="button"
              onClick={() => window.history.back()}
              className="
                flex
                h-12
                min-w-[150px]
                cursor-pointer
                items-center
                justify-center
                rounded-full
                border
                border-white/20
                bg-white/5
                px-6
                font-semibold
                text-white
                transition
                hover:border-[#33ddff]
                hover:text-[#33ddff]
              "
            >
              이전 페이지
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
