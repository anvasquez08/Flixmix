import React from 'React'
import axios from 'axios'

class PlaylistView extends React.Component {
  constructor() {
    super()
    this.state = {
      playlist: {  title: null,
      user: null,
      movies: [
        {
          movieInfo: {
            movieId: null,
            title: '',
            posterPath: '',
            releaseDate: ''
          },
          watched: false
        }]
      },
      showComment: false
    }
    this.handleWatchedSubmit = this.handleWatchedSubmit.bind(this);
    this.fetchPlaylist = this.fetchPlaylist.bind(this);
  }

  handleWatchedSubmit(event, index) {
    event.preventDefault();
    
    let currentMovieId = this.state.playlist.movies[index].movieInfo.movieId;
    let currentUserId = this.props.userId || 82

    axios.post('mixflix/watched', {
      userId: currentUserId,
      movieId: currentMovieId
    })
      .then((response) => {
        this.fetchPlaylist();
      })
      .catch((err) => {
        console.error('we had an error updating the watched table', err)
      })

  }

  fetchPlaylist() {
    let currentUserId = this.props.userId || 82;
    let playlistUrl = this.props.endpoint || 'abcde';

    axios.get('mixflix/retrievePlaylist', {
      params: {
        url: playlistUrl,
        userId: currentUserId
      }
    })
    .then((response) => {
      console.log('the response to the playlist endpoint in the client', response)
      this.setState({
        playlist: response.data
      })
    })
    .catch((err) => {
      console.error('There was a problem fetching this playlist from the db', err)
    })
  }

  componentDidMount() {
    this.fetchPlaylist()
  }

  render() {
    //playlist title, for mvp we will not know the creater and the title of the playlist
    //this logic handles not display the title component in that case
    let playlistTitle = this.state.playlist.title && this.state.playlist.user ? <h4>{this.state.playlist.title} <small>by {this.state.playlist.user} </small></h4> : null;
    
    //this logic handles creating the movie tiles by mapping of the playlist in our state
    let movieTiles = this.state.playlist.movies.map((movie, index) => {
    let watchToggle = <p>You watched this movie already!</p>;
      if (!movie.watched) {
        watchToggle = 
        <form onSubmit={(event) => this.handleWatchedSubmit(event, index)}>
          <input type="submit" value="WATCHED" />
        </form>
      }
      return (
        <li key={movie.movieInfo.movieId}>
          <h5>{movie.movieInfo.title}</h5>
          <img src={movie.movieInfo.posterPath} />
          <p>Release Date: {movie.movieInfo.releaseDate}</p>
          <p>Popularity: {movie.movieInfo.popularity}</p>
          {watchToggle}
        </li>
      )
    })

    //what the page is actually rending, logic for variables are above
    return (
      <div>
        {playlistTitle}
        <ul>
          {movieTiles}
        </ul>
      </div>
    )
  }
}

export default PlaylistView;
