export default function ContentHeroSkeleton() {
  return (
    <section className="w-full max-w-[1920px] overflow-hidden h-screen pt-[100px] px-[60px] pb-[60px] relative">
      {/* 바깥 배경 */}
      <div className="absolute inset-0 -z-30 bg-neutral-900" />

      <div className="w-full h-full rounded-3xl overflow-hidden relative bg-neutral-800 animate-pulse">
        {/* 장르 선택 영역 */}
        <div className="absolute top-[30px] left-[30px] flex items-center gap-4">
          <div className="w-[70px] h-[38px] rounded-lg bg-white/10" />
          <div className="w-[150px] h-[44px] rounded-full bg-white/10" />
        </div>

        {/* 하단 콘텐츠 */}
        <div className="w-[50%] absolute bottom-0 left-0 pb-[50px] px-[50px] flex flex-col gap-5">
          {/* 로고 */}
          <div className="w-[320px] h-[100px] rounded-xl bg-white/10" />

          {/* 메타 정보 */}
          <div className="flex items-center gap-3">
            <div className="w-[60px] h-[22px] rounded bg-white/10" />
            <div className="w-[70px] h-[22px] rounded bg-white/10" />
            <div className="w-[50px] h-[22px] rounded bg-white/10" />
            <div className="w-[50px] h-[22px] rounded bg-white/10" />
          </div>

          {/* 줄거리 */}
          <div className="space-y-3">
            <div className="w-full h-[18px] rounded bg-white/10" />
            <div className="w-[90%] h-[18px] rounded bg-white/10" />
            <div className="w-[70%] h-[18px] rounded bg-white/10" />
          </div>

          {/* 버튼 */}
          <div className="w-[120px] h-[48px] rounded-full bg-white/10" />
        </div>
      </div>
    </section>
  );
}
