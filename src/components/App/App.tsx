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
import ReactPaginate from "react-paginate";
import css from "./App.module.css";

export default function App() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const { data, isLoading, isError, isSuccess } = useQuery<
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

  const handlePageChange = ({ selected }: { selected: number }) => {
    setPage(selected + 1);
  };

  useEffect(() => {
    if (hasSearched && isSuccess && moviesData.length === 0) {
      toast.error("No movies found for your request.");
    }
  }, [hasSearched, isSuccess, moviesData]);

  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSearch} />
      <Toaster position="top-right" />

      {isLoading && !data && <Loader />}
      {isError && <ErrorMessage />}
      {!isLoading && !isError && (
        <>
          {totalPages > 1 && (
            <ReactPaginate
              pageCount={totalPages}
              forcePage={page - 1}
              onPageChange={handlePageChange}
              containerClassName={css.pagination}
              activeClassName={css.active}
              previousLabel="←"
              nextLabel="→"
            />
          )}

          {moviesData.length > 0 && (
            <MovieGrid movies={moviesData} onSelect={handleSelectMovie} />
          )}

          {totalPages > 1 && (
            <ReactPaginate
              pageCount={totalPages}
              forcePage={page - 1}
              onPageChange={handlePageChange}
              containerClassName={css.pagination}
              activeClassName={css.active}
            />
          )}
        </>
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </div>
  );
}
