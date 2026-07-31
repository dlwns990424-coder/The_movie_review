import { RotatingLines } from "react-loader-spinner";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black">
      <RotatingLines
        visible={true}
        height="48"
        width="48"
        color="#33ddff"
        strokeWidth="5"
        animationDuration="0.75"
        ariaLabel="rotating-lines-loading"
      />
    </div>
  );
}
