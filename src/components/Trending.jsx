import React, { useEffect, useState } from 'react';
import './Trending.css';
import MovieCard from './MovieCard';

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

const Trending = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);

  useEffect(() => {
    const fetchTrending = async () => {
      const response = await fetch(
        `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`
      );
      const data = await response.json();
      setTrendingMovies(data.results);
    };
    fetchTrending();
  }, []);

  return (
    <div className="trending-container">
      <h2>Trending Movies</h2>
      <div className="movie-grid">
        {trendingMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default Trending;
