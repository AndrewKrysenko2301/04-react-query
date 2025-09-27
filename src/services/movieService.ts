import axios from "axios";
import type { Movie } from "../types/movie";

export interface MoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export const fetchMovies = async (
  query: string,
  page: number
): Promise<MoviesResponse> => {
  const token = import.meta.env.VITE_TMDB_TOKEN;

  if (!token) {
    throw new Error(
      "TMDB token is not defined. Check .env or Vercel env variables."
    );
  }

  const response = await axios.get<MoviesResponse>(
    "https://api.themoviedb.org/3/search/movie",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        query,
        page,
      },
    }
  );

  return response.data;
};
