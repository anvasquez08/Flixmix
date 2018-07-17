import React from 'react';

let SearchResults = (props) => {
  return (
    <div>
    <ul>
    {
      props.movies.map((movie) => {
        return (
          <li onClick={() => {props.add(movie)}}>
            {movie.title} - Release date: {movie.release_date} - Popularity: {movie.popularity}
            <img src={'https://image.tmdb.org/t/p/w500'+movie.poster_path}></img>
          </li>
        )
      })
    }
    </ul>
    </div>
  )
}


export default SearchResults