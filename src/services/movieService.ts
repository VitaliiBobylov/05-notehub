import axios from "axios";

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
}

export interface TmdbResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

const axiosInstance = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
  },
});

export async function fetchMovies(
  query: string,
  page: number = 1
): Promise<TmdbResponse> {
  const response = await axiosInstance.get<TmdbResponse>("/search/movie", {
    params: { query, page },
  });
  return response.data;
}
