import React from 'react';
import Slider from 'react-slick';
import { getImageUrl } from '../../services/tmdb';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './MovieSlider.css';

const MovieSlider = ({ movies, title }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
  };

  if (!movies || movies.length === 0) return null;

  return (
    <div className="movie-slider-container">
      <h2>{title}</h2>
      <Slider {...settings}>
        {movies.slice(0, 5).map((movie) => (
          <div key={movie.id} className="slider-item">
            <img
              src={getImageUrl(movie.backdrop_path, 'original')}
              alt={movie.title}
              className="slider-image"
            />
            <div className="slider-overlay">
              <h3>{movie.title}</h3>
              <p>{movie.overview}</p>
              <div className="slider-info">
                <span>⭐ {movie.vote_average.toFixed(1)}</span>
                <span>{new Date(movie.release_date).getFullYear()}</span>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default MovieSlider;
