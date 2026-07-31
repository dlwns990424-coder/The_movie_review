import { getMovieGenres } from "../api/movieApi";
import { getTvGenres } from "../api/tvApi";

let movieGenres = null;
let tvGenres = null;

const getGenreList = async (mediaType) => {
  if (mediaType === "movie") {
    if (!movieGenres) {
      movieGenres = await getMovieGenres();
    }

    return movieGenres;
  }

  if (!tvGenres) {
    tvGenres = await getTvGenres();
  }

  return tvGenres;
};

export const addGenreNames = async (list, mediaType) => {
  const genres = await getGenreList(mediaType);

  return list.map((item) => ({
    ...item,
    genreNames: item.genre_ids
      ?.map((id) => genres.find((genre) => genre.id === id)?.name)
      .filter(Boolean)
      .slice(0, 2),
  }));
};
