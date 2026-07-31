import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";

export default function ContentsSkeleton() {
  return (
    <section className="relative overflow-x-clip bg-black/96 pt-[50px]">
      {/* 제목 */}
      <div className="mb-8 flex items-center justify-between px-5 md:px-10 lg:px-15">
        <div className="h-7 w-[220px] animate-pulse rounded bg-white/10" />
      </div>

      {/* 기존 Swiper 영역과 동일 */}
      <div className="relative px-5 md:px-10 lg:px-15">
        <Swiper
          className="!overflow-visible"
          allowTouchMove={false}
          breakpoints={{
            0: {
              slidesPerView: 2,
              spaceBetween: 10,
            },
            480: {
              slidesPerView: 3,
              spaceBetween: 10,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 12,
            },
            940: {
              slidesPerView: 4,
              spaceBetween: 16,
            },
            1280: {
              slidesPerView: 4,
              spaceBetween: 18,
            },
            1600: {
              slidesPerView: 5,
              spaceBetween: 18,
            },
          }}
        >
          {Array.from({ length: 5 }).map((_, index) => (
            <SwiperSlide key={index}>
              <div>
                {/* 실제 카드 이미지 영역과 동일 */}
                <div className="aspect-video animate-pulse overflow-hidden rounded-lg bg-white/10" />

                {/* 실제 카드 텍스트 영역과 동일 */}
                <div className="mt-3">
                  <div className="h-5 w-3/4 animate-pulse rounded bg-white/10" />

                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-4 w-12 animate-pulse rounded bg-white/10" />
                    <div className="h-4 w-10 animate-pulse rounded bg-white/10" />
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
