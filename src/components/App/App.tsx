import { useState, useEffect, useMemo } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
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
  const [hasSearched, setHasSearched] = useState(false);

  const { data, isLoading, isError, isSuccess, isFetching } = useQuery<
    MoviesResponse,
    Error
  >({
    queryKey: ["movies", searchQuery, page],
    queryFn: () => fetchMovies(searchQuery, page),
    enabled: !!searchQuery,
    placeholderData: keepPreviousData,
  });

  const moviesData = useMemo(() => data?.results || [], [data?.results]);
  const totalPages = useMemo(() => data?.total_pages || 0, [data?.total_pages]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
    setHasSearched(true);
  };

  const handleSelectMovie = (movie: Movie) => setSelectedMovie(movie);
  const handleCloseModal = () => setSelectedMovie(null);

  const handlePageChange = (selectedPage: number) => setPage(selectedPage);

  useEffect(() => {
    if (hasSearched && isSuccess && moviesData.length === 0) {
      toast.error("No movies found for your request.");
    }
  }, [hasSearched, isSuccess, moviesData]);

  return (
    <>
      <SearchBar onSubmit={handleSearch} />
      <Toaster position="top-right" />

      {(isLoading || isFetching) && <Loader />}
      {isError && <ErrorMessage />}

      {!isLoading && !isError && (
        <>
          {/* Пагинация сверху */}
          {totalPages > 1 && (
            <Pagination
              page={page}
              setPage={handlePageChange}
              totalPages={totalPages}
            />
          )}

          <MovieGrid movies={moviesData} onSelect={handleSelectMovie} />

          {totalPages > 1 && (
            <Pagination
              page={page}
              setPage={handlePageChange}
              totalPages={totalPages}
            />
          )}
        </>
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </>
  );
}
