export default function ContentHeroSkeleton() {
  return (
    <section
      className="
        relative
        h-[680px]
        w-full
        overflow-hidden
        px-[20px]
        pt-[85px]
        pb-[20px]
        sm:h-[720px]
        md:h-[780px]
        md:px-[40px]
        md:pt-[100px]
        md:pb-[40px]
        lg:h-screen
        lg:min-h-[760px]
        lg:px-[60px]
        lg:pb-[60px]
      "
    >
      {/* 바깥 배경 */}
      <div className="absolute inset-0 -z-30 bg-neutral-900" />

      {/* Hero Skeleton */}
      <div
        className="
          relative
          h-full
          w-full
          animate-pulse
          overflow-hidden
          rounded-2xl
          bg-neutral-800
          md:rounded-3xl
        "
      >
        {/* 장르 선택 영역 */}
        <div
          className="
            absolute
            top-[18px]
            left-[18px]
            flex
            items-center
            gap-2
            sm:top-[24px]
            sm:left-[24px]
            sm:gap-3
            md:top-[30px]
            md:left-[30px]
            md:gap-4
          "
        >
          <div
            className="
              h-[30px]
              w-[52px]
              rounded-lg
              bg-white/10
              sm:h-[34px]
              sm:w-[60px]
              md:h-[38px]
              md:w-[70px]
            "
          />

          <div
            className="
              h-10
              w-[120px]
              rounded-full
              bg-white/10
              sm:h-11
              sm:w-[140px]
              md:h-12
              md:w-[150px]
            "
          />
        </div>

        {/* 하단 콘텐츠 */}
        <div
          className="
            absolute
            bottom-0
            left-0
            flex
            w-full
            flex-col
            gap-4
            px-[20px]
            pb-[28px]
            sm:px-[28px]
            sm:pb-[36px]
            md:w-[65%]
            md:gap-5
            md:px-[40px]
            md:pb-[45px]
            lg:w-[55%]
            lg:max-w-[900px]
            lg:px-[50px]
            lg:pb-[50px]
          "
        >
          {/* 로고 */}
          <div
            className="
              h-[70px]
              w-[220px]
              rounded-xl
              bg-white/10
              sm:h-[85px]
              sm:w-[270px]
              md:h-[100px]
              md:w-[320px]
            "
          />

          {/* 메타 정보 */}
          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            <div className="h-[18px] w-[48px] rounded bg-white/10 md:h-[22px] md:w-[60px]" />

            <div className="h-[18px] w-[58px] rounded bg-white/10 md:h-[22px] md:w-[70px]" />

            <div className="h-[18px] w-[42px] rounded bg-white/10 md:h-[22px] md:w-[50px]" />

            <div className="h-[18px] w-[42px] rounded bg-white/10 md:h-[22px] md:w-[50px]" />
          </div>

          {/* 줄거리 */}
          <div className="space-y-2.5 md:space-y-3">
            <div className="h-[14px] w-full rounded bg-white/10 md:h-[18px]" />

            <div className="h-[14px] w-[90%] rounded bg-white/10 md:h-[18px]" />

            <div className="h-[14px] w-[70%] rounded bg-white/10 md:h-[18px]" />
          </div>

          {/* 버튼 영역 */}
          <div className="flex items-center gap-3">
            <div
              className="
                h-11
                w-[120px]
                rounded-full
                bg-white/10
                md:h-12
                md:w-[135px]
              "
            />

            <div
              className="
                h-11
                w-[120px]
                rounded-full
                bg-white/10
                md:h-12
                md:w-[135px]
              "
            />
          </div>
        </div>
      </div>
    </section>
  );
}
