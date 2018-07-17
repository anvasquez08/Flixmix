import React from 'react'

let Playlist = (props) => {
  
  return (
    <div>
    <ul>
    {
      props.movies.map((movie, index) => {
        return (
          <div>
          <button onClick={()=>props.moveUp(props.movies, index)}>↑</button>
          <button onClick={()=>props.moveDown(props.movies, index)}>↓</button>
          <b> {movie.original_title} - {movie.release_date} - Popularity {movie.popularity}</b>
          <button onClick={()=>props.delete(index)}>X</button>
          </div>
        )
      })
    }
    </ul>
    <button>Create Playlist</button>
    </div>
  )
}


export default Playlist;