import React from 'react';


class SearchResults extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      initialPlaylist: []
    }
    this.createPlaylist = this.createPlaylist.bind(this);
  }

  createPlaylist(){
    axios.post('/createPlaylist')
  }

  render () {
  return (
    <div><p>HERE ARE THE SEARCH RESULTS: </p>
    <ul>
    {
      this.props.movies.map((movie) => {
        return (
          <li onClick={() => {this.props.add(movie)}}>
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
}


export default SearchResults