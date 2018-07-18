import React from "react";

let genCard = ({ poster_path, release_date, title, overview }) => {
  return (
    <div class="media">
      <div class="media-left">
        <p class="image is-64x64">
          <img  src={"https://image.tmdb.org/t/p/w500" + movie.poster_path}/>
        </p>
      </div>
      <div class="media-content">
        <div class="content">
          <p>
            <strong>{title}</strong> 
            <small>{release_date}</small>
            {overview}
          </p>
        </div>
        <nav class="level is-mobile">
          <div class="level-left">
            <a class="level-item">
              <span class="icon is-small">
                <i class="fas fa-reply" />
              </span>
            </a>
            <a class="level-item">
              <span class="icon is-small">
                <i class="fas fa-retweet" />
              </span>
            </a>
            <a class="level-item">
              <span class="icon is-small">
                <i class="fas fa-heart" />
              </span>
            </a>
          </div>
        </nav>
      </div>
      <div class="media-right">
        <button class="delete" />
      </div>
    </div>
  );
};

let SearchResults = props => {
  return (
    <div>
      <ul>
        {props.movies.map(movie => {
          return (
            <li
              onClick={() => {
                props.add(movie);
              }}
            >
              {movie.title} - Release date: {movie.release_date} - Popularity:{" "}
              {movie.popularity}
              <img
               
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SearchResults;
