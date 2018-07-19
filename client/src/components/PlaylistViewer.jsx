import React from 'react';
import axios from 'axios';
import ReactTooltip from 'react-tooltip';
import YouTube from 'react-youtube';

class PlaylistView extends React.Component {
  constructor(props) {
    super(props)
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
          watched: false,
          showComment: false  
        }]
      },
      currentComment: '',
      charactersLeft: 250,
      hoverOpen: false,
      currentVideo: ''
    }
    this.handleWatchedSubmit = this.handleWatchedSubmit.bind(this);
    this.fetchPlaylist = this.fetchPlaylist.bind(this);
    this.openModal = this.openModal.bind(this);
    this.handleCommentChange = this.handleCommentChange.bind(this);
    this.handleCommentSubmit = this.handleCommentSubmit.bind(this);
    this.handleCommentCancel = this.handleCommentCancel.bind(this);
  }


  handleWatchedSubmit(event, index) {
    event.preventDefault();
    let updatedPlaylist = this.state.playlist;
    updatedPlaylist.movies[index].showComment = true;
    updatedPlaylist.movies[index].watched = false;
    this.setState({
      playlist: updatedPlaylist
    });

  }

  handleCommentChange(event) {
    this.setState({
      currentComment: event.target.value,
      charactersLeft: (250 - this.state.currentComment.length)
    })
  }

  handleCommentSubmit(event, index, messageText) {
    event.preventDefault();
    
    //set up all variables we'll use in this function
    let currentMovieId = this.state.playlist.movies[index].movieInfo.movieId;
    let currentUserId = this.props.user_id || 2;
    let currentUsername = this.props.username || 'Mitch';
    let playlistAuthorId = this.state.playlist.authorId;
    let movieReviewed = this.state.playlist.movies[index].movieInfo.title.slice(0,30);
    let message = `${currentUsername} thought this about ${movieReviewed}: ${this.state.currentComment}`;

    axios.post('flixmix/watched', {
      userId: currentUserId,
      movieId: currentMovieId
    })
      .then((response) => {
        this.fetchPlaylist();
      })
      .catch((err) => {
        console.error('we had an error updating the watched table', err)
      })

    //the below params are named to reflect db
    axios.post('flixmix/addMessage', {
      movieMessage: message,
      messageSenderId: currentUserId,
      messageReceiverId: playlistAuthorId,
      movieId: currentMovieId
    })
    .then((response) => {
      console.log('the message was successfully added');
    })
    .catch((err) => {
      console.error('there was an error posting this message to the database', err);
    })
    let updatedPlaylist = this.state.playlist;
    updatedPlaylist.movies[index].showComment = false;
    this.setState({
      charactersLeft: 250,
      currentComment: '',
      playlist: updatedPlaylist
    })
  }
  handleCommentCancel(event, index) {
    event.preventDefault();
    let prevPlaylist = this.state.playlist;
    prevPlaylist.movies[index].showComment = false;
    this.setState({
      charactersLeft: 250,
      currentComment: '',
      playlist: prevPlaylist
    })
  }


  fetchPlaylist() {
    let currentUserId = this.props.user_id || 2;
    let playlistUrl = this.props.endpoint || 'opmfck';

    axios.get('flixmix/retrievePlaylist', {
      params: {
        url: playlistUrl,
        userId: currentUserId
      }
    })
    .then((response) => {
      this.setState({
        playlist: response.data
      })
    })
    .catch((err) => {
      console.error('There was a problem fetching this playlist from the db', err)
    })
  }

  openModal(index) {
    let movieToSearch = `${this.state.playlist.movies[index].movieInfo.title} trailer`
    axios.get('flixmix/youtube', {
      params: {
        searchTerm: movieToSearch
      }
    })
      .then((response) => {
        this.setState({
          currentVideo: response.data,
          hoverOpen: true
        })
      })
      .catch((err) => {
        console.error('there was an error fetching the trailer for this video', err)
      })

  }

  componentDidMount() {
    this.fetchPlaylist()
  }

  render() {
    //playlist title, for mvp we will not know the creater and the title of the playlist
    //this logic handles not display the title component in that case
    let playlistTitle = this.state.playlist.title && this.state.playlist.author ? <h4>{this.state.playlist.title} <small>by {this.state.playlist.author} </small></h4> : null;
    let youtubeVideo = null;

    ////////////////This set of logic handles the display of the youtube video////////////////
    //youtube config
    let video =  <YouTube
      videoId = {this.state.currentVideo}
      onReady={this._onReady}
      opts={{
        height: '390',
        width: '640',
        playerVars: {
          autoplay: 1
        }
      }}
    />

    //delay the display of the youtube video
    if (this.state.hoverOpen) {
      youtubeVideo =
        <ReactTooltip id='youtube'>
          {video}
        </ReactTooltip>
    };
    ///////////////////////End of youtube video display logic/////////////////////////////////

    //////////////////////////////////Movie tiles logic////////////////////////////////////////////
    //this logic handles creating the movie tiles by mapping of the playlist in our state
    let movieTiles = this.state.playlist.movies.map((movie, index) => {
    
    let watchToggle = <p>Comment Submitted!</p>;
      if (!movie.watched) {
        watchToggle = 
        <form onSubmit={(event) => this.handleWatchedSubmit(event, index)}>
          <input type="submit" value="WATCHED" />
        </form>
      }
      /***///////////////////////////////comment box logic//////////////////////////////////////////
      let commentBox = null;
      if (movie.showComment) {
        console.log('the statee is trueeee')
        commentBox = 
          <div>
            <form onSubmit={(event) => {this.handleCommentSubmit(event, index)}}>
              <p>Characters Left: {this.state.charactersLeft}</p>
              <label>
                What'd you think of the movie?
                <input type="text" value={this.state.currentComment} onChange={this.handleCommentChange}/>
              </label>
              <input type="submit" value="Submit" />
            </form>
            <form onSubmit={(event) => {this.handleCommentCancel(event, index)}}>
              <input type="submit" value="Cancel Comment" />
            </form>
          </div>
      }
      /****//////////////////////////////End of comment box logic///////////////////////////////////

      return (
        <li key={movie.movieInfo.movieId}>
          <h5 >{movie.movieInfo.title}</h5>
          <img data-tip data-for='youtube' onMouseLeave={()=>this.setState({hoverOpen: false})} onMouseEnter={() => this.openModal(index)} src={`https://image.tmdb.org/t/p/w300${movie.movieInfo.posterPath}`} />
          <p>Release Date: {movie.movieInfo.releaseDate}</p>
          <p>Popularity: {movie.movieInfo.popularity}</p>
          {watchToggle}
          {commentBox}
        </li>
      )
    })
    /////////////////////////////////////End of movie tiles logic//////////////////////////////

    //what the page is actually rending, logic for variables are above
    return (
      <div>
        {playlistTitle}
        {youtubeVideo}
        <ul>
          {movieTiles}
        </ul>
        <div>
        </div>
      </div>
    )
  }
}

export default PlaylistView;

//
