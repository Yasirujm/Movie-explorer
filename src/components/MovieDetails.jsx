import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import './MovieDetails.css';

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&append_to_response=credits,videos`
      );
      const data = await response.json();
      setMovie(data);
    };
    fetchMovieDetails();
  }, [id]);

  if (!movie) return <p className="loading-text">Loading...</p>;

  const trailer = movie.videos?.results?.[0]?.key;
  const director = movie.credits.crew.find(p => p.job === 'Director')?.name || 'N/A';
  const writers = movie.credits.crew
    .filter(p => p.department === 'Writing')
    .map(p => p.name)
    .slice(0, 3)
    .join(', ') || 'N/A';

  // Format the rating to 1 decimal place
  const formattedRating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';

  return (
    <div className="movie-details-container">
      <div className="poster">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
        />
      </div>
      <div className="info">
        <h1>{movie.title}</h1>
        <p className="overview">{movie.overview}</p>
        <p><strong>Rating:</strong> {formattedRating}</p>
        <p><strong>Runtime:</strong> {movie.runtime} minutes</p>
        <p><strong>Release Date:</strong> {movie.release_date}</p>
        <p><strong>Genres:</strong> {movie.genres.map(g => g.name).join(', ')}</p>
        <p><strong>Director:</strong> {director}</p>
        <p><strong>Writers:</strong> {writers}</p>

        <div className="cast-section">
          <h3>Top Cast</h3>
          <div className="cast-row">
            {movie.credits.cast.slice(0, 10).map((c) => (
              <div className="cast-bubble" key={c.cast_id}>
                <img
                  src={
                    c.profile_path
                      ? `https://image.tmdb.org/t/p/w185${c.profile_path}`
                      : 'https://via.placeholder.com/100x100?text=No+Image'
                  }
                  alt={c.name}
                />
                <p className="cast-name">{c.name}</p>
              </div>
            ))}
          </div>
        </div>

        {trailer ? (
          <a
            className="trailer-btn"
            href={`https://www.youtube.com/watch?v=${trailer}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <PlayArrowIcon fontSize="small" />
            Watch Trailer
          </a>
        ) : (
          <p>No trailer available</p>
        )}
      </div>
    </div>
  );
};

export default MovieDetails;
