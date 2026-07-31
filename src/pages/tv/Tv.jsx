import { useState } from "react";
import ContentHero from "../components/sections/ContentHero";

export default function Tv() {
  return (
    <div>
      <ContentHero
        item={heroItem}
        detail={heroDetail}
        mediaType="tv"
        heroLogo={heroLogo}
        genres={tvGenres}
        selectedGenre={selectedGenre}
        onGenreChange={setSelectedGenre}
        showGenreSelector
      />
    </div>
  );
}
