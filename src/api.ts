const BASE_PATH = "https://api.themoviedb.org/3";
const API_KEY = "d08e61e77e5d21f339d4ac91e66a2609";

interface IGenre {
  id: number;
  name: string;
}

interface IVideo {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
  original_title: string;
  genre_ids: number[];
  release_date: string;
}

export interface IFetchVideos {
  page: number;
  results: IVideo[];
  total_pages: number;
  total_results: number;
}

export function fetchMovies(type: string) {
  return fetch(`${BASE_PATH}/movie/${type}?api_key=${API_KEY}&language=ko-KR`).then(
    (response) => response.json()
  );
}

export function fetchPrograms(type: string) {
  return fetch(`${BASE_PATH}/tv/${type}?api_key=${API_KEY}&language=ko-KR`).then(
    (response) => response.json()
  );
}
