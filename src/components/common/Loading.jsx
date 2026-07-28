import { RotatingLines } from "react-loader-spinner";

export default function Loading() {
  return (
    <div className="w-full max-w-[1920px] h-screen bg-black flex items-center justify-center">
      <RotatingLines
        visible={true}
        height="96"
        width="96"
        color="#33ddff"
        strokeWidth="5"
        animationDuration="0.75"
        ariaLabel="rotating-lines-loading"
      />
    </div>
  );
}
