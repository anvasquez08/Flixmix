import React from 'react'
import axios from 'axios';

let Playlist = (props) => {
  
  let createPlaylist = () => {
    axios.post('/createPlaylist', {
      movies: props.movies
    })
    .then(
      console.log('Console logging axios call to create playlist: SUCCESS @ CLIENT')
    )
    .catch((err) => console.log('Console logging error from createPlaylist axios call: ', err))
  }

  return (
    <div>
    <ul>
    {
      props.movies.map((movie) => {
        return (
          <li>{movie.original_title} - Release Date {movie.release_date} - Popularity {movie.popularity}</li>
        )
      })
    }
    </ul>
    <button onClick={createPlaylist}>Create Playlist</button>
    </div>
  )
}


export default Playlist;