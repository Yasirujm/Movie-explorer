import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';
import ScrollingTitle from './ScrollingTitle';

function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const navigate = useNavigate();
  const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
  const isSearching = searchQuery.trim().length > 0;

  const fetchMovies = useCallback(async (pageToFetch = 1) => {
    setLoading(true);
    setError('');

    try {
      const endpoint = isSearching
        ? `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${searchQuery}&page=${pageToFetch}`
        : `https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}&page=${pageToFetch}`;

      const response = await axios.get(endpoint);
      const results = response.data.results;

      if (pageToFetch === 1) {
        setMovies(results);
      } else {
        setMovies((prev) => [...prev, ...results]);
      }

      setHasMore(response.data.total_pages > pageToFetch);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setError('Failed to load movies. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [API_KEY, searchQuery, isSearching]);

  useEffect(() => {
    setPage(1);
    fetchMovies(1);
  }, [fetchMovies]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 &&
        !loading && hasMore
      ) {
        setPage((prev) => prev + 1);
      }

      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore]);

  useEffect(() => {
    if (page > 1) {
      fetchMovies(page);
    }
  }, [page, fetchMovies]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.trim().length === 0) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${searchTerm}&page=1`
        );
        setSuggestions(response.data.results.slice(0, 5));
      } catch (err) {
        console.error('Error fetching suggestions:', err);
        setSuggestions([]);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, API_KEY]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setShowSuggestions(true);
  };

  const handleSearch = () => {
    setSearchQuery(searchTerm);
    setPage(1);
    setShowSuggestions(false);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setSearchQuery('');
    setPage(1);
    setShowSuggestions(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="home-container">
      <header>
        <div className="search-bar">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyPress={handleKeyPress}
            placeholder="Search for movies..."
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          />
          <button onClick={handleSearch} className="search-button">Search</button>
          {searchQuery && (
            <button onClick={handleClearSearch} className="clear-button">Clear</button>
          )}
          {showSuggestions && suggestions.length > 0 && (
            <ul className="suggestions-dropdown">
              {suggestions.map((movie) => (
                <li
                  key={movie.id}
                  onMouseDown={() => {
                    setShowSuggestions(false);
                    navigate(`/movie/${movie.id}`);
                  }}
                >
                  <img
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                        : 'https://via.placeholder.com/40x60?text=No+Image'
                    }
                    alt={movie.title}
                  />
                  <span>{movie.title}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </header>

      <h2 className="trending-title">{isSearching ? 'Search Results' : 'Trending Movies'}</h2>

      {error && <div className="error-message">{error}</div>}

      <div className="movie-grid">
        {movies.map((movie) => {
          const posterUrl = movie.poster_path
            ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
            : 'https://via.placeholder.com/500x750?text=No+Image';
          return (
            <Link to={`/movie/${movie.id}`} key={movie.id} className="movie-card-link">
              <div className="movie-card">
                <img
                  src={posterUrl}
                  alt={movie.title}
                  onError={(e) => e.target.src = 'https://via.placeholder.com/500x750?text=No+Image'}
                />
                <div className="movie-info">
                  <h3><ScrollingTitle title={movie.title} /></h3>
                  <p>{movie.release_date}</p>
                  <p><strong>Rating:</strong> {movie.vote_average.toFixed(1)}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {loading && <div className="loading">Loading more movies...</div>}

      {showScrollTop && (
        <button className="scroll-to-top" onClick={scrollToTop}>
          ↑
        </button>
      )}
    </div>
  );
}

export default Home;
