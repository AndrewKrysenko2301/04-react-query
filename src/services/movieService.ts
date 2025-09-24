import axios from "axios";
import type { MoviesResponse } from "../types/movie";

export const fetchMovies = async (
  endpoint: string
): Promise<MoviesResponse> => {
  const token = import.meta.env.VITE_TMDB_TOKEN;

  if (!token) {
    throw new Error(
      "TMDB token is not defined. Check .env or Vercel env variables."
    );
  }

  const response = await axios.get<MoviesResponse>(
    `https://api.themoviedb.org/3/${endpoint}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};
