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
      currentComment: "",
      charactersLeft: 250,
      hoverOpen: false,
      currentVideo: ""
    };
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
      charactersLeft: 250 - this.state.currentComment.length
    });
  }

  handleCommentSubmit(event, index, messageText) {
    event.preventDefault();

    //set up all variables we'll use in this function
    let currentMovieId = this.state.playlist.movies[index].movieInfo.movieId;
    let currentUserId = this.props.user_id || 2;
    let currentUsername = this.props.username || "Mitch";
    let playlistAuthor = this.state.playlist.author;
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
    let currentUserId = this.props.user_id || 62;
    let playlistUrl = this.props.endpoint;

    axios
      .get("flixmix/retrievePlaylist", {
        params: {
          url: playlistUrl,
          userId: currentUserId
        }
      })
      .then(response => {
        this.setState({
          playlist: response.data
        });
      })
      .catch(err => {
        console.error(
          "There was a problem fetching this playlist from the db",
          err
        );
      });
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

  componentDidMount() {
    this.fetchPlaylist();
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
    return (
      <div className="columns is-vertical is-8 is-off-set-4">
        <div className="column is-parent">
          {            this.state.playlist.movies
            .map(movie => {
              console.log(movie.movieInfo.posterPath);
              return {
                poster_path: movie.movieInfo.posterPath,
                release_date: movie.movieInfo.releaseDate,
                title: movie.movieInfo.title,
                overview: ""
              };
            })
            .map(info => {
              return (
                <div
                  className="message card is-warning weird"
                  style={{
                    marginLeft: "10px"
                  }}
                >
                  <div className="media-content ">
                    <div className="message-header">
                      {info.title} <small>{info.releaseDate}</small>
                    </div>
                  </div>
                  <div className="column">
                    <div className="card-image column is-2">
                      <p className=" image">
                        <img
                          data-tip
                          data-for="youtube"
                          onMouseLeave={() =>
                            this.setState({ hoverOpen: false })
                          }
                          onMouseEnter={() => this.openModal(index)}
                          className="cardimgpreview"
                          src={
                            "https://image.tmdb.org/t/p/w500" + info.poster_path
                          }
                        />
                      </p>
                    </div>
                    <div className="message-body message-body-movie column is-8">
                      <p style={{}}>
                        <small>input box</small>
                      </p>
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
