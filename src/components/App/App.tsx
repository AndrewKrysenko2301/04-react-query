import { useState, useEffect, useMemo } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import { fetchMovies } from "../../services/movieService";
import type { Movie } from "../../types/movie";
import type { MoviesResponse } from "../../services/movieService";
import Pagination from "../ReactPaginate/ReactPaginate";

export default function App() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const [previousData, setPreviousData] = useState<MoviesResponse | null>(null);

  const { data, isLoading, isError, isSuccess, isFetching } = useQuery<
    MoviesResponse,
    Error
  >({
    queryKey: ["movies", searchQuery, page],
    queryFn: () => fetchMovies(searchQuery, page),
    enabled: !!searchQuery,
    placeholderData: previousData || {
      page: 1,
      results: [],
      total_pages: 0,
      total_results: 0,
    },
    staleTime: 5000,
  });

  useEffect(() => {
    if (data) {
      setPreviousData(data);
    }
  }, [data]);

  const moviesData = useMemo(() => data?.results || [], [data?.results]);
  const totalPages = data?.total_pages || 0;

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  const handlePageChange = (selectedPage: number) => {
    setPage(selectedPage);
  };

  useEffect(() => {
    if (isSuccess && searchQuery.trim() !== "" && moviesData.length === 0) {
      toast.error("No movies found for your request.");
    }
  }, [isSuccess, moviesData, searchQuery]);

  return (
    <>
      <SearchBar onSubmit={handleSearch} />
      <Toaster position="top-right" />

      {(isLoading || isFetching) && <Loader />}
      {isError && <ErrorMessage />}

      {!isLoading && !isError && (
        <>
          <MovieGrid movies={moviesData} onSelect={handleSelectMovie} />
          <Pagination
            page={page}
            setPage={handlePageChange}
            totalPages={totalPages}
          />
        </>
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </>
  );
}
