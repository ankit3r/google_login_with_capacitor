import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovieDetails, addComment, clearSelectedMovie } from '../models/movieSlice';
import { useAuth } from '../controllers/useAuth';
import { getImageUrl } from '../services/tmdb';
import './MovieDetailsView.css';

const MovieDetailsView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { selectedMovie, loading, comments } = useSelector((state) => state.movies);
  const [comment, setComment] = useState('');
  const [playingTrailer, setPlayingTrailer] = useState(null);

  useEffect(() => {
    dispatch(fetchMovieDetails(id));
    
    return () => {
      dispatch(clearSelectedMovie());
    };
  }, [id, dispatch]);

  const handleAddComment = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      dispatch(addComment({ movieId: id, comment: comment.trim() }));
      setComment('');
    }
  };

  const handlePlayTrailer = (videoKey) => {
    setPlayingTrailer(videoKey);
  };

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
    window.scrollTo(0, 0);
  };

  if (loading || !selectedMovie) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading movie details...</div>
      </div>
    );
  }

  const trailer = selectedMovie.videos?.results?.find(
    (video) => video.type === 'Trailer' && video.site === 'YouTube'
  );

  // Fixed: Use 'comments' instead of 'userComments'
  const movieComments = comments && comments[id] ? comments[id] : [];
  const allReviews = [
    ...movieComments.map(c => ({ ...c, isUserComment: true })),
    ...(selectedMovie.reviews?.results || [])
  ];

  return (
    <div className="movie-details-container">
      {/* Back Button */}
      <button onClick={() => navigate(-1)} className="back-btn">
        ← Back
      </button>

      {/* Hero Section */}
      <div 
        className="movie-hero"
        style={{
          backgroundImage: `url(${getImageUrl(selectedMovie.backdrop_path, 'original')})`
        }}
      >
        <div className="hero-overlay">
          <div className="hero-content">
            <img
              src={getImageUrl(selectedMovie.poster_path, 'w300')}
              alt={selectedMovie.title}
              className="hero-poster"
            />
            <div className="hero-info">
              <h1>{selectedMovie.title}</h1>
              <div className="movie-meta">
                <span className="rating">⭐ {selectedMovie.vote_average?.toFixed(1) || 'N/A'}</span>
                <span>{selectedMovie.release_date ? new Date(selectedMovie.release_date).getFullYear() : 'N/A'}</span>
                <span>{selectedMovie.runtime ? `${selectedMovie.runtime} min` : 'N/A'}</span>
              </div>
              <div className="genres">
                {selectedMovie.genres?.map((genre) => (
                  <span key={genre.id} className="genre-tag">{genre.name}</span>
                ))}
              </div>
              <p className="overview">{selectedMovie.overview || 'No overview available.'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="details-content">
        {/* Trailer Section */}
        {trailer && (
          <section className="trailer-section">
            <h2>Watch Trailer</h2>
            {playingTrailer ? (
              <div className="trailer-player">
                <iframe
                  width="100%"
                  height="500"
                  src={`https://www.youtube.com/embed/${playingTrailer}?autoplay=1`}
                  title="Trailer"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
              <div 
                className="trailer-thumbnail"
                onClick={() => handlePlayTrailer(trailer.key)}
              >
                <img
                  src={`https://img.youtube.com/vi/${trailer.key}/maxresdefault.jpg`}
                  alt="Trailer thumbnail"
                />
                <div className="play-button">▶</div>
              </div>
            )}
          </section>
        )}

        {/* Cast Section */}
        {selectedMovie.credits?.cast && selectedMovie.credits.cast.length > 0 && (
          <section className="cast-section">
            <h2>Cast</h2>
            <div className="cast-grid">
              {selectedMovie.credits.cast.slice(0, 12).map((person) => (
                <div key={person.id} className="cast-card">
                  {person.profile_path ? (
                    <img
                      src={getImageUrl(person.profile_path, 'w185')}
                      alt={person.name}
                      className="cast-photo"
                    />
                  ) : (
                    <div className="cast-placeholder">
                      {person.name.charAt(0)}
                    </div>
                  )}
                  <div className="cast-info">
                    <h4>{person.name}</h4>
                    <p>{person.character}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Similar Movies Section */}
        {selectedMovie.similar?.results && selectedMovie.similar.results.length > 0 && (
          <section className="similar-section">
            <h2>Similar Movies</h2>
            <div className="similar-grid">
              {selectedMovie.similar.results.slice(0, 6).map((movie) => (
                <div 
                  key={movie.id} 
                  className="similar-card"
                  onClick={() => handleMovieClick(movie.id)}
                >
                  <img
                    src={getImageUrl(movie.poster_path, 'w300')}
                    alt={movie.title}
                    className="similar-poster"
                  />
                  <div className="similar-info">
                    <h4>{movie.title}</h4>
                    <span className="similar-rating">⭐ {movie.vote_average?.toFixed(1) || 'N/A'}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Comments Section */}
        <section className="comments-section">
          <h2>Reviews & Comments</h2>
          
          {/* Add Comment Form */}
          <form onSubmit={handleAddComment} className="comment-form">
            <div className="user-avatar">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Your avatar" />
              ) : (
                <div className="avatar-placeholder">
                  {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </div>
              )}
            </div>
            <div className="comment-input-wrapper">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts about this movie..."
                rows="3"
              />
              <button type="submit" disabled={!comment.trim()}>
                Post Comment
              </button>
            </div>
          </form>

          {/* Display All Comments */}
          <div className="comments-list">
            {allReviews.length === 0 ? (
              <p className="no-comments">No reviews yet. Be the first to share your thoughts!</p>
            ) : (
              allReviews.map((review, index) => (
                <div key={review.id || index} className="comment-card">
                  <div className="comment-header">
                    <div className="comment-avatar">
                      {review.isUserComment ? (
                        user?.photoURL ? (
                          <img src={user.photoURL} alt={user.displayName || 'User'} />
                        ) : (
                          <div className="avatar-placeholder">
                            {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                          </div>
                        )
                      ) : (
                        <div className="avatar-placeholder">
                          {review.author?.charAt(0) || 'A'}
                        </div>
                      )}
                    </div>
                    <div className="comment-info">
                      <h4>
                        {review.isUserComment ? user?.displayName || user?.email || 'You' : review.author}
                        {review.isUserComment && <span className="user-badge">Your Review</span>}
                      </h4>
                      <span className="comment-date">
                        {new Date(review.timestamp || review.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="comment-content">
                    {review.text || review.content}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default MovieDetailsView;
