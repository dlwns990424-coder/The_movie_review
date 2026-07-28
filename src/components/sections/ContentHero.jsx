import { Link } from "react-router-dom";
import { ORIGINAL_URL } from "../../constants/imageUrl";
export default function ContentHero({ item, detail, mediaType, heroLogo }) {
  console.log(item);
  console.log(detail);
  console.log(mediaType);

  return (
    <section className="w-full h-screen pt-[100px] px-[60px] pb-[20px] relative">
      <div
        className="w-full h-screen absolute top-0 left-0 -z-30 blur-3xl scale-140 brightness-40 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${ORIGINAL_URL}${item.backdrop_path})`,
        }}
      ></div>
      <div
        className="w-full h-[100%]  rounded-3xl overflow-hidden relative bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${ORIGINAL_URL}${item.backdrop_path})` }}
      >
        <div className="w-[50%] h-[60%] absolute bottom-0 left-0 p-[30px] flex flex-col justify-between">
          <div className="w-full h-[45%] ">
            {heroLogo ? (
              <img
                src={`${ORIGINAL_URL}${heroLogo.file_path}`}
                alt={item.title || item.name}
                className="h-full object-contain"
              />
            ) : (
              <h2>{item.title || item.name}</h2>
            )}
          </div>
          <div className="w-full h-[35%] space-y-[20px]">
            <p>영화 정보</p>
            <p className="text-[20px]">영화 줄거리</p>
          </div>
          <Link
            to="/"
            className="block w-[120px] py-[14px] bg-black/20 hover:bg-black/40 transition text-white text-center rounded-[50px]"
          >
            상세 정보
          </Link>
        </div>
      </div>
    </section>
  );
}
