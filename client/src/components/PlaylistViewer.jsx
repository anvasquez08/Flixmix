import React from "react";
import axios from "axios";
import ReactTooltip from "react-tooltip";
import YouTube from "react-youtube";
import genCard from "./genCard.jsx";

//let finalPlaylist = {
// title: playlistTitle,
// authorId: playlistCreateorId,
// author: playlistAuthor,
// movies: []
// }

class PlaylistView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playlist: {
        title: null,
        user: null,
        movies: [
          {
            movieInfo: {
              movieId: null,
              title: "",
              posterPath: "",
              releaseDate: ""
            },
            watched: false,
            showComment: false
          }
        ]
      },
      movies: [],
      playlistDetails: {},
      currentComment: "",
      charactersLeft: 250,
      hoverOpen: false,
      currentVideo: ""
    };
    this.handleWatchedSubmit = this.handleWatchedSubmit.bind(this);
    this.fetchPlaylist = this.fetchPlaylist.bind(this);
    this.fetchMovies = this.fetchMovies.bind(this);
    this.openModal = this.openModal.bind(this);
    this.handleCommentChange = this.handleCommentChange.bind(this);
    this.handleCommentSubmit = this.handleCommentSubmit.bind(this);
    this.handleCommentCancel = this.handleCommentCancel.bind(this);
    this.fetchPlaylist();
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
      charactersLeft: 250 - this.state.currentComment.length
    });
  }

  handleCommentSubmit(event, index, messageText) {
    event.preventDefault();

    //set up all variables we'll use in this function
    let currentMovieId = this.state.playlist.movies[index].movieInfo.movieId;
    let currentUserId = this.props.user_id || 62;
    let currentUsername = this.props.username || "Anon";
    let playlistAuthorId = this.state.playlist.authorId;
    let movieReviewed = this.state.playlist.movies[index].movieInfo.title.slice(
      0,
      30
    );
    let message = `${currentUsername} thought this about ${movieReviewed}: ${
      this.state.currentComment
    }`;

    axios
      .post("flixmix/watched", {
        userId: currentUserId,
        movieId: currentMovieId
      })
      .then(response => {
        this.fetchPlaylist();
      })
      .then(response => {
        this.fetchPlaylist();
      })
      .catch(err => {
        console.error("we had an error updating the watched table", err);
      });

    //the below params are named to reflect db
    axios
      .post("flixmix/addMessage", {
        movieMessage: message,
        messageSenderId: currentUserId,
        messageReceiverId: playlistAuthorId,
        movieId: currentMovieId
      })
      .then(response => {
        console.log("the message was successfully added");
      })
      .catch(err => {
        console.error(
          "there was an error posting this message to the database",
          err
        );
      });
    let updatedPlaylist = this.state.playlist;
    updatedPlaylist.movies[index].showComment = false;
    this.setState({
      charactersLeft: 250,
      currentComment: "",
      playlist: updatedPlaylist
    });
  }
  handleCommentCancel(event, index) {
    event.preventDefault();
    let prevPlaylist = this.state.playlist;
    prevPlaylist.movies[index].showComment = false;
    this.setState({
      charactersLeft: 250,
      currentComment: "",
      playlist: prevPlaylist
    });
  }

  fetchPlaylist() {
    console.log('firing')
    let currentUserId = this.props.user_id || 62;
    let playlistUrl = this.props.endpoint;
    axios
      .post("flixmix/playlistDetails", {
        url: playlistUrl
      })
      .then(res => {
        this.setState({ playlistDetails: res.data[0] });
        this.fetchMovies()
      });
  }

  fetchMovies() {
    console.log('firing'
    )
    axios
      .post("flixmix/playlistMovieIds", {
        id: this.state.playlistDetails.playlist_id
      })
      .then(({data}) => this.setState({movies: data}));
  }

  openModal(index) {
    let movieToSearch = `${
      this.state.playlist.movies[index].movieInfo.title
    } trailer`;
    axios
      .get("flixmix/youtube", {
        params: {
          searchTerm: movieToSearch
        }
      })
      .then(response => {
        this.setState({
          currentVideo: response.data,
          hoverOpen: true
        });
      })
      .catch(err => {
        console.error(
          "there was an error fetching the trailer for this video",
          err
        );
      });
  }

  render() {
    //playlist title, for mvp we will not know the creater and the title of the playlist
    //this logic handles not display the title component in that case
    let youtubeVideo = null;
    ////////////////This set of logic handles the display of the youtube video////////////////
    //youtube config
    let video = (
      <YouTube
        videoId={this.state.currentVideo}
        onReady={this._onReady}
        opts={{
          height: "390",
          width: "640",
          playerVars: {
            autoplay: 1
          }
        }}
      />
    );
    if (this.state.hoverOpen) {
      youtubeVideo = <ReactTooltip id="youtube">{video}</ReactTooltip>;
    }
    // {youtubeVideo}
    // <ul>{movieTiles}</ul>

    // <div />
    console.log(this.state.movies)
    return (
      <div className="columns">
        <div className="column is-parent is-two-thirds is-offset-2" style={{marginTop: "10px"}}>
          {this.state.movies.map(movie => {
              return (
                <div
                  className="message card is-primary "
                  style={{
                    marginLeft: "10px"
                  }}
                >
                  <div className="media-content ">
                    <div className="message-header">
                      {movie.original_title} <small>{movie.release_date}</small>
                    </div>
                  </div>
                  <div className="columns is-vertical">
                    <div className="card-image">
                      <img
                        data-tip
                        data-for="youtube"
                        onMouseLeave={() => this.setState({ hoverOpen: false })}
                        onMouseEnter={() => this.openModal(index)}
                        className="cardimgpreview"
                        src={
                          "https://image.tmdb.org/t/p/w500" + movie.poster_path
                        }
                      />{" "}
                    </div>
                    <div className="column">
                      <p className="subtitle" style={{marginTop: "10px"}}>
                        Leave a comment for your friend!
                      </p>
                      <input className="textarea" type="text" />
                      <button className="button is-danger" style={{marginTop: "10px"}}> Submit Comment</button>
                    </div>
                    <div style={{visibility: "hidden"}}>o
                      </div>
                  </div>
                  <div
                    className="media-right"
                    style={{
                      visibility: "hidden"
                    }}
                  />
                </div>
              );
            })}
        </div>
      </div>
    );
  }
}

export default PlaylistView;

//
