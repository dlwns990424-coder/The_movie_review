import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function TopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY >= 400);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleMoveToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      type="button"
      onClick={handleMoveToTop}
      aria-label="페이지 맨 위로 이동"
      className={`
        fixed
        right-[20px]
        z-[60]
        flex
        h-11
        w-11
        cursor-pointer
        items-center
        justify-center
        rounded-full
        border
        border-white/15
        bg-black/75
        text-white
        shadow-2xl
        backdrop-blur-md
        transition-all
        duration-300
        hover:border-[#33ddff]
        hover:bg-[#33ddff]
        hover:text-black
        md:right-[40px]
        md:h-12
        md:w-12
        lg:right-[60px]
        ${
          isVisible
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
        }

        bottom-[84px]
        md:bottom-[30px]
      `}
    >
      <ArrowUp size={21} strokeWidth={2} />
    </button>
  );
}
