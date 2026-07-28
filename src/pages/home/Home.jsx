import { useEffect, useState } from "react";
import { getTrendingAll } from "../../api/trendingApi";
import { getContentDetail } from "../../api/contentApi";
import { getImages } from "../../api/logoImgApi";
import Loading from "../../components/common/Loading";
import ContentHero from "../../components/sections/ContentHero";

export default function Home() {
  const [heroItem, setHeroItem] = useState(null);
  const [heroDetail, setHeroDetail] = useState(null);
  const [heroLogo, setHeroLogo] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      try {
        const data = await getTrendingAll();

        const selectedItem = data.results.find(
          (item) => item.media_type === "movie" || item.media_type === "tv",
        );

        if (!selectedItem) return;

        const detailData = await getContentDetail(
          selectedItem.media_type,
          selectedItem.id,
        );

        const imageData = await getImages(
          selectedItem.media_type,
          selectedItem.id,
        );
        const logo = imageData.logos.find((logo) => logo.iso_639_1 === "ko");

        setHeroLogo(logo ?? imageData.logos[0] ?? null);
        setHeroItem(selectedItem);
        setHeroDetail(detailData);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  if (loading) {
    return <Loading />;
  }
  return (
    <div>
      {heroItem && heroDetail && (
        <ContentHero
          item={heroItem}
          detail={heroDetail}
          mediaType={heroItem.media_type}
          heroLogo={heroLogo}
        />
      )}
    </div>
  );
}
